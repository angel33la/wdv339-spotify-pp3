import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    await onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        style={{
          padding: "11px",
          fontSize: "1rem",
          width: "300px",
          borderRadius: "5px 0 0 5px",
        }}
        type="text"
        placeholder="Search artist or song"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        style={{
          padding: "10px",
          fontSize: "1.25rem",
          width: "100px",
          borderRadius: "0 5px 5px 0",
          backgroundColor: "#fff",
          color: "#1a143c",
        }}
      >
        Search
      </button>
    </form>
  );
}
