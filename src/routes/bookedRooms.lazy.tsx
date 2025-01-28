import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/bookedRooms")({
  component: BookedRoomss,
});

function BookedRoomss() {
  return <div>Hello "/bookedRooms"!</div>;
}
