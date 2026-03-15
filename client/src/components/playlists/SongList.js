export default function SongList({ songs, onPlay, onRemove }) {
  return (
    <div>
      {songs.map((song) => (
        <div key={song.videoId}>
          <img src={song.thumbnail} alt={song.title} width="120" />
          <div>{song.title}</div>
          <div>{song.channelTitle}</div>
          <button onClick={() => onPlay(song)}>Play</button>
          {onRemove && (
            <button onClick={() => onRemove(song.videoId)}>Remove</button>
          )}
        </div>
      ))}
    </div>
  );
}
