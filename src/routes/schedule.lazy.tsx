import { ScheduleSearchBar } from "@/components/ScheduleSearchBar";
import { WeeklySchedule } from "@/components/ScheduleTables";
import { fetchSchedule } from "@/hooks/queries/schedule/useFetchSchedule";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Database, Tables } from "database.types";
import React from "react";

export const Route = createLazyFileRoute("/schedule")({
  component: ScheduleComponent,
});

type Schedule = Database["public"]["Tables"]["schedule"]["Row"] & {
  course: Database["public"]["Tables"]["course"]["Row"] | null;
  profiles: Database["public"]["Tables"]["profiles"]["Row"] | null;
  subject: Database["public"]["Tables"]["subject"]["Row"] | null;
  rooms: Database["public"]["Tables"]["rooms"]["Row"] | null;
};
function ScheduleComponent() {
  const [selectedRoom, setSelectedRoom] = React.useState("");
  const { data: schedules, isLoading, error } = fetchSchedule();

  const filteredSchedules =
    schedules?.filter((schedule: Schedule) =>
      schedule.rooms?.room_name
        ?.toLowerCase()
        .includes(selectedRoom.toLowerCase())
    ) || [];

  const handleSearch = (query: string) => {
    setSelectedRoom(query);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Weekly Schedule</h1>
      <div className="max-w-7xl mx-auto px-4">
        <ScheduleSearchBar onSearch={handleSearch} />
        <WeeklySchedule
          schedules={filteredSchedules}
          startTime="06:00"
          endTime="20:00"
          intervalMinutes={60}
        />
      </div>
    </div>
  );
}
