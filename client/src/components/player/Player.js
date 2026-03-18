import React, { useState, useEffect } from "react";
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
    sliding === -1 ? "is-sliding-prev" : sliding === 1 ? "is-sliding-next" : "";
  const isLiked = likedTracks.includes(currentTrack);

  return (
    <div className="player-wrapper">
      <article className={`player ${slidingClass}`}>
        <div
          className="player__bg prev"
          style={{ backgroundImage: `url(${prevTrackData.artwork})` }}
        ></div>
        <div
          className="player__bg"
          style={{ backgroundImage: `url(${currentTrackData.artwork})` }}
        ></div>
        <div
          className="player__bg next"
          style={{ backgroundImage: `url(${nextTrackData.artwork})` }}
        ></div>

        <section className="player__art">
          <img src={prevTrackData.artwork} alt="" className="prev" />
          <img src={currentTrackData.artwork} alt="" className="current" />
          <img src={nextTrackData.artwork} alt="" className="next" />

          <button className="player__playlist-toggle" onClick={toggleViewMode}>
            <span>{viewMode === "playlist" ? "✕" : "☰"}</span>
          </button>

          <PlaylistView
            tracks={defaultTracks}
            isVisible={viewMode === "playlist"}
            changeTrack={changeTrack}
          />
        </section>

        <section className="player__body">
          <p className="player__title">{currentTrackData.name}</p>
          <p className="player__subtitle">{currentTrackData.artist}</p>
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
    <ul className={`player__playlist ${isVisible ? "" : "is-hidden"}`}>
      {tracks.map((track, i) => (
        <li
          key={i}
          className="player__playlist-item"
          onClick={() => changeTrack(i)}
        >
          <img
            src={track.artwork}
            alt={track.name}
            className="player__playlist-thumb"
          />
          <div className="player__playlist-content">
            <p className="player__playlist-title">{track.name}</p>
            <p className="player__playlist-artist">{track.artist}</p>
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
    <div className="player__timestamp">
      <div className="player__timestamp-current">{convertTime(current)}</div>
      <div className="player__timestamp-progress">
        <div
          style={{ width: `${Math.floor((current / duration) * 100)}%` }}
        ></div>
      </div>
      <div className="player__timestamp-total">
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
    <div className="player__controls">
      <button className="player__control-btn" title="Repeat">
        <span>⟲</span>
      </button>
      <button
        className="player__control-btn"
        onClick={prevTrack}
        title="Previous"
      >
        <span>⏮</span>
      </button>
      <button
        className="player__control-btn player__control-play"
        onClick={togglePlay}
        title="Play/Pause"
      >
        <span>{isPlaying ? "⏸" : "▶"}</span>
      </button>
      <button className="player__control-btn" onClick={nextTrack} title="Next">
        <span>⏭</span>
      </button>
      <button
        className={`player__control-btn player__control-like ${isLiked ? "is-liked" : ""}`}
        onClick={toggleLike}
        title="Like"
      >
        <span>{isLiked ? "♥" : "♡"}</span>
      </button>
    </div>
  );
}
