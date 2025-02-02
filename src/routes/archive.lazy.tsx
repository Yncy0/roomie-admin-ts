import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Table } from "@radix-ui/themes";
import PaginationControls from "@/components/PaginationControls";
import { fetchProfiles } from "@/hooks/queries/profiles/useArchiveProfiles";
import { fetchArchivedRooms } from "@/hooks/queries/rooms/useArchiveRooms";
import { fetchArchivedSchedule } from "@/hooks/queries/schedule/useArchiveSchedule";
import "@/styles/archive.css";

export const Route = createLazyFileRoute("/archive")({
  component: Archive,
});

function Archive() {
  const [currentPageUsers, setCurrentPageUsers] = useState(0);
  const [currentPageRooms, setCurrentPageRooms] = useState(0);
  const [currentPageSchedules, setCurrentPageSchedules] = useState(0);
  const itemsPerPage = 5;

  const { data: archivedUsers, isLoading: isLoadingUsers, error: usersError } = fetchProfiles();
  const { data: archivedRooms, isLoading: isLoadingRooms, error: roomsError } = fetchArchivedRooms();
  const { data: archivedSchedule, isLoading: isLoadingSchedule, error: scheduleError } = fetchArchivedSchedule();

  const paginateData = (data: any[], page: number) => {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data?.slice(startIndex, endIndex) || [];
  };

  const handlePaginationUsers = (action: string) => {
    switch (action) {
      case "first":
        setCurrentPageUsers(0);
        break;
      case "prev":
        setCurrentPageUsers((prev) => Math.max(0, prev - 1));
        break;
      case "next":
        setCurrentPageUsers((prev) => Math.min(Math.ceil((archivedUsers?.length || 0) / itemsPerPage) - 1, prev + 1));
        break;
      case "last":
        setCurrentPageUsers(Math.ceil((archivedUsers?.length || 0) / itemsPerPage) - 1);
        break;
    }
  };

  const handlePaginationRooms = (action: string) => {
    switch (action) {
      case "first":
        setCurrentPageRooms(0);
        break;
      case "prev":
        setCurrentPageRooms((prev) => Math.max(0, prev - 1));
        break;
      case "next":
        setCurrentPageRooms((prev) => Math.min(Math.ceil((archivedRooms?.length || 0) / itemsPerPage) - 1, prev + 1));
        break;
      case "last":
        setCurrentPageRooms(Math.ceil((archivedRooms?.length || 0) / itemsPerPage) - 1);
        break;
    }
  };

  const handlePaginationSchedules = (action: string) => {
    switch (action) {
      case "first":
        setCurrentPageSchedules(0);
        break;
      case "prev":
        setCurrentPageSchedules((prev) => Math.max(0, prev - 1));
        break;
      case "next":
        setCurrentPageSchedules((prev) => Math.min(Math.ceil((archivedSchedule?.length || 0) / itemsPerPage) - 1, prev + 1));
        break;
      case "last":
        setCurrentPageSchedules(Math.ceil((archivedSchedule?.length || 0) / itemsPerPage) - 1);
        break;
    }
  };

  if (isLoadingUsers || isLoadingRooms || isLoadingSchedule) {
    return (
      <div className="dot-spinner">
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
      </div>
    );
  }

  return (
    <div className="archives-container">
      <h1 className="archives-title">Archives</h1>

      {/* Archived Users */}
      <div className="container">
        <h2 className="header">Archived Users</h2>
        {usersError ? (
          <p className="table">Error: {usersError.message}</p>
        ) : archivedUsers && archivedUsers.length > 0 ? (
          <>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {paginateData(archivedUsers, currentPageUsers).map((user) => (
                  <Table.Row key={user.id}>
                    <Table.Cell>{user.full_name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.user_role}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            <PaginationControls
              currentPage={currentPageUsers}
              totalPages={Math.ceil((archivedUsers?.length || 0) / itemsPerPage)}
              handlePagination={handlePaginationUsers}
            />
          </>
        ) : (
          <p>No archived users found.</p>
        )}
      </div>

      {/* Archived Rooms */}
      <div className="container">
        <h2 className="header">Archived Rooms</h2>
        {roomsError ? (
          <p className="table">Error: {roomsError.message}</p>
        ) : archivedRooms && archivedRooms.length > 0 ? (
          <>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Room Name</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Capacity</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Location</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {paginateData(archivedRooms, currentPageRooms).map((room) => (
                  <Table.Row key={room.id}>
                    <Table.Cell>{ room.room_name}</Table.Cell>
                    <Table.Cell>{room.capacity}</Table.Cell>
                    <Table.Cell>{room.location}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            <PaginationControls
              currentPage={currentPageRooms}
              totalPages={Math.ceil((archivedRooms?.length || 0) / itemsPerPage)}
              handlePagination={handlePaginationRooms}
            />
          </>
        ) : (
          <p>No archived rooms found.</p>
        )}
      </div>

      {/* Archived Schedule */}
      <div className="container">
        <h2 className="header">Archived Schedule</h2>
        {scheduleError ? (
          <p className="table">Error: {scheduleError.message}</p>
        ) : archivedSchedule && archivedSchedule.length > 0 ? (
          <>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Course</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Days</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {paginateData(archivedSchedule, currentPageSchedules).map((schedule) => (
                  <Table.Row key={schedule.id}>
                    <Table.Cell>{schedule.course_id}</Table.Cell>
                    <Table.Cell>{schedule.days}</Table.Cell>
                    <Table.Cell>{`${schedule.time_in} - ${schedule.time_out}`}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            <PaginationControls
              currentPage={currentPageSchedules}
              totalPages={Math.ceil((archivedSchedule?.length || 0) / itemsPerPage)}
              handlePagination={handlePaginationSchedules}
            />
          </>
        ) : (
          <p>No archived schedules found.</p>
        )}
      </div>
    </div>
  );
}
