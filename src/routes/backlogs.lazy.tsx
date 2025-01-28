import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/backlogs")({
  component: Backlogs,
});

function Backlogs() {
  return <div>Hello "/backlogs"!</div>;
}
