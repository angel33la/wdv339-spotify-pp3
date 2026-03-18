import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Button, Select, Space, Typography } from "antd";
import {
  CustomerServiceOutlined,
  HomeOutlined,
  LogoutOutlined,
  ReadOutlined,
  UserOutlined,
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

  const displayName = user?.username || user?.name || user?.email || "User";
  const avatarSrc = user?.imageUrl || user?.picture || user?.photo || undefined;

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
        <Link to="/songs">
          <Space size={6}>
            <ReadOutlined />
            <Typography.Text>Songs</Typography.Text>
          </Space>
        </Link>
        <Select
          className="navbar-playlist-select"
          value={selectedPlaylistId}
          onChange={handlePlaylistSelect}
          disabled={!playlists.length}
          dropdownClassName="navbar-playlist-dropdown"
          placeholder={
            playlists.length ? "Open a playlist" : "No playlists yet"
          }
          options={playlists.map((playlist) => ({
            value: playlist._id,
            label: (
              <Typography.Text className="navbar-playlist-option-text">
                {playlist.name}
              </Typography.Text>
            ),
          }))}
          aria-label="Open a playlist"
        />
      </div>
      <div className="navbar-actions">
        <Button
          type="text"
          className="navbar-user-chip-button"
          onClick={() => navigate("/preferences")}
        >
          <Space size={8} className="navbar-user-chip">
            <Avatar
              size={32}
              src={avatarSrc}
              icon={!avatarSrc ? <UserOutlined /> : null}
              className="navbar-user-avatar"
            />
            <Space size={6}>
              <ProfileOutlined className="navbar-user-icon" />
              <Typography.Text className="navbar-user-name">
                {displayName}
              </Typography.Text>
            </Space>
          </Space>
        </Button>
        <Button type="primary" icon={<LogoutOutlined />} onClick={onLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}
