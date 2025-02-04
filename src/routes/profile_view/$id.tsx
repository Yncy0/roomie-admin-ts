import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile_view/$id")({
  component: UserView,
  loader: async ({ params }) => {
    return {
      id: params.id,
    };
  },
});

function UserView() {
  const { id } = Route.useLoaderData();
  return (
    <div>
      <p>{id}</p>
    </div>
  );
}
