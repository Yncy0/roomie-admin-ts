import type React from "react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function ScheduleSearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search room name..."
        className="p-2 border rounded-l-md w-64"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded-r-md">
        Search
      </button>
    </form>
  );
}
