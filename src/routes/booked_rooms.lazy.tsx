import { createLazyFileRoute } from "@tanstack/react-router";
import { fetchBookedRooms } from "@/hooks/queries/booking/useFetchBookedRooms";
import dayjs from "dayjs";
import "../styles/bookedRooms.css";

import { Table, Badge, Dialog } from "@radix-ui/themes";
import StatusDialog from "@/components/dialogs/StatusDialog";
import PaginationControls from "@/components/PaginationControls";
import { useState, useEffect } from "react";
import Loader from "@/components/loader/Loader";
import useSubscriptionBookedRoom from "@/hooks/queries/booking/useSubcription";

export const Route = createLazyFileRoute("/booked_rooms")({
  component: BookedRoomss,
});

function BookedRoomss() {
  useSubscriptionBookedRoom();
  const { data, isLoading, error } = fetchBookedRooms();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5; // Adjust as needed

  const [showLoader, setShowLoader] = useState(true);

  // Simulate a 4-second loader display
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(false); // Hide the loader after 4 seconds
    }, 4000); // 4000 ms = 4 seconds

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  // Show loader when loading or before 4 seconds
  if (showLoader || isLoading) return <Loader />;

  // Handle error
  if (error) return <div className="error-message">Error: {error.message}</div>;

  const totalPages = Math.ceil((data?.length || 0) / pageSize);

  // Paginate the data
  const paginatedData =
    data?.slice(currentPage * pageSize, (currentPage + 1) * pageSize) || [];

  const handlePagination = (action: string) => {
    if (action === "first") setCurrentPage(0);
    if (action === "prev" && currentPage > 0) setCurrentPage(currentPage - 1);
    if (action === "next" && currentPage < totalPages - 1)
      setCurrentPage(currentPage + 1);
    if (action === "last") setCurrentPage(totalPages - 1);
  };

  return (
    <div className="container">
      <h1 className="title">Booked Rooms List</h1>
      <Table.Root className="table">
        <Table.Header className="table-header">
          <Table.Row className="table-row">
            <Table.ColumnHeaderCell className="table-column-header-cell">
              Date
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">
              Time In
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">
              Time Out
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">
              Username
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">
              Room Name
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">
              Course & Section
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">
              Subject Code
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">
              Status
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {paginatedData.map((booking, index) => (
            <Table.Row key={index} className="table-row">
              <Table.Cell className="table-cell">{booking.date}</Table.Cell>
              <Table.Cell className="table-cell">
                {dayjs(booking.time_in).format("HH:mm:ss")}
              </Table.Cell>
              <Table.Cell className="table-cell">
                {dayjs(booking.time_out).format("HH:mm:ss")}
              </Table.Cell>
              <Table.Cell className="table-cell">
                {booking.profiles?.username}
              </Table.Cell>
              <Table.Cell className="table-cell">
                {booking.rooms?.room_name}
              </Table.Cell>
              <Table.Cell className="table-cell">
                {booking.course_and_section}
              </Table.Cell>
              <Table.Cell className="table-cell">
                {booking.subject_code}
              </Table.Cell>
              <Table.Cell className="table-cell">
                <div className="flex flex-row items-center justify-around ">
                  <Badge color="orange" className="status-badge">
                    {booking.status}
                  </Badge>
                  <Dialog.Root>
                    <StatusDialog item={booking} />
                  </Dialog.Root>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        handlePagination={handlePagination}
      />
    </div>
  );
}
