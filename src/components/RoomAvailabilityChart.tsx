import { Bar } from "react-chartjs-2"
import { fetchAvailableBookedRooms } from "@/hooks/queries/booking/fetchAvailableBookedRooms"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const RoomAvailabilityChart = () => {
  // Fetch room availability data
  const { data, isLoading, isError } = fetchAvailableBookedRooms()

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error fetching room data.</p>

  const { totalRooms, availableRooms, bookedRooms, allRooms } = data || {
    totalRooms: 0,
    availableRooms: 0,
    bookedRooms: [],
    allRooms: [],
  }

  // Get the list of available rooms
  const bookedRoomIds = new Set(bookedRooms.map((room) => Number(room.room_id))) // Ensure room_id is treated as a number
  const availableRoomsList = allRooms.filter((room) => !bookedRoomIds.has(room.id))

  // Chart data
  const chartData = {
    labels: ["Total Rooms", "Available Rooms", "Booked Rooms"],
    datasets: [
      {
        label: "Room Status",
        data: [totalRooms, availableRooms, bookedRooms.length],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)", // Total Rooms
          "rgba(75, 192, 192, 0.6)", // Available Rooms
          "rgba(255, 99, 132, 0.6)", // Booked Rooms
        ],
        borderColor: [
          "rgb(54, 162, 235)", // Total Rooms
          "rgb(75, 192, 192)", // Available Rooms
          "rgb(255, 99, 132)", // Booked Rooms
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
    <div className="w-full">
      {/* Bar Chart */}
      <div className="h-[300px]">
        <Bar data={chartData} options={options} />
      </div>

      {/* Available Rooms Section */}
      <div className="mt-4 p-4 border rounded-lg shadow-sm bg-white">
        <h3 className="text-lg font-semibold mb-2">📌 Currently Available Rooms</h3>
        {availableRoomsList.length > 0 ? (
          <ul className="list-disc pl-5">
            {availableRoomsList.map((room) => (
              <li key={room.id} className="text-gray-700">
                🔹 <strong>{room.room_name}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-red-500">❌ No rooms available at the moment.</p>
        )}
      </div>
    </div>
  )
}

export default RoomAvailabilityChart
