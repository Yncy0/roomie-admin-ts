import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchBookingsPerMonth } from "@/hooks/queries/booking/fetchBookingsPerMonth ";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
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
    labels: months,  // Set the months on the x-axis
    datasets: [
      {
        label: "Bookings",
        data: bookings,  // The number of bookings for each month
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,  // Ensure the position is one of the valid values
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Bookings",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full h-[300px]">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default BookingTrendsChart;
