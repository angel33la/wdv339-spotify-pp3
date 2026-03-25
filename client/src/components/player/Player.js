import React, { useState, useEffect } from "react";
import { Button, Typography } from "antd";
import {
  CloseOutlined,
  HeartFilled,
  HeartOutlined,
  MenuOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  RedoOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";
import "./Player.css";

export default function Player({ tracks = [] }) {
  const defaultTracks =
    tracks.length > 0
      ? tracks
      : [
          {
            name: "Track 1",
            artist: "Artist",
            album: "Album",
            duration: 180,
            artwork: "https://via.placeholder.com/400x400?text=Album",
          },
        ];

  const [playStatus, setPlayStatus] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [nextTrack, setNextTrack] = useState(1);
  const [prevTrack, setPrevTrack] = useState(defaultTracks.length - 1);
  const [currentTime, setCurrentTime] = useState(0);
  const [sliding, setSliding] = useState(0);
  const [likedTracks, setLikedTracks] = useState([]);
  const [viewMode, setViewMode] = useState("player");
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  const togglePlay = () => {
    if (playStatus === 0) {
      const newTimer = setInterval(() => {
        setCurrentTime((prev) => {
          const track = defaultTracks[currentTrack];
          if (prev + 1 > track.duration) {
            goNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      setTimer(newTimer);
      setPlayStatus(1);
    } else {
      clearInterval(timer);
      setPlayStatus(0);
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "player" ? "playlist" : "player");
  };

  const changeTrack = (track, dir = 0) => {
    if (sliding === 0) {
      let next = track + 1;
      let prev = track - 1;

      if (next >= defaultTracks.length) next = 0;
      if (prev < 0) prev = defaultTracks.length - 1;

      setSliding(dir);

      setTimeout(() => {
        setSliding(0);
        setCurrentTrack(track);
        setNextTrack(next);
        setPrevTrack(prev);
        setCurrentTime(0);
      }, 500);
    }
  };

  const goNextTrack = () => {
    changeTrack(nextTrack, 1);
  };

  const goPrevTrack = () => {
    if (currentTime < 2) {
      changeTrack(prevTrack, -1);
    } else {
      setCurrentTime(0);
    }
  };

  const toggleLike = () => {
    const index = likedTracks.indexOf(currentTrack);
    if (index > -1) {
      setLikedTracks(likedTracks.filter((_, i) => i !== index));
    } else {
      setLikedTracks([...likedTracks, currentTrack]);
    }
  };

  const prevTrackData = defaultTracks[prevTrack];
  const currentTrackData = defaultTracks[currentTrack];
  const nextTrackData = defaultTracks[nextTrack];

  const slidingClass =
    sliding === -1 ? "isSlidingPrev" : sliding === 1 ? "isSlidingNext" : "";
  const isLiked = likedTracks.includes(currentTrack);

  return (
    <div className="playerWrapper">
      <article className={`player ${slidingClass}`}>
        <div
          className="playerBg prev"
          style={{ backgroundImage: `url(${prevTrackData.artwork})` }}
        ></div>
        <div
          className="playerBg"
          style={{ backgroundImage: `url(${currentTrackData.artwork})` }}
        ></div>
        <div
          className="playerBg next"
          style={{ backgroundImage: `url(${nextTrackData.artwork})` }}
        ></div>

        <section className="playerArt">
          <img src={prevTrackData.artwork} alt="" className="prev" />
          <img src={currentTrackData.artwork} alt="" className="current" />
          <img src={nextTrackData.artwork} alt="" className="next" />

          <Button
            className="playerPlaylistToggle"
            onClick={toggleViewMode}
            icon={
              viewMode === "playlist" ? <CloseOutlined /> : <MenuOutlined />
            }
            aria-label="Toggle playlist"
          />

          <PlaylistView
            tracks={defaultTracks}
            isVisible={viewMode === "playlist"}
            changeTrack={changeTrack}
          />
        </section>

        <section className="playerBody">
          <Typography.Text className="playerTitle">
            {currentTrackData.name}
          </Typography.Text>
          <Typography.Text className="playerSubtitle">
            {currentTrackData.artist}
          </Typography.Text>
          <Timestamp
            duration={currentTrackData.duration}
            current={currentTime}
          />
        </section>

        <Controls
          isPlaying={playStatus === 1}
          isLiked={isLiked}
          togglePlay={togglePlay}
          nextTrack={goNextTrack}
          prevTrack={goPrevTrack}
          toggleLike={toggleLike}
        />
      </article>
    </div>
  );
}

function PlaylistView({ tracks, isVisible, changeTrack }) {
  return (
    <ul className={`playerPlaylist ${isVisible ? "" : "isHidden"}`}>
      {tracks.map((track, i) => (
        <li
          key={i}
          className="playerPlaylistItem"
          onClick={() => changeTrack(i)}
        >
          <img
            src={track.artwork}
            alt={track.name}
            className="playerPlaylistThumb"
          />
          <div className="playerPlaylistContent">
            <Typography.Text className="playerPlaylistTitle">
              {track.name}
            </Typography.Text>
            <Typography.Text className="playerPlaylistArtist">
              {track.artist}
            </Typography.Text>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Timestamp({ duration, current }) {
  const convertTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = String(time - mins * 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="playerTimestamp">
      <div className="playerTimestampCurrent">{convertTime(current)}</div>
      <div className="playerTimestampProgress">
        <div
          style={{ width: `${Math.floor((current / duration) * 100)}%` }}
        ></div>
      </div>
      <div className="playerTimestampTotal">
        {convertTime(duration - current)}
      </div>
    </div>
  );
}

function Controls({
  isPlaying,
  isLiked,
  togglePlay,
  nextTrack,
  prevTrack,
  toggleLike,
}) {
  return (
    <div className="playerControls">
      <Button
        className="playerControlBtn"
        title="Repeat"
        icon={<RedoOutlined />}
      />
      <Button
        className="playerControlBtn"
        onClick={prevTrack}
        title="Previous"
        icon={<StepBackwardOutlined />}
      />
      <Button
        className="playerControlBtn playerControlPlay"
        onClick={togglePlay}
        title="Play/Pause"
        icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
      />
      <Button
        className="playerControlBtn"
        onClick={nextTrack}
        title="Next"
        icon={<StepForwardOutlined />}
      />
      <Button
        className={`playerControlBtn playerControlLike ${isLiked ? "isLiked" : ""}`}
        onClick={toggleLike}
        title="Like"
        icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
      />
    </div>
  );
}
