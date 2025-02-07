import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js"
import { fetchBookingsPerMonth } from "@/hooks/queries/booking/fetchBookingsPerMonth "

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const BookingTrendsChart = () => {
  const { data: bookingsPerMonth, isLoading, isError } = fetchBookingsPerMonth()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error fetching data</div>

  // Ensure correct month order
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  const bookings = months.map((month) => bookingsPerMonth?.[month] ?? 0) // Ensure data is ordered

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Bookings",
        data: bookings,
        borderColor: "#5374d8",
        backgroundColor: "#5374d8",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => ` ${tooltipItem.raw} bookings`,
        },
      },
    },
  }

  return (
    <div className="w-full h-[300px] flex justify-center items-center">
      <Line data={chartData} options={options} />
    </div>
  )
}

export default BookingTrendsChart
