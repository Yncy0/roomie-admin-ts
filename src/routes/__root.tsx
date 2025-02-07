import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BodyComponent from "@/components/BodyComponent";
import Navbar from "../components/Navbar";
import { createRootRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Theme } from "@radix-ui/themes";
import "../styles/style.css";
import AuthProvider, { useAuth } from "@/providers/AuthProvider";
import { ReactNode } from "react";

//import { TanStackRouterDevtools } from "@tanstack/router-devtools";

type PrivateRouteProps = {
  children: ReactNode;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const nav = useNavigate();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    nav({ to: "/login" });
    return null;
  } else {
    nav({ to: "/" });
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
          <PrivateRoute>
            <BodyComponent />
          </PrivateRoute>
          {/* <TanStackRouterDevtools /> */}
        </Theme>
      </QueryClientProvider>
    </AuthProvider>
  ),
});
