import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchBookingsPerMonth } from "@/hooks/queries/booking/fetchBookingsPerMonth ";

// Register Chart.js components for Pie Chart
ChartJS.register(CategoryScale, ArcElement, Tooltip, Legend);

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
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
          "#8BC34A", "#D84315", "#00ACC1", "#C2185B", "#7B1FA2", "#2E7D32",
        ],
        hoverBackgroundColor: [
          "#FF4265", "#1592E8", "#FFD834", "#3AAFA9", "#784BFF", "#FF7F24",
          "#7CB342", "#BF360C", "#00838F", "#AD1457", "#6A1B9A", "#1B5E20",
        ],
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
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default BookingTrendsChart;
