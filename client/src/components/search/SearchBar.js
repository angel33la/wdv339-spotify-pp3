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
        className="search-bar-input"
        type="text"
        placeholder="Search artist or song"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="search-bar-button"
      >
        Search
      </button>
    </form>
  );
}
