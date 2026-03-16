import { Link } from "react-router-dom";

export default function PlaylistCard({ playlist }) {
  return (
    <Link
      className="playlist-card"
      to={`/playlists/${playlist._id}`}
      aria-label={`Open ${playlist.name} playlist`}
    >
      <h3>{playlist.name}</h3>
      <p>{playlist.songs.length} songs</p>
      <span className="playlist-card-open">Open playlist</span>
    </Link>
  );
}
