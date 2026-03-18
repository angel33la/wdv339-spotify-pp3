import { useContext, useEffect, useMemo, useState } from "react";
import { Button, message, Tag, Typography } from "antd";
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { searchSongs } from "../api/searchApi";
import { addSongToPlaylist, getPlaylists } from "../api/playlistApi";
import { AuthContext } from "../context/AuthContext";
import SearchBar from "../components/search/SearchBar";
import SearchResults from "../components/search/SearchResults";
import VideoPlayer from "../components/player/VideoPlayer";
import { addProfileSong } from "../utils/preferences";

const normalize = (value) => String(value || "").toLowerCase();

const getSimilarityScore = (song, queuedSongs) => {
  if (!queuedSongs.length) {
    return 0;
  }

  const songChannel = normalize(song.channelTitle);
  const songTitle = normalize(song.title);

  const titleTokens = new Set(
    songTitle.split(/\s+/).filter((token) => token.length > 2),
  );

  return queuedSongs.reduce((score, queuedSong) => {
    const queuedChannel = normalize(queuedSong.channelTitle);
    const queuedTitle = normalize(queuedSong.title);

    let nextScore = score;

    if (songChannel && queuedChannel && songChannel === queuedChannel) {
      nextScore += 3;
    } else if (
      songChannel &&
      queuedChannel &&
      (songChannel.includes(queuedChannel) ||
        queuedChannel.includes(songChannel))
    ) {
      nextScore += 1.5;
    }

    const queuedTokens = queuedTitle
      .split(/\s+/)
      .filter((token) => token.length > 2);

    const tokenOverlap = queuedTokens.filter((token) =>
      titleTokens.has(token),
    ).length;
    nextScore += tokenOverlap * 0.45;

    return nextScore;
  }, 0);
};

export default function Home() {
  const { token } = useContext(AuthContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [results, setResults] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [queuedSongs, setQueuedSongs] = useState([]);
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

  const handleQueueSong = (song) => {
    setQueuedSongs((previous) => {
      if (previous.some((item) => item.videoId === song.videoId)) {
        messageApi.info(`"${song.title}" is already in your queue.`);
        return previous;
      }

      messageApi.success(`Queued "${song.title}" for similar recommendations.`);
      return [song, ...previous].slice(0, 8);
    });
  };

  const handleSaveSong = (song) => {
    const result = addProfileSong(song);

    if (result.added) {
      messageApi.success(`Saved "${song.title}" to your Songs page.`);
    } else {
      messageApi.info(`"${song.title}" is already saved.`);
    }
  };

  const removeQueuedSong = (videoId) => {
    setQueuedSongs((previous) =>
      previous.filter((queuedSong) => queuedSong.videoId !== videoId),
    );
  };

  const clearQueue = () => {
    setQueuedSongs([]);
    messageApi.info("Recommendation queue cleared.");
  };

  const rankedResults = useMemo(() => {
    if (!queuedSongs.length) {
      return results;
    }

    return [...results].sort((a, b) => {
      const scoreB = getSimilarityScore(b, queuedSongs);
      const scoreA = getSimilarityScore(a, queuedSongs);
      return scoreB - scoreA;
    });
  }, [results, queuedSongs]);

  return (
    <div className="home-page">
      {contextHolder}
      <Typography.Title level={1} className="home-title">
        Search Music Matie App
      </Typography.Title>
      <SearchBar onSearch={handleSearch} />
      {error ? (
        <Typography.Text type="danger" className="home-error">
          {error} Try searching for something else or check your connection.
        </Typography.Text>
      ) : null}

      <div className="home-watch-layout">
        <section className="watch-main">
          <div className="player-wrap watch-player-wrap">
            {selectedSong?.videoId ? (
              <VideoPlayer videoId={selectedSong.videoId} />
            ) : (
              <div className="video-empty-state">
                <Typography.Text>
                  Select a song from the right to start playing.
                </Typography.Text>
              </div>
            )}
          </div>
          <Typography.Title level={4} className="watch-current-title">
            {selectedSong?.title || "Now Playing"}
          </Typography.Title>
          <Typography.Text type="secondary" className="watch-current-channel">
            {selectedSong?.channelTitle ||
              "Your selected song details appear here."}
          </Typography.Text>
        </section>

        <aside className="watch-sidebar">
          <Typography.Title level={4} className="watch-sidebar-title">
            Up Next
          </Typography.Title>

          {queuedSongs.length ? (
            <div className="queue-panel">
              <div className="queue-panel-header">
                <Typography.Text className="queue-panel-title">
                  Similarity Queue
                </Typography.Text>
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={clearQueue}
                >
                  Clear
                </Button>
              </div>
              <div className="queue-chip-list">
                {queuedSongs.map((queuedSong) => (
                  <Tag
                    key={queuedSong.videoId}
                    closable
                    closeIcon={<CloseOutlined />}
                    onClose={(event) => {
                      event.preventDefault();
                      removeQueuedSong(queuedSong.videoId);
                    }}
                    className="queue-chip"
                  >
                    {queuedSong.channelTitle || queuedSong.title}
                  </Tag>
                ))}
              </div>
            </div>
          ) : null}

          <SearchResults
            results={rankedResults}
            playlists={playlists}
            onPlay={setSelectedSong}
            onAdd={handleAddSong}
            onQueue={handleQueueSong}
            onSaveSong={handleSaveSong}
          />
        </aside>
      </div>
    </div>
  );
}
