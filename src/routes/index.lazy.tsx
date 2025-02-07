import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import DashboardTable from "@/components/DashboardTable";
import BookingTrendsChart from "@/components/chart/BookingTrendsChart";
import RoomAvailabilityChart from "@/components/chart/RoomAvailabilityChart";
//import AvailableRooms from "@/components/AvailableRooms"
import "@/styles/Dashboard/dashboard.css";
import Loader from "@/components/loader/Loader";
import { useAuth } from "@/providers/AuthProvider";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="dashboard-container">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h2 className="dashboard-title">Overview</h2>
          <div className="charts-section">
            <div className="chart-box">
              <h3 className="chart-title">Room Availability</h3>
              <RoomAvailabilityChart />
            </div>
            <div className="chart-box">
              <h3 className="chart-title">Booking Trends</h3>
              <BookingTrendsChart />
            </div>
          </div>

          {/* Include the AvailableRooms component
          <AvailableRooms />*/}

          <div className="activity-section">
            <DashboardTable />
          </div>
        </>
      )}
    </div>
  );
}

export default Index;
