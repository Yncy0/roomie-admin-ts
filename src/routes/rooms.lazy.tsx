import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/rooms")({
  component: Rooms,
});

function Rooms() {
  return <div>Hello "/rooms"!</div>;
}
