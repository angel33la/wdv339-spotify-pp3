import { Button, Typography } from "antd";
import { DeleteOutlined, PlayCircleOutlined } from "@ant-design/icons";

export default function SongList({ songs, onPlay, onRemove }) {
  if (!songs.length) {
    return (
      <Typography.Paragraph className="playlistEmptyState">
        No videos in this playlist yet.
      </Typography.Paragraph>
    );
  }

  return (
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
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              className="searchResultAction"
              onClick={() => onPlay(song)}
            >
              Play
            </Button>
            {onRemove && (
              <Button
                danger
                icon={<DeleteOutlined />}
                className="searchResultAction playlistDeleteSongButton"
                onClick={() => onRemove(song.videoId)}
              >
                Delete Song
              </Button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
