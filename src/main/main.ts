/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import * as fs from 'fs';
import { Readability } from '@mozilla/readability';
import jsdom from 'jsdom';
import prompt from 'electron-prompt';
import jfe from 'json-file-encrypt';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let childWindow: BrowserWindow | null = null;
const { JSDOM } = jsdom;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.handle('get-bookmarks', async (event, arg) => {
  const bookmarks = JSON.parse(
    fs.readFileSync(
      path.join(
        app.getPath('documents'),
        'BrowserBook',
        'Bookmarks',
        'bookmarks.json',
      ),
      'utf8',
    ),
  ).bookmarks;
  return bookmarks;
});

ipcMain.handle('open-article', async (event, arg) => {
  const bookmarks = JSON.parse(
    fs.readFileSync(
      path.join(
        app.getPath('documents'),
        'BrowserBook',
        'Bookmarks',
        'bookmarks.json',
      ),
      'utf8',
    ),
  ).bookmarks;
  console.log(arg);
  fs.writeFileSync(
    path.join(
      app.getPath('documents'),
      'BrowserBook',
      'Bookmarks',
      arg.title + '.html',
    ),
    arg.content,
  );
  const filePath = path.join(
    app.getPath('documents'),
    'BrowserBook',
    'Bookmarks',
    arg.title + '.html',
  );

  childWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    parent: mainWindow,
    webPreferences: {
      webviewTag: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },

    modal: true,
    title: arg.title,
  });

  childWindow?.loadURL(filePath);
  childWindow?.on('ready-to-show', () => {
    if (!childWindow) {
      throw new Error('"childWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      childWindow.minimize();
    } else {
      childWindow.show();
    }
  });

  childWindow?.on('closed', () => {
    childWindow = null;
    fs.unlinkSync(filePath);
  });
});

ipcMain.handle('decrypt-bookmark', async (event, arg) => {
  try {
    const id = arg;
    const bookmarks = JSON.parse(
      fs.readFileSync(
        path.join(
          app.getPath('documents'),
          'BrowserBook',
          'Bookmarks',
          'bookmarks.json',
        ),
        'utf8',
      ),
    ).bookmarks;
    const bookmark = bookmarks.find((bookmark: any) => bookmark.id === id);
    const decryptedContent = await new Promise((resolve, reject) => {
      prompt({
        title: 'Enter Password',
        label: 'Enter the password for this bookmark to decrypt it',
        value: 'pass123',
        type: 'input',
      })
        .then((r: string | null) => {
          if (r === null) {
            console.log('user cancelled');
            reject(new Error('User cancelled decryption'));
          } else {
            console.log(r);
            const key = new jfe.encryptor(r);
            const decryptedBookmark = key.decrypt(bookmark.content);
            console.log(decryptedBookmark);
            resolve(decryptedBookmark);
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
    return decryptedContent;
  } catch (error) {
    console.error(error);
  }
});

ipcMain.handle('save-url', async (event, arg) => {
  const { encryption, url } = arg;

  if (encryption) {
    prompt({
      title: 'Enter Password',
      label: 'Create a password for this bookmark',
      value: 'pass123',
      type: 'input',
    })
      .then((r: string | null) => {
        if (r === null) {
          console.log('user cancelled');
        } else {
          fs.readFile(
            path.join(
              app.getPath('documents'),
              'BrowserBook',
              'Bookmarks',
              'bookmarks.json',
            ),
            'utf8',
            (err, data) => {
              if (err) {
                console.error(err);
                return;
              }
              try {
                const jsonData = JSON.parse(data);
                // Create new bookmark data
                const newBookmark = {
                  id: jsonData.nextId,
                  type: 'url',
                  title: 'test',
                  content: null,
                  url: url,
                };
                const key = new jfe.encryptor(r);
                const encryptedBookmark = key.encrypt(
                  JSON.stringify(newBookmark),
                );

                const newBookmarkEntry = {
                  id: jsonData.nextId,
                  type: 'encrypted',
                  content: encryptedBookmark,
                };

                // Increment count and nextId
                jsonData.count++;
                jsonData.nextId++;

                // Add the new bookmark to bookmarks array
                jsonData.bookmarks.push(newBookmarkEntry);

                // Convert object back to JSON
                const updatedJsonData = JSON.stringify(jsonData, null, 2);

                // Write the updated JSON back to the file
                fs.writeFile(
                  path.join(
                    app.getPath('documents'),
                    'BrowserBook',
                    'Bookmarks',
                    'bookmarks.json',
                  ),
                  updatedJsonData,
                  'utf8',
                  (err) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                    console.log('Data added successfully!');
                  },
                );
              } catch (err) {
                console.error(err);
              }
            },
          );
        }
      })
      .catch(console.error);
  } else {
    fs.readFile(
      path.join(
        app.getPath('documents'),
        'BrowserBook',
        'Bookmarks',
        'bookmarks.json',
      ),
      'utf8',
      (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        try {
          const jsonData = JSON.parse(data);

          // Create new bookmark data
          const newBookmark = {
            id: jsonData.nextId,
            type: 'url',
            title: 'test',
            content: null,
            url: url,
          };

          // Increment count and nextId
          jsonData.count++;
          jsonData.nextId++;

          // Add the new bookmark to bookmarks array
          jsonData.bookmarks.push(newBookmark);

          // Convert object back to JSON
          const updatedJsonData = JSON.stringify(jsonData, null, 2);

          // Write the updated JSON back to the file
          fs.writeFile(
            path.join(
              app.getPath('documents'),
              'BrowserBook',
              'Bookmarks',
              'bookmarks.json',
            ),
            updatedJsonData,
            'utf8',
            (err) => {
              if (err) {
                console.error(err);
                return;
              }
              console.log('Data added successfully!');
            },
          );
        } catch (err) {
          console.error(err);
        }
      },
    );
  }
});

ipcMain.handle('save-readable', async (event, arg) => {
  const { encryption, url } = arg;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const htmlString = await response.text();

    const { window } = new JSDOM(htmlString);
    const { document } = window;

    const reader = new Readability(document).parse();

    // Perform other operations as needed...
    // const tempDiv = document.createElement('div');
    // tempDiv.innerHTML = reader.content;

    // // const anchors = tempDiv.querySelectorAll('a');

    // // anchors.forEach((anchor) => {
    // //   const href = anchor.getAttribute('href');
    // //   if (href && isRelativePath(href)) {
    // //     anchor.setAttribute('href', extractRootDomain(arg) + href);
    // //   }
    // // });

    // reader.content = tempDiv.innerHTML;
    if (reader) {
      reader.content =
        '<head><link rel="stylesheet" type="text/css" href="styles.css"></head>' +
        reader.content;

      // const filePath = path.join(
      //   app.getPath('documents'),
      //   'BrowserBook',
      //   'Bookmarks',
      //   reader.title + '.html',
      // );
      // fs.writeFileSync(filePath, reader.content);

      if (encryption) {
        prompt({
          title: 'Enter Password',
          label: 'Create a password for this bookmark',
          value: 'pass123',
          type: 'input',
        })
          .then((r: string | null) => {
            if (r === null) {
              console.log('user cancelled');
            } else {
              fs.readFile(
                path.join(
                  app.getPath('documents'),
                  'BrowserBook',
                  'Bookmarks',
                  'bookmarks.json',
                ),
                'utf8',
                (err, data) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                  try {
                    const jsonData = JSON.parse(data);
                    // Create new bookmark data
                    const newBookmark = {
                      id: jsonData.nextId,
                      type: 'article',
                      title: reader.title,
                      content: reader.content,
                      url: url,
                    };
                    const key = new jfe.encryptor(r);
                    const encryptedBookmark = key.encrypt(
                      JSON.stringify(newBookmark),
                    );

                    const newBookmarkEntry = {
                      id: jsonData.nextId,
                      type: 'encrypted',
                      title: reader.title,
                      content: encryptedBookmark,
                    };

                    // Increment count and nextId
                    jsonData.count++;
                    jsonData.nextId++;

                    // Add the new bookmark to bookmarks array
                    jsonData.bookmarks.push(newBookmarkEntry);

                    // Convert object back to JSON
                    const updatedJsonData = JSON.stringify(jsonData, null, 2);

                    // Write the updated JSON back to the file
                    fs.writeFile(
                      path.join(
                        app.getPath('documents'),
                        'BrowserBook',
                        'Bookmarks',
                        'bookmarks.json',
                      ),
                      updatedJsonData,
                      'utf8',
                      (err) => {
                        if (err) {
                          console.error(err);
                          return;
                        }
                        console.log('Data added successfully!');
                      },
                    );
                  } catch (err) {
                    console.error(err);
                  }
                },
              );
            }
          })
          .catch(console.error);
      } else {
        fs.readFile(
          path.join(
            app.getPath('documents'),
            'BrowserBook',
            'Bookmarks',
            'bookmarks.json',
          ),
          'utf8',
          (err, data) => {
            if (err) {
              console.error(err);
              return;
            }
            try {
              const jsonData = JSON.parse(data);

              // Create new bookmark data
              const newBookmark = {
                id: jsonData.nextId,
                type: 'article',
                title: reader.title,
                content: reader,
                url: arg,
              };

              // Increment count and nextId
              jsonData.count++;
              jsonData.nextId++;

              // Add the new bookmark to bookmarks array
              jsonData.bookmarks.push(newBookmark);

              // Convert object back to JSON
              const updatedJsonData = JSON.stringify(jsonData, null, 2);

              // Write the updated JSON back to the file
              fs.writeFile(
                path.join(
                  app.getPath('documents'),
                  'BrowserBook',
                  'Bookmarks',
                  'bookmarks.json',
                ),
                updatedJsonData,
                'utf8',
                (err) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                  console.log('Data added successfully!');
                },
              );
            } catch (err) {
              console.error(err);
            }
          },
        );
      }
    } else {
      console.error('No reader found');
    }
  } catch (err) {
    console.error(err);
  }
  return 'pong';
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    if (
      !fs.existsSync(
        path.join(
          app.getPath('documents'),
          'BrowserBook',
          'Bookmarks',
          'bookmarks.json',
        ),
      )
    ) {
      if (!fs.existsSync(path.join(app.getPath('documents'), 'BrowserBook')))
        fs.mkdirSync(path.join(app.getPath('documents'), 'BrowserBook'));
      if (
        !fs.existsSync(
          path.join(app.getPath('documents'), 'BrowserBook', 'Bookmarks'),
        )
      )
        fs.mkdirSync(
          path.join(app.getPath('documents'), 'BrowserBook', 'Bookmarks'),
        );
      fs.writeFileSync(
        path.join(
          app.getPath('documents'),
          'BrowserBook',
          'Bookmarks',
          'bookmarks.json',
        ),
        JSON.stringify(
          {
            count: 0,
            nextId: 1,
            bookmarks: [],
          },
          null,
          2,
        ),
      );
    }
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
