import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Select, Space, Typography } from "antd";
import {
  CustomerServiceOutlined,
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
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

  const handlePlaylistSelect = (playlistId) => {
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
        <Link to="/">
          <Space size={6}>
            <HomeOutlined />
            <Typography.Text>Home</Typography.Text>
          </Space>
        </Link>
        <Link to="/playlists">
          <Space size={6}>
            <CustomerServiceOutlined />
            <Typography.Text>Playlists</Typography.Text>
          </Space>
        </Link>
        <Select
          className="navbar-playlist-select"
          value={selectedPlaylistId}
          onChange={handlePlaylistSelect}
          disabled={!playlists.length}
          placeholder={playlists.length ? "Open a playlist" : "No playlists yet"}
          options={playlists.map((playlist) => ({
            value: playlist._id,
            label: playlist.name,
          }))}
          aria-label="Open a playlist"
        />
      </div>
      <div className="navbar-actions">
        <Space size={8}>
          <ProfileOutlined />
          <Typography.Text>{user?.name}</Typography.Text>
        </Space>
        <Button type="primary" icon={<LogoutOutlined />} onClick={onLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}
