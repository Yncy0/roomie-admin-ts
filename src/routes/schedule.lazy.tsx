import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/schedule")({
  component: Schedule,
});

function Schedule() {
  return <div>Hello "/schedule"!</div>;
}
