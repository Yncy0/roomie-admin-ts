import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchBookingsPerMonth } from "@/hooks/queries/booking/fetchBookingsPerMonth ";

// Register Chart.js components for Line Chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const BookingTrendsChart = () => {
  // Fetch bookings per month using the custom hook
  const { data: bookingsPerMonth, isLoading, isError } = fetchBookingsPerMonth();

  // Display loading or error states
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  // Prepare the data for the chart
  const months = Object.keys(bookingsPerMonth || {});  // Extract month names from the data
  const bookings = Object.values(bookingsPerMonth || {});  // Extract the booking counts

  const chartData = {
    labels: months,  // Set the months as labels
    datasets: [
      {
        label: "Bookings",
        data: bookings,  // The number of bookings for each month
        borderColor: "#FF6384",  // Line color
        backgroundColor: "rgba(255, 99, 132, 0.2)",  // Area under the line color
        fill: true,  // Enable filling under the line
        tension: 0.4,  // Smooth line
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,  // Position legend at the top
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const value = tooltipItem.raw;
            return ` ${value} bookings`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[300px] flex justify-center items-center">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default BookingTrendsChart;
