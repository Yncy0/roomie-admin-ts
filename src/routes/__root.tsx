import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BodyComponent from "@/components/BodyComponent";
import Navbar from "../components/Navbar";
import { createRootRoute } from "@tanstack/react-router";
import { Theme } from "@radix-ui/themes";
import "../styles/style.css";
import AuthProvider, { useAuth } from "@/providers/AuthProvider";
import { PropsWithChildren } from "react";

//import { TanStackRouterDevtools } from "@tanstack/router-devtools";

const PrivateRoute: React.FC = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="flex flex-row">
      {/* Conditionally render Navbar */}
      {isAuthenticated && <Navbar />}
      <main className="flex flex-col gap-4 w-full">{children}</main>
    </div>
  );
};

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <QueryClientProvider client={new QueryClient()}>
        <Theme className="root_theme">
          <BodyComponent />
          {/* <TanStackRouterDevtools /> */}
        </Theme>
      </QueryClientProvider>
    </AuthProvider>
  ),
});
