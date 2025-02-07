import React from "react";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fetchRooms } from "@/hooks/queries/rooms/useFetchRooms";
import { Table, Button, Card, Heading } from "@radix-ui/themes";
import RoomsCard from "@/components/RoomsCard";
import Loader from "@/components/loader/Loader";
import RoomsLoader from "@/components/RoomsLoader";
import PaginationControls from "@/components/PaginationControls";
import "@/styles/rooms.css";

export const Route = createLazyFileRoute("/rooms")({
  component: Rooms,
});

function Rooms() {
  const [showLoader, setShowLoader] = React.useState(true);
  const [showRoomsLoader, setShowRoomsLoader] = React.useState(false);
  const { data = [], isLoading, error } = fetchRooms();
  const navigate = useNavigate();
  const roomsPerRow = 3;

  // Define columns for the table
  const columns = React.useMemo(
    () => [
      {
        header: "Rooms",
        accessorKey: "rooms",
        cell: ({ row }: any) => (
          <div className="rooms-row">
            {row.original.rooms.map((room: any) => (
              <RoomsCard key={room.id} {...room} />
            ))}
          </div>
        ),
      },
    ],
    []
  );

  // Paginate rooms data
  const paginatedData = React.useMemo(() => {
    const totalPages = Math.ceil(data.length / roomsPerRow);
    return Array.from({ length: totalPages }, (_, pageIndex) => ({
      rooms: data.slice(pageIndex * roomsPerRow, (pageIndex + 1) * roomsPerRow),
    }));
  }, [data, roomsPerRow]);

  // React Table configuration
  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 1 } },
  });

  const handlePagination = (action: string) => {
    if (table.getPageCount() === 0) return;

    setShowRoomsLoader(true);
    setTimeout(() => {
      switch (action) {
        case "first":
          table.setPageIndex(0);
          break;
        case "prev":
          if (table.getCanPreviousPage()) table.previousPage();
          break;
        case "next":
          if (table.getCanNextPage()) table.nextPage();
          break;
        case "last":
          table.setPageIndex(table.getPageCount() - 1);
          break;
      }
      setShowRoomsLoader(false);
    }, 500);
  };

  // Hide loader once data is fetched
  React.useEffect(() => {
    if (!isLoading) setShowLoader(false);
  }, [isLoading]);

  if (error) return <div className="rooms-error">Error loading rooms</div>;

  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  return (
    <>
      {showLoader ? (
        <Loader />
      ) : (
        <Card className="rooms-container">
          <div className="rooms-header">
            <Heading size="4">Rooms</Heading>
            <Button
              onClick={() => navigate({ to: "/rooms_add" })}
              className="rooms-add-button"
            >
              Add Room
            </Button>
          </div>

          {showRoomsLoader ? (
            <RoomsLoader />
          ) : (
            <Table.Root className="rooms-table">
              <Table.Body>
                {table.getRowModel().rows.map((row) => (
                  <Table.Row key={row.id} className="rooms-table-row">
                    <Table.Cell>
                      {flexRender(
                        row.getVisibleCells()[0].column.columnDef.cell,
                        row.getVisibleCells()[0].getContext()
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            handlePagination={handlePagination}
          />
        </Card>
      )}
    </>
  );
}

export default Rooms;
