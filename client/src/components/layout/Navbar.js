import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getPlaylists } from "../../api/playlistApi";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar({ user, onLogout }) {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");

  useEffect(() => {
    const loadPlaylists = async () => {
      if (!token) {
        setPlaylists([]);
        return;
      }

      try {
        const data = await getPlaylists(token);
        setPlaylists(data);
      } catch {
        setPlaylists([]);
      }
    };

    loadPlaylists();
  }, [location.pathname, token]);

  useEffect(() => {
    const pathMatch = location.pathname.match(/^\/playlists\/([^/]+)$/);

    if (pathMatch) {
      setSelectedPlaylistId(pathMatch[1]);
      return;
    }

    setSelectedPlaylistId("");
  }, [location.pathname]);

  const handlePlaylistSelect = (event) => {
    const playlistId = event.target.value;
    setSelectedPlaylistId(playlistId);

    if (playlistId) {
      navigate(`/playlists/${playlistId}`);
    }
  };

  return (
    <nav>
      <div className="navbar-links">
        <img
          src="/favicon.png"
          alt="App Logo"
          style={{ width: "40px", height: "40px" }}
        />
        <Link to="/">Home</Link>
        <Link to="/playlists">Playlists</Link>
        <select
          className="navbar-playlist-select"
          value={selectedPlaylistId}
          onChange={handlePlaylistSelect}
          disabled={!playlists.length}
          aria-label="Open a playlist"
        >
          <option value="">
            {playlists.length ? "Open a playlist" : "No playlists yet"}
          </option>
          {playlists.map((playlist) => (
            <option key={playlist._id} value={playlist._id}>
              {playlist.name}
            </option>
          ))}
        </select>
      </div>
      <div className="navbar-actions">
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
      </div>
    </nav>
  );
}
