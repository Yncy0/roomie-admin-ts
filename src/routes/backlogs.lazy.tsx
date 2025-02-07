import React from "react";
import { fetchBacklogs } from "@/hooks/queries/backlogs/useFetchBacklogs";
import { Table, Select } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import PaginationControls from "@/components/PaginationControls";
import Loader from "@/components/loader/Loader";
import Alert from "@/components/Alert";
import "@/styles/Backlogs/backlogs.css";

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
  const [actionFilter, setActionFilter] = React.useState("All"); // Filter state
  const [sortOrder, setSortOrder] = React.useState("asc"); // Sort order state

  // Simulate a 4-second loader display
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(false); // Hide the loader after 4 seconds
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  // Check for new updates
  React.useEffect(() => {
    if (data.length > prevDataLength) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
    setPrevDataLength(data.length);
  }, [data.length, prevDataLength]);

  // Filtered data based on action type
  const filteredData = React.useMemo(() => {
    return actionFilter === "All"
      ? data
      : data.filter((item) => item.action === actionFilter);
  }, [data, actionFilter]);

  // Sort the data by date
  const sortedData = React.useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const dateA = dayjs(a.created_at);
      const dateB = dayjs(b.created_at);
      return sortOrder === "asc" ? dateA.diff(dateB) : dateB.diff(dateA);
    });
  }, [filteredData, sortOrder]);

  // Handle pagination logic
  const handlePagination = (action: string) => {
    if (action === "first") setCurrentPage(0);
    else if (action === "prev") setCurrentPage((prev) => Math.max(prev - 1, 0));
    else if (action === "next")
      setCurrentPage((prev) =>
        Math.min(prev + 1, Math.ceil(sortedData.length / rowsPerPage) - 1)
      );
    else if (action === "last")
      setCurrentPage(Math.ceil(sortedData.length / rowsPerPage) - 1);
  };

  // Paginate the data
  const paginatedData = React.useMemo(() => {
    const start = currentPage * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  if (showLoader || !data.length) return <Loader />;

  return (
    <div className="backlogs-container">
      {showAlert && <Alert type="info" message="New updates have been added!" />}
      <h1 className="title">Activity Logs</h1>

      {/* Action Filter and Sort by Date in Row */}
      <div className="filter-container row">
        <div className="filter-item">
          <label className="filter-label">Filter by Action:</label>
          <Select.Root value={actionFilter} onValueChange={setActionFilter}>
            <Select.Trigger placeholder="Select Action" />
            <Select.Content>
              <Select.Item value="All">All</Select.Item>
              <Select.Item value="INSERT">INSERT</Select.Item>
              <Select.Item value="UPDATE">UPDATE</Select.Item>
              <Select.Item value="DELETE">DELETE</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        <div className="filter-item">
          <label className="filter-label">Sort by Date:</label>
          <Select.Root value={sortOrder} onValueChange={setSortOrder}>
            <Select.Trigger placeholder="Select Order" />
            <Select.Content>
              <Select.Item value="asc">Ascending</Select.Item>
              <Select.Item value="desc">Descending</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
      </div>

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
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <Table.Row key={index} className="table-row">
                <Table.Cell className="table-cell">{item.action}</Table.Cell>
                <Table.Cell className="table-cell">{item.event}</Table.Cell>
                <Table.Cell className="table-cell">
                  {dayjs(item.created_at).format("MM/DD/YYYY")}
                </Table.Cell>
                <Table.Cell className="table-cell">
                  {dayjs(item.created_at).format("HH:mm:ss a")}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={4} className="no-data">
                No matching logs found.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={Math.ceil(sortedData.length / rowsPerPage)}
        handlePagination={handlePagination}
      />
    </div>
  );
}

export default Backlogs;
