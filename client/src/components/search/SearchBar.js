import { useState } from "react";
import { Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    await onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="searchBar">
      <Input
        className="searchBarInput"
        type="text"
        placeholder="Search artist or song"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        allowClear
      />
      <Button
        type="primary"
        htmlType="submit"
        className="searchBarButton"
        icon={<SearchOutlined />}
      >
        Search
      </Button>
    </form>
  );
}
