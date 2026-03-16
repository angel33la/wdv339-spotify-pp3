import { Link } from "react-router-dom";

export default function PlaylistCard({ playlist }) {
  return (
    <div style={{ fontSize: "2rem", color: "#fff" }}>
      <h3>{playlist.name}</h3>
      <p>{playlist.songs.length} songs</p>
      <Link to={`/playlists/${playlist._id}`}>Open</Link>
    </div>
  );
}
