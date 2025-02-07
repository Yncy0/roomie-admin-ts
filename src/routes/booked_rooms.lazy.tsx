import { createLazyFileRoute } from "@tanstack/react-router";
import { fetchBookedRooms } from "@/hooks/queries/booking/useFetchBookedRooms";
import dayjs from "dayjs";
import "../styles/BookedRooms/bookedRooms.css";
import { Table, Badge, Dialog, Select } from "@radix-ui/themes";
import StatusDialog from "@/components/dialogs/StatusDialog";
import PaginationControls from "@/components/PaginationControls";
import { useState, useEffect } from "react";
import Loader from "@/components/loader/Loader";

export const Route = createLazyFileRoute("/booked_rooms")({
  component: BookedRooms,
});

function BookedRooms() {
  const { data, isLoading, error } = fetchBookedRooms();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;
  const [statusFilter, setStatusFilter] = useState("All");
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(false);
    }, 4000);
    return () => clearTimeout(timeout);
  }, []);

  if (showLoader || isLoading) return <Loader />;
  if (error) return <div className="error-message">Error: {error.message}</div>;

  // Filter by status
  const filteredData = (data ?? []).filter(
    (booking) => statusFilter === "All" || booking.status === statusFilter
  );

  // Sort data to ensure "PENDING" status comes first
  const sortedData = filteredData.sort((a, b) => {
    if (a.status === "PENDING" && b.status !== "PENDING") return -1; // "PENDING" comes first
    if (a.status !== "PENDING" && b.status === "PENDING") return 1; // "PENDING" comes first
    return 0; // Maintain existing order for other statuses
  });

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const handlePagination = (action: string) => {
    if (action === "first") setCurrentPage(0);
    if (action === "prev" && currentPage > 0) setCurrentPage(currentPage - 1);
    if (action === "next" && currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    if (action === "last") setCurrentPage(totalPages - 1);
  };

  return (
    <div className="container">
      <h1 className="title">Booked Rooms List</h1>

      {/* Filter Controls */}
      <div className="controls">
        {/* Label or Text Before Filter */}
        <span className="filter-label">Filter by Status:</span>

        <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
          <Select.Trigger placeholder="Filter by Status" />
          <Select.Content>
            <Select.Item value="All">All</Select.Item>
            <Select.Item value="PENDING">Pending</Select.Item>
            <Select.Item value="INCOMING">Incoming</Select.Item>
            <Select.Item value="ONGOING">Ongoing</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>

      <Table.Root className="table">
        <Table.Header className="table-header">
          <Table.Row className="table-row">
            <Table.ColumnHeaderCell className="table-column-header-cell">Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">Time In</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">Time Out</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">Username</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">Room Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">Course & Section</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">Subject Code</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">Edit</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {paginatedData.length > 0 ? (
            paginatedData.map((booking, index) => (
              <Table.Row key={index} className="table-row">
                <Table.Cell className="table-cell">{booking.date || "No Data"}</Table.Cell>
                <Table.Cell className="table-cell">{dayjs(booking.time_in).format("HH:mm:ss") || "No Data"}</Table.Cell>
                <Table.Cell className="table-cell">{dayjs(booking.time_out).format("HH:mm:ss") || "No Data"}</Table.Cell>
                <Table.Cell className="table-cell">{booking.profiles?.username || "No Data"}</Table.Cell>
                <Table.Cell className="table-cell">{booking.rooms?.room_name || "No Data"}</Table.Cell>
                <Table.Cell className="table-cell">{booking.course_and_section || "No Data"}</Table.Cell>
                <Table.Cell className="table-cell">{booking.subject_code || "No Data"}</Table.Cell>
                <Table.Cell className="table-cell">
                  <div className="flex flex-row items-center gap-2">
                    <Badge color="orange" className="status-badge">{booking.status || "No Data"}</Badge>
                  </div>
                </Table.Cell>
                <Table.Cell className="table-cell">
                  <Dialog.Root>
                    <StatusDialog item={booking} />
                  </Dialog.Root>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={9} className="table-cell no-data">
                No Data Available
              </Table.Cell>
            </Table.Row>
          )}
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

export default BookedRooms;
