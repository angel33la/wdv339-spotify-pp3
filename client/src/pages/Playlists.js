import { useCallback, useContext, useEffect, useState } from "react";
import { createPlaylist, getPlaylists } from "../api/playlistApi";
import { AuthContext } from "../context/AuthContext";
import CreatePlaylistForm from "../components/playlists/CreatePlaylistForm";
import PlaylistCard from "../components/playlists/PlayListCard";

export default function Playlists() {
  const { token, loading: authLoading } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPlaylists = useCallback(async () => {
    if (!token) {
      setPlaylists([]);
      setLoading(false);
      return;
    }

    try {
      setError("");
      const data = await getPlaylists(token);
      setPlaylists(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load playlists.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    setLoading(true);
    loadPlaylists();
  }, [authLoading, loadPlaylists]);

  const handleCreate = async (name) => {
    if (!token) {
      setError("Please sign in to create playlists.");
      return;
    }

    try {
      setError("");
      await createPlaylist(name, token);
      await loadPlaylists();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create playlist.");
    }
  };

  if (authLoading || loading) {
    return <div>Loading playlists...</div>;
  }

  if (!token) {
    return <div>Please sign in to view your playlists.</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto",
        gap: "80px",
        maxWidth: "100%",
      }}
    >
      <h1 style={{ fontSize: "4rem", color: "#8c52ff" }}>Your Playlists</h1>
      {error ? <p>{error}</p> : null}
      <CreatePlaylistForm onCreate={handleCreate} />
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist._id} playlist={playlist} />
      ))}
    </div>
  );
}
