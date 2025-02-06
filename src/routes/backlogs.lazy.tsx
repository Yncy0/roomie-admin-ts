import React from "react";
import { fetchBacklogs } from "@/hooks/queries/backlogs/useFetchBacklogs";
import { Table } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import PaginationControls from "@/components/PaginationControls";
import Loader from "@/components/loader/Loader";
import Alert from "@/components/alert";
import "@/styles/backlogs.css";

export const Route = createLazyFileRoute("/backlogs")({
  component: Backlogs,
});

function Backlogs() {
  const { data = [] } = fetchBacklogs();
  const rowsPerPage = 5; // Show 5 items per page

  const [currentPage, setCurrentPage] = React.useState(0);
  const [showLoader, setShowLoader] = React.useState(true);
  const [showAlert, setShowAlert] = React.useState(false);
  const [prevDataLength, setPrevDataLength] = React.useState(data.length);

  // Simulate a 4-second loader display
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(false); // Hide the loader after 4 seconds
    }, 4000); // 4000 ms = 4 seconds

    return () => clearTimeout(timeout);
  }, []);

  // Check for new updates
  React.useEffect(() => {
    if (data.length > prevDataLength) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
    }
    setPrevDataLength(data.length);
  }, [data.length, prevDataLength]);

  // Handle pagination logic
  const handlePagination = (action: string) => {
    if (action === "first") setCurrentPage(0);
    else if (action === "prev") setCurrentPage((prev) => Math.max(prev - 1, 0));
    else if (action === "next")
      setCurrentPage((prev) =>
        Math.min(prev + 1, Math.ceil(data.length / rowsPerPage) - 1)
      );
    else if (action === "last")
      setCurrentPage(Math.ceil(data.length / rowsPerPage) - 1);
  };

  // Paginate the data
  const paginatedData = React.useMemo(() => {
    const start = currentPage * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, currentPage, rowsPerPage]);

  if (showLoader || !data.length) return <Loader />;

  return (
    <div className="backlogs-container">
      {showAlert && <Alert type="info" message="New updates have been added!" />}
      <h1 className="title">Activity Logs</h1>
      <Table.Root className="table">
        <Table.Header className="table-header">
          <Table.Row>
            <Table.ColumnHeaderCell className="table-column-header">
              Action
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header">
              Event
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header">
              Date
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header">
              Time
            </Table.ColumnHeaderCell>
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
        totalPages={Math.ceil(data.length / rowsPerPage)}
        handlePagination={handlePagination}
      />
    </div>
  );
}

export default Backlogs;
