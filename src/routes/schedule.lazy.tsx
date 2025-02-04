import { ScheduleSearchBar } from "@/components/ScheduleSearchBar";
import { WeeklySchedule } from "@/components/ScheduleTables";
import { fetchSchedule } from "@/hooks/queries/schedule/useFetchSchedule";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Database } from "database.types";
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
  const [selectedRoomId, setSelectedRoomId] = React.useState("");
  const {
    data: schedules,
    isLoading: isLoadingSchedules,
    error: scheduleError,
  } = fetchSchedule();

  // Extract unique rooms from schedules
  const uniqueRooms = React.useMemo(() => {
    if (!schedules) return [];
    const roomsMap = new Map<string, { room_id: string; room_name: string }>();
    schedules.forEach((schedule) => {
      if (schedule.rooms) {
        roomsMap.set(schedule.rooms.id, {
          room_id: schedule.rooms.id,
          room_name: schedule.rooms.room_name as string,
        });
      }
    });
    return Array.from(roomsMap.values());
  }, [schedules]);

  // Filter schedules based on selected room ID
  const filteredSchedules = React.useMemo(
    () =>
      schedules?.filter(
        (schedule: Schedule) => schedule.room_id === selectedRoomId
      ) || [],
    [schedules, selectedRoomId]
  );

  const handleSearch = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  if (isLoadingSchedules) return <div>Loading...</div>;
  if (scheduleError)
    return <div>Error loading schedules: {scheduleError.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Weekly Schedule</h1>
      <div className="max-w-7xl mx-auto px-4">
        <ScheduleSearchBar rooms={uniqueRooms} onSearch={handleSearch} />
        {selectedRoomId ? (
          <WeeklySchedule
            schedules={filteredSchedules}
            startTime="06:00"
            endTime="20:00"
            intervalMinutes={60}
          />
        ) : (
          <p className="text-center mt-4">
            Please select a room to view its schedule.
          </p>
        )}
      </div>
    </div>
  );
}
