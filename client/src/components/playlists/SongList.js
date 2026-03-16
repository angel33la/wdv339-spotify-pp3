export default function SongList({ songs, onPlay, onRemove }) {
  if (!songs.length) {
    return (
      <p className="playlist-empty-state">No videos in this playlist yet.</p>
    );
  }

  return (
    <div className="playlist-songs-grid">
      {songs.map((song) => (
        <article key={song.videoId} className="playlist-song-card">
          <img
            className="playlist-song-thumb"
            src={song.thumbnail}
            alt={song.title}
          />
          <h3>{song.title}</h3>
          <p>{song.channelTitle}</p>
          <div className="playlist-song-actions">
            <button
              className="search-result-action"
              onClick={() => onPlay(song)}
            >
              Play
            </button>
            {onRemove && (
              <button
                className="search-result-action search-result-open"
                onClick={() => onRemove(song.videoId)}
              >
                Remove
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
