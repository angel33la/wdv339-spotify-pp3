import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchResultCard({ song, playlists, onPlay, onAdd }) {
  const navigate = useNavigate();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(
    playlists[0]?._id || "",
  );

  useEffect(() => {
    if (!playlists.length) {
      setSelectedPlaylistId("");
      return;
    }

    const currentStillExists = playlists.some(
      (playlist) => playlist._id === selectedPlaylistId,
    );

    if (!currentStillExists) {
      setSelectedPlaylistId(playlists[0]._id);
    }
  }, [playlists, selectedPlaylistId]);

  const handleAddSelected = () => {
    if (!selectedPlaylistId) return;
    onAdd(selectedPlaylistId, song);
  };

  const handleOpenSelected = () => {
    if (!selectedPlaylistId) return;
    navigate(`/playlists/${selectedPlaylistId}`);
  };

  return (
    <article className="search-result-card">
      <img
        className="search-result-thumb"
        src={song.thumbnail}
        alt={song.title}
      />
      <h3>{song.title}</h3>
      <p>{song.channelTitle}</p>

      <div className="search-result-actions">
        <button className="search-result-action" onClick={() => onPlay(song)}>
          Play
        </button>

        <div className="search-result-add-row">
          <select
            className="search-result-select"
            value={selectedPlaylistId}
            onChange={(e) => setSelectedPlaylistId(e.target.value)}
            disabled={!playlists.length}
          >
            {!playlists.length ? (
              <option value="">No playlists</option>
            ) : (
              playlists.map((playlist) => (
                <option key={playlist._id} value={playlist._id}>
                  {playlist.name}
                </option>
              ))
            )}
          </select>

          <button
            className="search-result-action"
            onClick={handleAddSelected}
            disabled={!selectedPlaylistId}
          >
            Add
          </button>
        </div>

        <button
          className="search-result-action search-result-open"
          onClick={handleOpenSelected}
          disabled={!selectedPlaylistId}
        >
          Open Playlist
        </button>
      </div>
    </article>
  );
}
