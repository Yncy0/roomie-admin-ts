import React from "react";
import { fetchBacklogs } from "@/hooks/queries/backlogs/useFetchBacklogs";
import { Table } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import PaginationControls from "@/components/PaginationControls";
import Loader from "@/components/loader/Loader";
import "../styles/backlogs.css";

export const Route = createLazyFileRoute("/backlogs")({
  component: Backlogs,
});

function Backlogs() {
  const { data = [] } = fetchBacklogs();
  const rowsPerPage = 5; // Show 5 items per page

  const [currentPage, setCurrentPage] = React.useState(0);
  const [showLoader, setShowLoader] = React.useState(true);

  // Simulate a 4-second loader display
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(false); // Hide the loader after 4 seconds
    }, 4000); // 4000 ms = 4 seconds

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  // Handle pagination logic
  const handlePagination = (action: string) => {
    if (action === "first") setCurrentPage(0);
    else if (action === "prev") setCurrentPage((prev) => Math.max(prev - 1, 0));
    else if (action === "next") setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(data.length / rowsPerPage) - 1));
    else if (action === "last") setCurrentPage(Math.ceil(data.length / rowsPerPage) - 1);
  };

  // Paginate the data
  const paginatedData = React.useMemo(() => {
    const start = currentPage * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, currentPage, rowsPerPage]);

  if (showLoader || !data.length) return <Loader />; // Show loader while fetching data or during the delay

  return (
    <div className="backlogs-container">
      <h1 className="title">Backlogs</h1>
      <Table.Root className="table">
        <Table.Header className="table-header">
          <Table.Row>
            <Table.ColumnHeaderCell className="table-column-header">Action</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header">Event</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header">Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header">Time</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body className="table-body">
          {paginatedData.map((items, index) => (
            <Table.Row key={index} className="table-row">
              <Table.Cell className="table-cell">{items.action}</Table.Cell>
              <Table.Cell className="table-cell">{items.event}</Table.Cell>
              <Table.Cell className="table-cell">
                {dayjs(items.created_at).format("MM/DD/YYYY")}
              </Table.Cell>
              <Table.Cell className="table-cell">
                {dayjs(items.created_at).format("HH:mm:ss a")}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={Math.ceil(data.length / rowsPerPage)} // Calculate total number of pages
        handlePagination={handlePagination}
      />
    </div>
  );
}

export default Backlogs;
