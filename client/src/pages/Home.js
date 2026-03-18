import { useContext, useEffect, useState } from "react";
import { message, Typography } from "antd";
import { searchSongs } from "../api/searchApi";
import { addSongToPlaylist, getPlaylists } from "../api/playlistApi";
import { AuthContext } from "../context/AuthContext";
import SearchBar from "../components/search/SearchBar";
import SearchResults from "../components/search/SearchResults";
import VideoPlayer from "../components/player/VideoPlayer";

export default function Home() {
  const { token } = useContext(AuthContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [results, setResults] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPlaylists = async () => {
      const data = await getPlaylists(token);
      setPlaylists(data);
    };

    if (token) loadPlaylists();
  }, [token]);

  const handleSearch = async (query) => {
    try {
      setError("");
      const data = await searchSongs(query, token);
      setResults(data);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Search failed. Please try again.";
      setError(message);
      setResults([]);
    }
  };

  const handleAddSong = async (playlistId, song) => {
    try {
      await addSongToPlaylist(playlistId, song, token);
      const playlistName =
        playlists.find((playlist) => playlist._id === playlistId)?.name ||
        "playlist";
      messageApi.success(`Added "${song.title}" to ${playlistName}.`);
    } catch (err) {
      const messageText =
        err?.response?.data?.message ||
        "Could not add this song to the selected playlist.";
      messageApi.error(messageText);
    }
  };

  return (
    <div className="home-page">
      {contextHolder}
      <Typography.Title level={1} className="home-title">
        Search Music Matie App
      </Typography.Title>
      {error ? (
        <Typography.Text type="danger" className="home-error">
          {error} Try searching for something else or check your connection.
        </Typography.Text>
      ) : null}
      <SearchBar onSearch={handleSearch} />
      <div className="player-wrap">
        <VideoPlayer videoId={selectedSong?.videoId} />
      </div>
      <SearchResults
        results={results}
        playlists={playlists}
        onPlay={setSelectedSong}
        onAdd={handleAddSong}
      />
    </div>
  );
}
