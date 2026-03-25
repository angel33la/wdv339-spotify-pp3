import { useContext, useState } from "react";
import { Button, Typography } from "antd";
import { DownOutlined, RightOutlined, CloseOutlined } from "@ant-design/icons";
import { PlayerContext } from "../../context/PlayerContext";
import VideoPlayer from "./VideoPlayer";

export default function PersistentPlayer() {
  const { currentSong, clearCurrentSong } = useContext(PlayerContext);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentSong?.videoId) {
    return null;
  }

  return (
    <aside className={`persistentPlayer ${isExpanded ? "isExpanded" : ""}`}>
      <div className="persistentPlayerBar">
        <button
          type="button"
          className="persistentPlayerSummary"
          onClick={() => setIsExpanded((previous) => !previous)}
          aria-expanded={isExpanded}
        >
          <img
            className="persistentPlayerThumb"
            src={currentSong.thumbnail}
            alt={currentSong.title}
          />
          <div className="persistentPlayerCopy">
            <Typography.Text className="persistentPlayerLabel">
              Now Playing
            </Typography.Text>
            <Typography.Text className="persistentPlayerTitle">
              {currentSong.title}
            </Typography.Text>
            <Typography.Text className="persistentPlayerChannel">
              {currentSong.channelTitle}
            </Typography.Text>
          </div>
        </button>

        <div className="persistentPlayerActions">
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
        <div className="persistentPlayerVideo">
          <VideoPlayer videoId={currentSong.videoId} />
        </div>
      ) : null}
    </aside>
  );
}
