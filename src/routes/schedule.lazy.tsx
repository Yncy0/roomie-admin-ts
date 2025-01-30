import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/schedule")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>HELP ME CANNOT PUT SCHEDULER</div>;
}
