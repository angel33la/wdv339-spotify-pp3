import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/playlists">Playlists</Link>
      <span>{user?.name}</span>
      <button onClick={onLogout}>Logout</button>
    </nav>
  );
}
