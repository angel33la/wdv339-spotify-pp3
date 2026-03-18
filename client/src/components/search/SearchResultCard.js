import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Select, Typography } from "antd";
import {
  FolderOpenOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

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
      <Typography.Title level={5} style={{ margin: "8px 0 0" }}>
        {song.title}
      </Typography.Title>
      <Typography.Text type="secondary">{song.channelTitle}</Typography.Text>

      <div className="search-result-actions">
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          className="search-result-action"
          onClick={() => onPlay(song)}
        >
          Play
        </Button>

        <div className="search-result-add-row">
          <Select
            className="search-result-select"
            value={selectedPlaylistId}
            onChange={setSelectedPlaylistId}
            disabled={!playlists.length}
            placeholder={!playlists.length ? "No playlists" : "Choose playlist"}
            options={playlists.map((playlist) => ({
              value: playlist._id,
              label: playlist.name,
            }))}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="search-result-action"
            onClick={handleAddSelected}
            disabled={!selectedPlaylistId}
          >
            Add
          </Button>
        </div>

        <Button
          icon={<FolderOpenOutlined />}
          className="search-result-action search-result-open"
          onClick={handleOpenSelected}
          disabled={!selectedPlaylistId}
        >
          Open Playlist
        </Button>
      </div>
    </article>
  );
}
