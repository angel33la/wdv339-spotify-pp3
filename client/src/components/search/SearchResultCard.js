import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";
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
    <article className="searchResultCard">
      <button
        type="button"
        className="searchResultPlayTrigger"
        onClick={() => onPlay(song)}
        aria-label={`Play ${song.title}`}
      >
        <CaretRightFilled />
      </button>

      <img
        className="searchResultThumb"
        src={song.thumbnail}
        alt={song.title}
      />

      <div className="searchResultCopy">
        <Typography.Title level={5} className="searchResultTitle">
          {song.title}
        </Typography.Title>
        <Typography.Text type="secondary" className="searchResultChannel">
          {song.channelTitle}
        </Typography.Text>
      </div>

      <div className="searchResultActions">
        <div className="searchResultAddRow">
          <select
            className="searchResultSelect"
            value={selectedPlaylistId}
            onChange={(event) => setSelectedPlaylistId(event.target.value)}
            disabled={!playlists.length}
            aria-label="Choose playlist"
          >
            <option value="" disabled>
              {!playlists.length ? "No playlists" : "Choose playlist"}
            </option>
            {playlists.map((playlist) => (
              <option key={playlist._id} value={playlist._id}>
                {playlist.name}
              </option>
            ))}
          </select>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="searchResultAction"
            onClick={handleAddSelected}
            disabled={!selectedPlaylistId}
          >
            Add
          </Button>
        </div>

        <div className="searchResultActionRow">
          <Button
            icon={<FolderOpenOutlined />}
            className="searchResultAction searchResultOpen"
            onClick={handleOpenSelected}
            disabled={!selectedPlaylistId}
          >
            Open
          </Button>

          <Button
            icon={<OrderedListOutlined />}
            className="searchResultAction"
            onClick={() => onQueue?.(song)}
          >
            Queue
          </Button>

          <Button
            icon={<BookOutlined />}
            className="searchResultAction"
            onClick={() => onSaveSong?.(song)}
          >
            Save
          </Button>
        </div>
      </div>
    </article>
  );
}
