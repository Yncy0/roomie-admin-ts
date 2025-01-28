import Navbar from "../components/Navbar";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

//TODO: Navbar here
export const Route = createRootRoute({
  component: () => (
    <>
      <Navbar>
        <div className="p-2 flex flex-col gap-2 bg-[rgba(226, 240, 253)]">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
          <Link to="/dashboard" className="[&.active]:font-bold">
            Dashboard
          </Link>
          <Link to="/bookedRooms" className="[&.active]:font-bold">
            Booked Rooms
          </Link>
          <Link to="/users" className="[&.active]:font-bold">
            Users
          </Link>
          <Link to="/rooms" className="[&.active]:font-bold">
            Rooms
          </Link>
          <Link to="/schedule" className="[&.active]:font-bold">
            Schedule
          </Link>
          <Link to="/backlogs" className="[&.active]:font-bold">
            Backlogs
          </Link>
          <Link to="/archive" className="[&.active]:font-bold">
            Archive
          </Link>
        </div>
      </Navbar>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
