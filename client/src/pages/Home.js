import { useContext, useEffect, useState } from "react";
import { searchSongs } from "../api/searchApi";
import { addSongToPlaylist, getPlaylists } from "../api/playlistApi";
import { AuthContext } from "../context/AuthContext";
import SearchBar from "../components/search/SearchBar";
import SearchResults from "../components/search/SearchResults";
import VideoPlayer from "../components/player/VideoPlayer";

export default function Home() {
  const { token } = useContext(AuthContext);
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
    await addSongToPlaylist(playlistId, song, token);
  };

  return (
    <div className="home-page">
      <h1 className="home-title">Search Music</h1>
      <SearchBar onSearch={handleSearch} />
      {error ? <p className="home-error">{error}</p> : null}
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
