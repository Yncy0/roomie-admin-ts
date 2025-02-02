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
import RoomsLoader from "@/components/RoomsLoader";
import PaginationControls from "@/components/PaginationControls";
import "@/styles/rooms.css";

export const Route = createLazyFileRoute("/rooms")({
  component: Rooms,
});

function Rooms() {
  const [showLoader, setShowLoader] = React.useState(true);
  const { data = [], isLoading, error } = fetchRooms();
  const roomsPerRow = 3;

  const columns = React.useMemo(
    () => [
      {
        header: "Rooms",
        accessorKey: "rooms",
        cell: ({ row }: any) => (
          <div className="flex gap-4">
            {row.original.rooms.map((item: any) => (
              <RoomsCard
                key={item.id}
                id={item.id}
                room_image={item.room_image}
                location={item.location}
                room_name={item.room_name}
                room_capacity={item.room_capacity}
                room_type={item.room_type}
              />
            ))}
          </div>
        ),
      },
    ],
    []
  );

  const paginatedData = React.useMemo(() => {
    const totalPages = Math.ceil(data.length / roomsPerRow);
    return Array.from({ length: totalPages }, (_, pageIndex) => {
      const start = pageIndex * roomsPerRow;
      return { rooms: data.slice(start, start + roomsPerRow) };
    });
  }, [data, roomsPerRow]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 1 } },
  });

  const handlePagination = (action: string) => {
    setShowLoader(true);
    setTimeout(() => {
      if (action === "first") table.setPageIndex(0);
      else if (action === "prev") table.previousPage();
      else if (action === "next") table.nextPage();
      else if (action === "last") table.setPageIndex(table.getPageCount() - 1);
      setShowLoader(false);
    }, 1000);
  };

  React.useEffect(() => {
    if (!isLoading && data.length > 0) setShowLoader(false);
  }, [isLoading, data]);

  if (error) return <div>Error loading rooms</div>;

  const navigate = useNavigate();

  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  return (
    <Card className="container">
      <div className="header">
        <Heading size="4">Rooms</Heading>
        <Button
          onClick={() => navigate({ to: "/rooms_add" })}
          className="addRoomButton"
        >
          Add Room
        </Button>
      </div>

      {showLoader ? (
        <RoomsLoader />
      ) : (
        <Table.Root>
          <Table.Body>
            {table.getRowModel().rows.map((row) => (
              <Table.Row key={row.id} className="tableRow">
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

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        handlePagination={handlePagination}
      />
    </Card>
  );
}