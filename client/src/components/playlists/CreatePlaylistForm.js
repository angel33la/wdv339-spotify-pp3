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
        type="text"
        placeholder="New playlist name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Create Playlist</button>
    </form>
  );
}
