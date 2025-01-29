import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/booked_rooms")({
  component: BookedRoomss,
});

function BookedRoomss() {
  return <div>Hello "/bookedRooms"!</div>;
}
