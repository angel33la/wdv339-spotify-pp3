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
      className="playlistCard"
      role="button"
      tabIndex={0}
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
      <Typography.Text className="playlistCardOpen">
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
          className="playlistCardDelete"
          loading={isDeleting}
          onClick={(event) => event.stopPropagation()}
        >
          Delete
        </Button>
      </Popconfirm>
    </article>
  );
}
