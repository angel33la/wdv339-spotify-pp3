import SearchResultCard from "./SearchResultCard";

export default function SearchResults({ results, playlists, onPlay, onAdd }) {
  return (
    <div>
      {results.map((song) => (
        <SearchResultCard
          key={song.videoId}
          song={song}
          playlists={playlists}
          onPlay={onPlay}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}
