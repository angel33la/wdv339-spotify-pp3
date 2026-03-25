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
    <div className="createPlaylistContainer">
      <div className="createPlaylistCard">
        <Typography.Title level={2} className="createPlaylistTitle">
          Create New Playlist
        </Typography.Title>
        <form className="createPlaylistForm" onSubmit={handleSubmit}>
          <Input
            className="createPlaylistInput"
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
            className="createPlaylistButton"
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
