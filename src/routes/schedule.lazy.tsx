import SchedulePage from "@/components/scheduler/SchedulePage";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/schedule")({
  component: ScheduleComponent,
});

function ScheduleComponent() {
  return <SchedulePage />;
}
