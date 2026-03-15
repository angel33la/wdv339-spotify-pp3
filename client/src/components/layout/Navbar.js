import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <nav style={{ color:"#ffde59"}}>
      <div style={{ display: "flex", justifyContent:"space-around", alignItems: "center", gap:"10px", fontSize:"2rem"}}>
      <img src="/favicon.png" alt="App Logo" style={{ width:"32px", height:"32px"}} />
      <Link to="/">Home</Link>
      <Link to="/playlists">Playlists</Link>
      </div>
      <span>{user?.name}</span>
      <button onClick={onLogout}>Logout</button>
    </nav>
  );
}
