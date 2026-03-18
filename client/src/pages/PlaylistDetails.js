import { useCallback, useContext, useEffect, useState } from "react";
import { Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPlaylist,
  removeSongFromPlaylist,
  updatePlaylistName,
} from "../api/playlistApi";
import { AuthContext } from "../context/AuthContext";
import SongList from "../components/playlists/SongList";
import VideoPlayer from "../components/player/VideoPlayer";

export default function PlaylistDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [playlist, setPlaylist] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [error, setError] = useState("");

  const loadPlaylist = useCallback(async () => {
    try {
      setError("");
      const data = await getPlaylist(id, token);
      setPlaylist(data);
      setNameDraft(data.name || "");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load playlist.");
    }
  }, [id, token]);

  useEffect(() => {
    loadPlaylist();
  }, [loadPlaylist]);

  const handleRemove = async (songId) => {
    await removeSongFromPlaylist(id, songId, token);
    await loadPlaylist();
  };

  const handleSaveName = async (e) => {
    e.preventDefault();

    if (!nameDraft.trim()) {
      setError("Playlist name is required.");
      return;
    }

    try {
      setError("");
      setIsSavingName(true);
      await updatePlaylistName(id, nameDraft.trim(), token);
      await loadPlaylist();
      setIsEditing(false);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update playlist.");
    } finally {
      setIsSavingName(false);
    }
  };

  if (!playlist) return <Typography.Text>Loading...</Typography.Text>;

  return (
    <div className="playlist-details-page">
      <section className="playlist-details-header">
        {isEditing ? (
          <form className="playlist-edit-form" onSubmit={handleSaveName}>
            <input
              className="playlist-edit-input"
              type="text"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder="Playlist name"
            />
            <button type="submit" disabled={isSavingName}>
              {isSavingName ? "Saving..." : "Save Name"}
            </button>
            <button
              type="button"
              className="search-result-action search-result-open"
              onClick={() => {
                setIsEditing(false);
                setNameDraft(playlist.name || "");
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <Typography.Title level={1} className="playlists-title">
            {playlist.name}
          </Typography.Title>
        )}
        <Typography.Text type="secondary" className="playlist-details-count">
          {playlist.songs.length} videos
        </Typography.Text>
        {error ? (
          <Typography.Text type="danger" className="home-error">
            {error}
          </Typography.Text>
        ) : null}
        <div className="playlist-details-toolbar">
          <button onClick={() => setIsEditing((prev) => !prev)}>
            {isEditing ? "Done Editing" : "Edit Playlist"}
          </button>
          <button
            className="search-result-action search-result-open"
            onClick={() => navigate("/")}
          >
            Add Videos
          </button>
        </div>
      </section>

      <section className="playlist-content">
        <div className="playlist-player-section">
          <Typography.Title level={2} className="playlist-player-title">
            {selectedSong?.title || "Select a video to play"}
          </Typography.Title>
          <div className="playlist-mini-player">
            <VideoPlayer videoId={selectedSong?.videoId} />
          </div>
        </div>

        <div className="playlist-songs-section">
          <Typography.Title level={2} className="playlist-songs-title">
            Songs in Playlist
          </Typography.Title>
          <SongList
            songs={playlist.songs}
            onPlay={setSelectedSong}
            onRemove={isEditing ? handleRemove : undefined}
          />
        </div>
      </section>
    </div>
  );
}
