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

  useEffect(() => {
    const loadPlaylists = async () => {
      const data = await getPlaylists(token);
      setPlaylists(data);
    };

    if (token) loadPlaylists();
  }, [token]);

  const handleSearch = async (query) => {
    const data = await searchSongs(query, token);
    setResults(data);
  };

  const handleAddSong = async (playlistId, song) => {
    await addSongToPlaylist(playlistId, song, token);
  };

  return (
    <div>
      <h1>Search Music</h1>
      <SearchBar onSearch={handleSearch} />
      <VideoPlayer videoId={selectedSong?.videoId} />
      <SearchResults
        results={results}
        playlists={playlists}
        onPlay={setSelectedSong}
        onAdd={handleAddSong}
      />
    </div>
  );
}
