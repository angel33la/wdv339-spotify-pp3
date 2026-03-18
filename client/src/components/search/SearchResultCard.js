import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Select, Typography } from "antd";
import {
  BookOutlined,
  CaretRightFilled,
  FolderOpenOutlined,
  OrderedListOutlined,
  PlusOutlined,
} from "@ant-design/icons";

export default function SearchResultCard({
  song,
  playlists,
  onPlay,
  onAdd,
  onQueue,
  onSaveSong,
}) {
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
      <button
        type="button"
        className="search-result-play-trigger"
        onClick={() => onPlay(song)}
        aria-label={`Play ${song.title}`}
      >
        <CaretRightFilled />
      </button>

      <img
        className="search-result-thumb"
        src={song.thumbnail}
        alt={song.title}
      />

      <div className="search-result-copy">
        <Typography.Title level={5} className="search-result-title">
          {song.title}
        </Typography.Title>
        <Typography.Text type="secondary" className="search-result-channel">
          {song.channelTitle}
        </Typography.Text>
      </div>

      <div className="search-result-actions">
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

        <div className="search-result-action-row">
          <Button
            icon={<FolderOpenOutlined />}
            className="search-result-action search-result-open"
            onClick={handleOpenSelected}
            disabled={!selectedPlaylistId}
          >
            Open
          </Button>

          <Button
            icon={<OrderedListOutlined />}
            className="search-result-action"
            onClick={() => onQueue?.(song)}
          >
            Queue
          </Button>

          <Button
            icon={<BookOutlined />}
            className="search-result-action"
            onClick={() => onSaveSong?.(song)}
          >
            Save
          </Button>
        </div>
      </div>
    </article>
  );
}
