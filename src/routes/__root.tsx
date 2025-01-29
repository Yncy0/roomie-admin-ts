import HeaderComponent from "../components/Header";
import Navbar from "../components/Navbar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
//import { TanStackRouterDevtools } from "@tanstack/router-devtools";

//TODO: Navbar here
export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex flex-row">
        <Navbar />
        <div className="body-container ">
          <main className="flex flex-col gap-4 w-full">
            <HeaderComponent />
            <Outlet />
          </main>
        </div>
      </div>
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
});
