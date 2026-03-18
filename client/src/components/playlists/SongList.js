import { Typography } from "antd";

export default function SongList({ songs, onPlay, onRemove }) {
  if (!songs.length) {
    return (
      <Typography.Paragraph className="playlist-empty-state">
        No videos in this playlist yet.
      </Typography.Paragraph>
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
          <Typography.Title level={5} style={{ margin: "4px 0 0" }}>
            {song.title}
          </Typography.Title>
          <Typography.Text type="secondary">
            {song.channelTitle}
          </Typography.Text>
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
