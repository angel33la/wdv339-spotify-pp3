import { useState } from "react";
import { Button, Input, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function CreatePlaylistForm({ onCreate }) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsLoading(true);
      await onCreate(name);
      setName("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-playlist-container">
      <div className="create-playlist-card">
        <Typography.Title level={2} className="create-playlist-title">
          Create New Playlist
        </Typography.Title>
        <form className="create-playlist-form" onSubmit={handleSubmit}>
          <Input
            className="create-playlist-input"
            type="text"
            placeholder="Enter playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            autoFocus
            required
          />
          <Button
            htmlType="submit"
            type="primary"
            className="create-playlist-button"
            disabled={isLoading}
            icon={<PlusOutlined />}
          >
            {isLoading ? "Creating..." : "Create Playlist"}
          </Button>
        </form>
      </div>
    </div>
  );
}
