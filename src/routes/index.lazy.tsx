import { createLazyFileRoute } from "@tanstack/react-router";
import DashboardTable from "@/components/DashboardTable";
import BookingTrendsChart from "@/components/BookingTrendsChart"; // Default import
import RoomAvailabilityChart from "@/components/RoomAvailabilityChart"; // Default import
import "@/styles/dashboard.css";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Overview</h2>

      {/* Charts Section (Row Layout) */}
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

      {/* Recent Activity */}
      <div className="activity-section">
        <DashboardTable />
      </div>
    </div>
  );
}

export default Index;
