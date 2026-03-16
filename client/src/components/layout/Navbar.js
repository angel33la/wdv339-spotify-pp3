import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <nav>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          gap: "60px",
          fontSize: "2rem",
          color: "#1a143c",
        }}
      >
        <img
          src="/favicon.png"
          alt="App Logo"
          style={{ width: "40px", height: "40px" }}
        />
        <Link to="/">Home</Link>
        <Link to="/playlists">Playlists</Link>
      </div>
      <span>{user?.name}</span>
      <button
        onClick={onLogout}
        style={{
          padding: "10px",
          fontSize: "1.25rem",
          width: "100px",
          borderRadius: "5px 5px 5px 5px",
        }}
      >
        Logout
      </button>
    </nav>
  );
}
