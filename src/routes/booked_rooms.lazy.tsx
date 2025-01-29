import React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { fetchBookedRooms } from "@/hooks/queries/booking/useFetchBookedRooms";
import dayjs from "dayjs";

export const Route = createLazyFileRoute("/booked_rooms")({
  component: BookedRoomss,
});

function BookedRoomss() {
  const { data, isLoading, error } = fetchBookedRooms();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const handleStatusClick = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-w-full">
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time In</th>
            <th>Time Out</th>
            <th>Username</th>
            <th>Room Name</th>
            <th>Course & Section</th>
            <th>Subject Code</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((booking, index) => (
            <tr key={index}>
              <td>{booking.date}</td>
              <td>{dayjs(booking.time_in).format("HH:mm:ss")}</td>
              <td>{dayjs(booking.time_out).format("HH:mm:ss")}</td>
              <td>{booking.profiles?.username}</td>
              <td>{booking.rooms?.room_name}</td>
              <td>{booking.course_and_section}</td>
              <td>{booking.subject_code}</td>
              <td>
                <button onClick={() => handleStatusClick(booking)}>
                  {booking.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
