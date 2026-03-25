import { useContext, useState } from "react";
import { message, Typography } from "antd";
import { createPlaylist, deletePlaylist } from "../api/playlistApi";
import { AuthContext } from "../context/AuthContext";
import { PlaylistContext } from "../context/PlaylistContext";
import CreatePlaylistForm from "../components/playlists/CreatePlaylistForm";
import PlaylistCard from "../components/playlists/PlayListCard";

export default function Playlists() {
  const { token, loading: authLoading } = useContext(AuthContext);
  const {
    playlists,
    loading,
    error: playlistError,
    refreshPlaylists,
  } = useContext(PlaylistContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [error, setError] = useState("");
  const [deletingPlaylistId, setDeletingPlaylistId] = useState("");

  const handleCreate = async (name) => {
    if (!token) {
      setError("Please sign in to create playlists.");
      return;
    }

    try {
      setError("");
      await createPlaylist(name, token);
      await refreshPlaylists();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create playlist.");
    }
  };

  const handleDelete = async (playlistId) => {
    try {
      setDeletingPlaylistId(playlistId);
      await deletePlaylist(playlistId, token);
      messageApi.success("Playlist deleted.");
      await refreshPlaylists();
    } catch (err) {
      messageApi.error(
        err?.response?.data?.message || "Failed to delete playlist.",
      );
    } finally {
      setDeletingPlaylistId("");
    }
  };

  if (authLoading || loading) {
    return <Typography.Text>Loading playlists...</Typography.Text>;
  }

  if (!token) {
    return (
      <Typography.Text>Please sign in to view your playlists.</Typography.Text>
    );
  }

  return (
    <div className="playlistsPage">
      {contextHolder}
      <Typography.Title level={1} className="playlistsTitle">
        Your Playlists
      </Typography.Title>
      {error || playlistError ? (
        <Typography.Text type="danger">
          {error || playlistError}
        </Typography.Text>
      ) : null}
      <CreatePlaylistForm onCreate={handleCreate} />
      <div className="playlistsGrid">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist._id}
            playlist={playlist}
            onDelete={handleDelete}
            isDeleting={deletingPlaylistId === playlist._id}
          />
        ))}
      </div>
    </div>
  );
}
