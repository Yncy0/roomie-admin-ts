import { Outlet, useMatch } from "@tanstack/react-router";
import Header from "./Header";

// Utility function to check if the route should display the header
const shouldDisplayHeader = () => {
  const loginRoute = useMatch({ from: "/login" });
  return !loginRoute;
};

export default function BodyComponent() {
  return (
    <div className="body-container">
      {shouldDisplayHeader() && <Header />}
      <Outlet />
    </div>
  );
}
