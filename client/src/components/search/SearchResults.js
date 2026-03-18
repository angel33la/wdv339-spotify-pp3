import SearchResultCard from "./SearchResultCard";

export default function SearchResults({
  results,
  playlists,
  onPlay,
  onAdd,
  onQueue,
}) {
  if (!results.length) return null;

  return (
    <div className="search-results-grid">
      {results.map((song) => (
        <SearchResultCard
          key={song.videoId}
          song={song}
          playlists={playlists}
          onPlay={onPlay}
          onAdd={onAdd}
          onQueue={onQueue}
        />
      ))}
    </div>
  );
}
