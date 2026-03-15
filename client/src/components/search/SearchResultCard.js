export default function SearchResultCard({ song, playlists, onPlay, onAdd }) {
  return (
    <div>
      <img src={song.thumbnail} alt={song.title} width="140" />
      <h3>{song.title}</h3>
      <p>{song.channelTitle}</p>

      <button onClick={() => onPlay(song)}>Play</button>

      {playlists.map((playlist) => (
        <button key={playlist._id} onClick={() => onAdd(playlist._id, song)}>
          Add to {playlist.name}
        </button>
      ))}
    </div>
  );
}
