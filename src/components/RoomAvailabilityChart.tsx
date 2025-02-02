import { Bar } from "react-chartjs-2";
//import { useQuery } from "@tanstack/react-query";
import { fetchAvailableRooms } from "@/hooks/queries/rooms/fetchAvailableRooms"; // Updated import
import { fetchAvailableBookedRooms } from "@/hooks/queries/booking/fetchAvailableBookedRooms"; // Updated import
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RoomAvailabilityChart = () => {
  // Fetch data
  const { data: rooms, isLoading: roomsLoading } = fetchAvailableRooms(); // Updated hook
  const { data: bookedRooms, isLoading: bookedRoomsLoading } = fetchAvailableBookedRooms(); // Updated hook

  // Process data to calculate the total rooms inputted each day
  const roomsAvailable = rooms?.map((room) => {
    const bookedForRoom = bookedRooms?.filter(
      (bookedRoom) => bookedRoom.room_id === room.id
    ).length;

    return bookedForRoom ? 0 : 1; // Consider availability as 0 or 1 (booked or available)
  });

  // Removing Sunday from labels and adjusting the data
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Rooms Available",
        data: roomsAvailable?.slice(0, -1), // Remove Sunday (last element)
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
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
          text: "Day",
        },
      },
      y: {
        title: {
          display: true,
          text: "Rooms Available",
        },
        beginAtZero: true,
      },
    },
  };

  if (roomsLoading || bookedRoomsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-[300px]">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default RoomAvailabilityChart;
