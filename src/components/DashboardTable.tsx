import { useEffect, useState } from "react";
import useDashboardRooms from "@/hooks/queries/rooms/useDashboardRooms";
import useDashboardBookedRooms from "@/hooks/queries/booking/useDashboardBookedRooms";
import '@/styles/dashboardTable.css';  // Import your existing CSS file

interface RoomUtilizationData {
  roomName: string;
  totalBookings: number;
  cancelledBookings: number;
}

const DashboardTable = () => {
  const { data: rooms, isLoading: loadingRooms, isError: errorRooms } = useDashboardRooms();
  const { data: bookings, isLoading: loadingBookings, isError: errorBookings } = useDashboardBookedRooms();

  const [roomUtilizationData, setRoomUtilizationData] = useState<RoomUtilizationData[]>([]);

  useEffect(() => {
    if (rooms && bookings) {
      const aggregatedData: Record<string, RoomUtilizationData> = {};

      rooms.forEach((room) => {
        if (room.room_name) {
          aggregatedData[room.room_name] = {
            roomName: room.room_name,
            totalBookings: 0,
            cancelledBookings: 0,
          };
        }
      });

      bookings.forEach((booking) => {
        const roomName = booking.rooms?.room_name;
        if (roomName && aggregatedData[roomName]) {
          aggregatedData[roomName].totalBookings += 1;
          if (booking.status === "cancelled") {
            aggregatedData[roomName].cancelledBookings += 1;
          }
        }
      });

      setRoomUtilizationData(Object.values(aggregatedData));
    }
  }, [rooms, bookings]);

  if (loadingRooms || loadingBookings) return <div>Loading...</div>;
  if (errorRooms || errorBookings) return <div>Error loading data.</div>;

  return (
    <div>
      <h2 className="title">Room Utilization</h2>
      <table className="table">
        <thead className="table-header">
          <tr>
            <th className="table-column-header">Room/Facility</th>
            <th className="table-column-header">Total Bookings</th>
            <th className="table-column-header">Cancelled Bookings</th>
          </tr>
        </thead>
        <tbody>
          {roomUtilizationData.map((room, index) => (
            <tr key={index} className="table-row">
              <td className="table-cell">{room.roomName}</td>
              <td className="table-cell">{room.totalBookings}</td>
              <td className="table-cell">{room.cancelledBookings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
