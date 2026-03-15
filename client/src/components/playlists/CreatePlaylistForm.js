import { useState } from "react";

export default function CreatePlaylistForm({ onCreate }) {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onCreate(name);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        style={{
          padding: "8.5px",
          fontSize: "1rem",
          width: "300px",
          borderRadius: "5px 0 0 5px",
        }}
        type="text"
        placeholder="New playlist name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        type="submit"
        style={{
          padding: "8px 8.5px",
          fontSize: "1rem",
          width: "100px",
          borderRadius: "0 5px 5px 0",
          backgroundColor: "#8c52ff",
          color: "#fff",
        }}
      >
        Create Playlist
      </button>
    </form>
  );
}
