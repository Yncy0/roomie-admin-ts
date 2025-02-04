import React, { useState } from "react";

interface Room {
  room_id: string;
  room_name: string;
}

interface ScheduleSearchBarProps {
  rooms: Room[]; // Array of rooms with room_id and room_name
  onSearch: (roomId: string) => void;
}

export function ScheduleSearchBar({ rooms, onSearch }: ScheduleSearchBarProps) {
  const [selectedRoomId, setSelectedRoomId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(selectedRoomId);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <select
        value={selectedRoomId}
        onChange={(e) => setSelectedRoomId(e.target.value)}
        className="p-2 border rounded-l-md w-64"
      >
        <option value="">Select a room</option>
        {rooms.map((room) => (
          <option key={room.room_id} value={room.room_id}>
            {room.room_name}
          </option>
        ))}
      </select>
      <button type="submit" className="p-2 bg-blue-500 text-white rounded-r-md">
        Search
      </button>
    </form>
  );
}
