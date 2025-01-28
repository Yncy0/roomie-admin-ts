import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/users")({
  component: Users,
});

function Users() {
  return <div>Hello "/users"!</div>;
}
