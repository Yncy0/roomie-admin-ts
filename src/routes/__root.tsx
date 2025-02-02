import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BodyComponent from "@/components/BodyComponent";
import Navbar from "../components/Navbar";
import { createRootRoute} from "@tanstack/react-router";
import { Theme } from "@radix-ui/themes";
import "../styles/style.css";


//import { TanStackRouterDevtools } from "@tanstack/router-devtools";

//TODO: Navbar here
export const Route = createRootRoute({
  component: () => (
    <>
      <QueryClientProvider client={new QueryClient()}>
        <Theme className="root_theme">
          <div className="flex flex-row">
            <Navbar />
            <main className="flex flex-col gap-4 w-full">
                <BodyComponent/>  
            </main>
          </div>
          {/* <TanStackRouterDevtools /> */}
          </Theme>
      </QueryClientProvider>
    </>
  ),
});