import SearchResultCard from "./SearchResultCard";

export default function SearchResults({
  results,
  playlists,
  onPlay,
  onAdd,
  onQueue,
  onSaveSong,
}) {
  if (!results.length) return null;

  return (
    <div className="searchResultsGrid">
      {results.map((song) => (
        <SearchResultCard
          key={song.videoId}
          song={song}
          playlists={playlists}
          onPlay={onPlay}
          onAdd={onAdd}
          onQueue={onQueue}
          onSaveSong={onSaveSong}
        />
      ))}
    </div>
  );
}
