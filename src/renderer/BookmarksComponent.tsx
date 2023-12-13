import React from 'react';

const BookmarksComponent = ({ bookmarks }: { bookmarks: any[] }) => {
  return (
    <div
      style={{
        marginTop: 40,
      }}
    >
      {bookmarks.map((bookmark) => (
        <div key={bookmark.id} className="bookmark">
          <h3>#{bookmark.id} {bookmark.title}</h3>
          <p>Type: {bookmark.type}</p>
          {bookmark.type === 'article' && <button>Open Article</button>}
          {bookmark.type === 'encrypted' && <button>Decrypt</button>}
          {bookmark.content && bookmark.type !== 'encrypted' && bookmark.type !== 'article' ? (
            <div>
              <h4>Content:</h4>
              {/* <pre>{JSON.stringify(bookmark.content, null, 2)}</pre> */}
            </div>
          ): null}
          <p>
            URL: <a href={bookmark.url}>{bookmark.url}</a>
          </p>
        </div>
      ))}
    </div>
  );
};

export default BookmarksComponent;
