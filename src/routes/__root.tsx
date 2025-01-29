import Navbar from "../components/Navbar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

//TODO: Navbar here
export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex">
        <Navbar />
      </div>

      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
