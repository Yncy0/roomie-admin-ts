import { Bar } from "react-chartjs-2"
import { fetchAvailableRooms } from "@/hooks/queries/rooms/fetchAvailableRooms"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import "@/styles/Dashboard/RoomAvailabilityChart.css"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const RoomAvailabilityChart: React.FC = () => {
  // Fetch room availability data
  const { data, isLoading, isError } = fetchAvailableRooms()

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error fetching room data.</p>

  // Extract data safely
  const totalRooms = data?.totalRooms ?? 0
  const availableRooms = data?.availableRoomsCount ?? 0
  const totalBookingsToday = data?.totalBookingsToday ?? 0

  // Chart data
  const chartData = {
    labels: ["Total Rooms", "Available Rooms", "Total Bookings Today"],
    datasets: [
      {
        label: "Room Status (Today)",
        data: [totalRooms, availableRooms, totalBookingsToday],
        backgroundColor: [
          "#5374d8", // Total Rooms
          "#8bb2ee", // Available Rooms
          "#cbe3fa", // Total Bookings
        ],
        borderColor: [
          "#5374d8", // Total Rooms
          "#8bb2ee", // Available Rooms
          "#cbe3fa", // Total Bookings
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Count" } },
    },
  }

  return (
    <div className="room-availability-chart">
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}

export default RoomAvailabilityChart
