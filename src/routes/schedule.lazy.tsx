import { createLazyFileRoute } from "@tanstack/react-router";
import SchedulePage from "../components/scheduler/SchedulePage"

export const Route = createLazyFileRoute("/schedule")({
  component: ScheduleComponent,
});

function ScheduleComponent() {
  return <SchedulePage />
}
