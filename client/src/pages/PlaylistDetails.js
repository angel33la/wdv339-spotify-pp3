import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaylist, removeSongFromPlaylist } from "../api/playlistApi";
import { AuthContext } from "../context/AuthContext";
import SongList from "../components/playlists/SongList";
import VideoPlayer from "../components/player/VideoPlayer";

export default function PlaylistDetails() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [playlist, setPlaylist] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);

  const loadPlaylist = useCallback(async () => {
    const data = await getPlaylist(id, token);
    setPlaylist(data);
  }, [id, token]);

  useEffect(() => {
    loadPlaylist();
  }, [loadPlaylist]);

  const handleRemove = async (songId) => {
    await removeSongFromPlaylist(id, songId, token);
    await loadPlaylist();
  };

  if (!playlist) return <p>Loading...</p>;

  return (
    <div>
      <h1>{playlist.name}</h1>
      <VideoPlayer videoId={selectedSong?.videoId} />
      <SongList
        songs={playlist.songs}
        onPlay={setSelectedSong}
        onRemove={handleRemove}
      />
    </div>
  );
}
