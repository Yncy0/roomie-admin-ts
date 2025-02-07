import { Outlet, useMatch } from "@tanstack/react-router";
import Header from "./Header";
import { useAuth } from "@/providers/AuthProvider";

export default function BodyComponent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="body-container">
      {isAuthenticated && <Header />}
      <Outlet />
    </div>
  );
}
