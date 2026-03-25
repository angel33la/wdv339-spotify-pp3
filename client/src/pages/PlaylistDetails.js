import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Input, message, Popconfirm, Typography } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  deletePlaylist,
  getPlaylist,
  removeSongFromPlaylist,
  updatePlaylistName,
} from "../api/playlistApi";
import { AuthContext } from "../context/AuthContext";
import { PlayerContext } from "../context/PlayerContext";
import SongList from "../components/playlists/SongList";
import VideoPlayer from "../components/player/VideoPlayer";

export default function PlaylistDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const { currentSong, setCurrentSong } = useContext(PlayerContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [playlist, setPlaylist] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [isDeletingPlaylist, setIsDeletingPlaylist] = useState(false);
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
    try {
      await removeSongFromPlaylist(id, songId, token);
      messageApi.success("Song removed from playlist.");
      await loadPlaylist();
    } catch (err) {
      messageApi.error(
        err?.response?.data?.message || "Failed to remove song from playlist.",
      );
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      setIsDeletingPlaylist(true);
      await deletePlaylist(id, token);
      messageApi.success("Playlist deleted.");
      navigate("/playlists");
    } catch (err) {
      messageApi.error(
        err?.response?.data?.message || "Failed to delete playlist.",
      );
    } finally {
      setIsDeletingPlaylist(false);
    }
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
    <div className="playlistDetailsPage">
      {contextHolder}
      <section className="playlistDetailsHeader">
        {isEditing ? (
          <form className="playlistEditForm" onSubmit={handleSaveName}>
            <Input
              className="playlistEditInput"
              type="text"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder="Playlist name"
            />
            <Button
              type="primary"
              htmlType="submit"
              className="playlistActionSave"
              disabled={isSavingName}
              icon={<SaveOutlined />}
            >
              {isSavingName ? "Saving..." : "Save Name"}
            </Button>
            <Button
              type="button"
              danger
              className="playlistActionCancel"
              icon={<CloseOutlined />}
              onClick={() => {
                setIsEditing(false);
                setNameDraft(playlist.name || "");
              }}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <Typography.Title level={1} className="playlistsTitle">
            {playlist.name}
          </Typography.Title>
        )}
        <Typography.Text type="secondary" className="playlistDetailsCount">
          {playlist.songs.length} videos
        </Typography.Text>
        {error ? (
          <Typography.Text type="danger" className="homeError">
            {error}
          </Typography.Text>
        ) : null}
        <div className="playlistDetailsToolbar">
          <Button
            type="primary"
            icon={isEditing ? <CheckOutlined /> : <EditOutlined />}
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? "Done Editing" : "Edit Playlist"}
          </Button>
          <Button
            className="searchResultAction searchResultOpen"
            icon={<PlusOutlined />}
            onClick={() => navigate("/")}
          >
            Add Videos
          </Button>
          <Popconfirm
            title="Delete this playlist?"
            description="This will permanently remove the playlist and its songs."
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: isDeletingPlaylist }}
            onConfirm={handleDeletePlaylist}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={isDeletingPlaylist}
            >
              Delete Playlist
            </Button>
          </Popconfirm>
        </div>
      </section>

      <section className="playlistContent">
        <div className="playlistPlayerSection">
          <Typography.Title level={2} className="playlistPlayerTitle">
            {currentSong?.title || "Select a video to play"}
          </Typography.Title>
          <div className="playlistMiniPlayer">
            <VideoPlayer videoId={currentSong?.videoId} />
          </div>
        </div>

        <div className="playlistSongsSection">
          <Typography.Title level={2} className="playlistSongsTitle">
            Songs in Playlist
          </Typography.Title>
          <SongList
            songs={playlist.songs}
            onPlay={setCurrentSong}
            onRemove={isEditing ? handleRemove : undefined}
          />
        </div>
      </section>
    </div>
  );
}
