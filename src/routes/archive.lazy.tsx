import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/archive")({
  component: Archive,
});

function Archive() {
  return <div>Hello "/archive"!</div>;
}
