import { Link } from "react-router-dom";
import { Typography } from "antd";

export default function PlaylistCard({ playlist }) {
  return (
    <Link
      className="playlist-card"
      to={`/playlists/${playlist._id}`}
      aria-label={`Open ${playlist.name} playlist`}
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
    </Link>
  );
}
