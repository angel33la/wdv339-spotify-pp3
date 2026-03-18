import { useContext, useState } from "react";
import { Button, Typography } from "antd";
import {
  DownOutlined,
  RightOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { PlayerContext } from "../../context/PlayerContext";
import VideoPlayer from "./VideoPlayer";

export default function PersistentPlayer() {
  const { currentSong, clearCurrentSong } = useContext(PlayerContext);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentSong?.videoId) {
    return null;
  }

  return (
    <aside className={`persistent-player ${isExpanded ? "is-expanded" : ""}`}>
      <div className="persistent-player-bar">
        <button
          type="button"
          className="persistent-player-summary"
          onClick={() => setIsExpanded((previous) => !previous)}
          aria-expanded={isExpanded}
        >
          <img
            className="persistent-player-thumb"
            src={currentSong.thumbnail}
            alt={currentSong.title}
          />
          <div className="persistent-player-copy">
            <Typography.Text className="persistent-player-label">
              Now Playing
            </Typography.Text>
            <Typography.Text className="persistent-player-title">
              {currentSong.title}
            </Typography.Text>
            <Typography.Text className="persistent-player-channel">
              {currentSong.channelTitle}
            </Typography.Text>
          </div>
        </button>

        <div className="persistent-player-actions">
          <Button
            type="text"
            icon={isExpanded ? <DownOutlined /> : <RightOutlined />}
            onClick={() => setIsExpanded((previous) => !previous)}
            aria-label={isExpanded ? "Collapse player" : "Expand player"}
          />
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={clearCurrentSong}
            aria-label="Close player"
          />
        </div>
      </div>

      {isExpanded ? (
        <div className="persistent-player-video">
          <VideoPlayer videoId={currentSong.videoId} />
        </div>
      ) : null}
    </aside>
  );
}
