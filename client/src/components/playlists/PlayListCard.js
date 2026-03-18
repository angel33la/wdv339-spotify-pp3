import { useNavigate } from "react-router-dom";
import { Button, Popconfirm, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export default function PlaylistCard({ playlist, onDelete, isDeleting }) {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/playlists/${playlist._id}`);
  };

  return (
    <article
      className="playlist-card"
      role="button"
      tabIndex={0}
      aria-label={`Open ${playlist.name} playlist`}
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
    >
      <Typography.Title level={5} style={{ margin: 0 }}>
        {playlist.name}
      </Typography.Title>
      <Typography.Text type="secondary">
        {playlist.songs.length} songs
      </Typography.Text>
      <Typography.Text className="playlist-card-open">
        Open playlist
      </Typography.Text>

      <Popconfirm
        title="Delete this playlist?"
        description="This action cannot be undone."
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: isDeleting }}
        onConfirm={(event) => {
          event?.stopPropagation?.();
          onDelete?.(playlist._id);
        }}
        onPopupClick={(event) => event.stopPropagation()}
      >
        <Button
          danger
          icon={<DeleteOutlined />}
          className="playlist-card-delete"
          loading={isDeleting}
          onClick={(event) => event.stopPropagation()}
        >
          Delete
        </Button>
      </Popconfirm>
    </article>
  );
}
