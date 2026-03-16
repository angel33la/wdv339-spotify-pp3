export default function SearchResultCard({ song, playlists, onPlay, onAdd }) {
  return (
    <div
      style={{
        fontSize: "1.25rem",
        color: "#fff",
        padding: "20px",
        borderRadius: "5px 5px 5px 5px",
      }}
    >
      <img src={song.thumbnail} alt={song.title} width="140" />
      <h3>{song.title}</h3>
      <p>{song.channelTitle}</p>

      <button
        style={{
          padding: "11px",
          fontSize: "1.2rem",
          width: "100px",
          borderRadius: "5px 5px 5px 5px",
          backgroundColor: "#fff",
          color: "#1a143c",
        }}
        onClick={() => onPlay(song)}
      >
        Play
      </button>

      {playlists.map((playlist) => (
        <button
          style={{
            padding: "11px",
            fontSize: "1.2rem",
            width: "100px",
            borderRadius: "5px 5px 5px 5px",
            backgroundColor: "#fff",
            color: "#1a143c",
          }}
          key={playlist._id}
          onClick={() => onAdd(playlist._id, song)}
        >
          Add to {playlist.name}
        </button>
      ))}
    </div>
  );
}
