import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Button, Space, Typography } from "antd";
import {
  CloseOutlined,
  CustomerServiceOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  ReadOutlined,
  UserOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { PlaylistContext } from "../../context/PlaylistContext";

export default function Navbar({ user, onLogout }) {
  const { playlists } = useContext(PlaylistContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const displayName = user?.username || user?.name || user?.email || "User";
  const avatarSrc = user?.imageUrl || user?.picture || user?.photo || undefined;

  useEffect(() => {
    const pathMatch = location.pathname.match(/^\/playlists\/([^/]+)$/);

    if (pathMatch) {
      setSelectedPlaylistId(pathMatch[1]);
      return;
    }

    setSelectedPlaylistId("");
  }, [location.pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handlePlaylistSelect = (playlistId) => {
    setSelectedPlaylistId(playlistId);

    if (playlistId) {
      navigate(`/playlists/${playlistId}`);
    }
  };

  return (
    <nav>
      <div className="navbarMobileTopbar">
        <img
          src="/images/logo-40.png"
          srcSet="/images/logo-40.png 1x, /images/logo-80.png 2x"
          sizes="40px"
          alt="App Logo"
          style={{ width: "40px", height: "40px" }}
        />
        <Button
          type="text"
          className="navbarMobileToggle"
          icon={isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        />
      </div>
      <div
        className={`navbarMobileMenu ${
          isMobileMenuOpen ? "navbarMobileMenuOpen" : ""
        }`}
      >
        <div className="navbarLinks">
          <Link to="/">
            <Space size={6}>
              <HomeOutlined />
              <Typography.Text className="navbarLinkLabel">
                Home
              </Typography.Text>
            </Space>
          </Link>
          <Link to="/playlists">
            <Space size={6}>
              <CustomerServiceOutlined />
              <Typography.Text className="navbarLinkLabel">
                Playlists
              </Typography.Text>
            </Space>
          </Link>
          <Link to="/songs">
            <Space size={6}>
              <ReadOutlined />
              <Typography.Text className="navbarLinkLabel">
                Songs
              </Typography.Text>
            </Space>
          </Link>
          <select
            className="navbarPlaylistSelect"
            value={selectedPlaylistId}
            onChange={(event) => handlePlaylistSelect(event.target.value)}
            disabled={!playlists.length}
            aria-label="Open a playlist"
          >
            <option value="" disabled>
              {playlists.length ? "Open a playlist" : "No playlists yet"}
            </option>
            {playlists.map((playlist) => (
              <option key={playlist._id} value={playlist._id}>
                {playlist.name}
              </option>
            ))}
          </select>
        </div>
        <div className="navbarActions">
          <Button
            type="text"
            className="navbarUserChipButton"
            onClick={() => navigate("/preferences")}
          >
            <Space size={8} className="navbarUserChip">
              <Avatar
                size={32}
                src={avatarSrc}
                alt={`${displayName} avatar`}
                icon={!avatarSrc ? <UserOutlined /> : null}
                className="navbarUserAvatar"
              />
              <Space size={6}>
                <ProfileOutlined className="navbarUserIcon" />
                <Typography.Text className="navbarUserName">
                  {displayName}
                </Typography.Text>
              </Space>
            </Space>
          </Button>
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={onLogout}
            className="navbarLogoutButton pinkActionButton"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
