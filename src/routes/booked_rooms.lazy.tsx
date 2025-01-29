import React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { fetchBookedRooms } from "@/hooks/queries/booking/useFetchBookedRooms";
import dayjs from "dayjs";

import * as Dialog from "@radix-ui/themes";
import { Table } from "@radix-ui/themes";

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
    <div className="min-w-full gap-7 flex flex-col">
      <h1 className="text-center">Booked Rooms List</h1>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Time In</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Time Out</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Room Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Course & Section</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Subject Code</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.map((booking, index) => (
            <Table.Row key={index}>
              <Table.Cell>{booking.date}</Table.Cell>
              <Table.Cell>
                {dayjs(booking.time_in).format("HH:mm:ss")}
              </Table.Cell>
              <Table.Cell>
                {dayjs(booking.time_out).format("HH:mm:ss")}
              </Table.Cell>
              <Table.Cell>{booking.profiles?.username}</Table.Cell>
              <Table.Cell>{booking.rooms?.room_name}</Table.Cell>
              <Table.Cell>{booking.course_and_section}</Table.Cell>
              <Table.Cell>{booking.subject_code}</Table.Cell>
              <Table.Cell>{booking.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
