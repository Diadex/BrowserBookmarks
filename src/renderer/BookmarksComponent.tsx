import React, { useState } from 'react';
import deleteIcon from '../../assets/icons/delete.svg'; // Path to your SVG file

const BookmarksComponent = ({ bookmarks }: { bookmarks: any[] }) => {
  const [decryptedContent, setDecryptedContent] = useState(null);

  const decryptBookmark = async (encryptedId: number) => {
    try {
      const result = await window.electron.ipcRenderer.invoke(
        'decrypt-bookmark',
        encryptedId,
      );
      console.log(result);
      setDecryptedContent(result);
    } catch (error) {
      console.error(error);
      // Handle errors if any
    }
  };

  const handleDecryptClick = async (bookmarkId: number) => {
    await decryptBookmark(bookmarkId);
  };

  const openArticle = (bookmark: any) => {
    window.electron.ipcRenderer.invoke('open-article', bookmark);
  };

  return (
    <div style={{ marginTop: 40, overflow: "auto", maxHeight: "80vh" }}>
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id} className="bookmark" style={{ marginLeft: 20 }}>
          <h3>
            #{bookmark.id} {bookmark.title}
          </h3>
          <p>Type: {bookmark.type}</p>
          {bookmark.type === 'article' && (
            <button onClick={() => openArticle(bookmark)}>Open Article</button>
          )}
          {bookmark.type === 'encrypted' && (
            <button onClick={() => handleDecryptClick(bookmark.id)}>
              Decrypt
            </button>
          )}
          {bookmark.type !== 'encrypted' && bookmark.type !== 'article' && (
            <div>
              <h4>Content:</h4>
              {/* <pre>{JSON.stringify(bookmark.content, null, 2)}</pre> */}
            </div>
          )}
          {bookmark.type === 'url' && (
            <p>
              URL: <a href={bookmark.url}>{bookmark.url}</a>
            </p>
          )}
          {/* Display decrypted content if available */}
          {decryptedContent &&
            bookmark.id === JSON.parse(decryptedContent).id ? (
            <div className="bookmark">
              <p>Type: {JSON.parse(decryptedContent).type}</p>
              <h4>Title: {JSON.parse(decryptedContent).title}</h4>
              {JSON.parse(decryptedContent).type === 'article' ? (
                <button onClick={() => openArticle(JSON.parse(decryptedContent))}>Open Article</button>
              ) : (
                <div>
                  <h4>Content:</h4>
                  <pre>{JSON.parse(decryptedContent).content}</pre>
                  <h4>URL:</h4>
                  <a href={JSON.parse(decryptedContent).url}>
                    {JSON.parse(decryptedContent).url}
                  </a>
                </div>
              )}
            </div>
          ) : null}
          <div style={{ marginTop: 10 }}>
            <button style={{ backgroundColor: "#F65454" ,display:'flex',}}>    
                  Delete 
                  <img src={deleteIcon} style={{ width: '100%', height: '100%' }} />
            </button>

          </div>
        </div>
      ))}
    </div>
  );
};

export default BookmarksComponent;
