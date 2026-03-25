import { useContext, useEffect, useState } from "react";
import { Button, Popconfirm, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import VideoPlayer from "../components/player/VideoPlayer";
import { PlayerContext } from "../context/PlayerContext";
import {
  clearProfileSongs,
  loadProfileSongs,
  removeProfileSong,
} from "../utils/preferences";

export default function Songs() {
  const { currentSong, setCurrentSong } = useContext(PlayerContext);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const storedSongs = loadProfileSongs();
    setSongs(storedSongs);
  }, []);

  const handleRemoveSong = (videoId) => {
    const nextSongs = removeProfileSong(videoId);
    setSongs(nextSongs);

    if (currentSong?.videoId === videoId) {
      setCurrentSong(nextSongs[0] || null);
    }
  };

  const handleClear = () => {
    clearProfileSongs();
    setSongs([]);
    setCurrentSong(null);
  };

  return (
    <div className="playlistDetailsPage">
      <section className="playlistDetailsHeader">
        <Typography.Title level={1} className="playlistsTitle">
          My Songs
        </Typography.Title>
        <Typography.Text type="secondary" className="playlistDetailsCount">
          {songs.length} saved songs
        </Typography.Text>
        {songs.length ? (
          <Popconfirm
            title="Clear all saved songs?"
            description="This removes all songs from your profile songs list."
            okText="Clear"
            cancelText="Cancel"
            onConfirm={handleClear}
          >
            <Button danger icon={<DeleteOutlined />}>
              Clear Songs
            </Button>
          </Popconfirm>
        ) : null}
      </section>

      <section className="playlistContent">
        <div className="playlistPlayerSection">
          <Typography.Title level={2} className="playlistPlayerTitle">
            {currentSong?.title || "Select a saved song"}
          </Typography.Title>
          <div className="playlistMiniPlayer">
            <VideoPlayer videoId={currentSong?.videoId} />
          </div>
        </div>

        <div className="playlistSongsSection">
          <Typography.Title level={2} className="playlistSongsTitle">
            Saved Songs
          </Typography.Title>

          {!songs.length ? (
            <Typography.Paragraph className="playlistEmptyState">
              No songs saved yet. Use "Save to Songs" from search results.
            </Typography.Paragraph>
          ) : (
            <div className="playlistSongsGrid">
              {songs.map((song) => (
                <article key={song.videoId} className="playlistSongCard">
                  <img
                    className="playlistSongThumb"
                    src={song.thumbnail}
                    alt={song.title}
                  />
                  <Typography.Title level={5} style={{ margin: "4px 0 0" }}>
                    {song.title}
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    {song.channelTitle}
                  </Typography.Text>
                  <div className="playlistSongActions">
                    <Button type="primary" onClick={() => setCurrentSong(song)}>
                      Play
                    </Button>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveSong(song.videoId)}
                    >
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
