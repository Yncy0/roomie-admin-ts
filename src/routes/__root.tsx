import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HeaderComponent from "../components/Header";
import Navbar from "../components/Navbar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Theme } from "@radix-ui/themes";
//import { TanStackRouterDevtools } from "@tanstack/router-devtools";

//TODO: Navbar here
export const Route = createRootRoute({
  component: () => (
    <>
      <QueryClientProvider client={new QueryClient()}>
        <Theme>
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
        </Theme>
      </QueryClientProvider>
    </>
  ),
});
