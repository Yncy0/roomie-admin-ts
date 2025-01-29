import React from "react";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft as ChevronsLeftIcon,
} from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fetchRooms } from "@/hooks/queries/rooms/useFetchRooms";
import { Table } from "@radix-ui/themes";
import RoomsCard from "@/components/RoomsCard";
import RoomsLoader from "@/components/RoomsLoader";

export const Route = createLazyFileRoute("/rooms")({
  component: Rooms,
});

function Rooms() {
  const [open, setOpen] = React.useState(false);
  const [showLoader, setShowLoader] = React.useState(true); // Initially show loader when page loads
  const { data = [], isLoading, error } = fetchRooms();

  const roomsPerRow = 3; // Show 3 rooms per row

  // Create columns dynamically based on your data shape
  const columns = React.useMemo(
    () => [
      {
        header: "Rooms",
        accessorKey: "rooms", // This will serve as the key for your data row
        cell: ({ row }: any) => (
          <div className="flex flex-row justify-between gap-4">
            {row.original.rooms.map((item: any) => (
              <RoomsCard
                key={item.id}
                id={item.id}
                room_image={item.room_image}
                room_location={item.building?.building_name}
                room_name={item.room_name}
                room_capacity={item.room_capacity}
                room_type={item.room_type}
                building_id={item.building?.building_id}
              />
            ))}
          </div>
        ),
      },
    ],
    []
  );

  // Paginate data - group rooms into sets of 3 per row
  const paginatedData = React.useMemo(() => {
    const totalPages = Math.ceil(data.length / roomsPerRow);
    return Array.from({ length: totalPages }, (_, pageIndex) => {
      const start = pageIndex * roomsPerRow;
      const roomsForRow = data.slice(start, start + roomsPerRow);
      return {
        rooms: roomsForRow,
      };
    });
  }, [data, roomsPerRow]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 1, // Display only one row per page
      },
    },
  });

  // Simulate loading for pagination (1 second delay)
  const handlePagination = (action: any) => {
    setShowLoader(true); // Show loader on pagination action
    setTimeout(() => {
      if (action === "first") table.setPageIndex(0);
      else if (action === "prev") table.previousPage();
      else if (action === "next") table.nextPage();
      else if (action === "last") table.setPageIndex(table.getPageCount() - 1);

      setShowLoader(false); // Hide loader after a delay
    }, 1000); // Simulate 1 second delay for loading
  };

  React.useEffect(() => {
    // Set showLoader to false once the data is loaded after initial fetch
    if (!isLoading && data.length > 0) {
      setShowLoader(false);
    }
  }, [isLoading, data]);

  if (error) {
    return <div>Error loading rooms</div>;
  }

  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col px-8 py-8 round-box gap-2 mx-auto my-5 w-[95%]"
      style={{
        backgroundColor: "transparent",
        backdropFilter: "blur(20px) saturate(120%) contrast(120%)",
        WebkitBackdropFilter: "blur(20px) saturate(120%) contrast(120%)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        borderRadius: "15px",
      }}
    >
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-bold text-lg text-[#35487a]">Rooms</h1>
        {/*Add Room Button*/}
        <button
          className="flex items-center justify-center text-[#35487a] bg-transparent border-2 border-solid 
          border-[#35487a] rounded-lg py-2 px-8 text-sm font-medium cursor-pointer transition-colors duration-300 
          hover:bg-[#35487a] hover:text-white mt-4"
          onClick={() => navigate({ to: "/rooms_add" })}
        >
          Add Room
        </button>
        {/* 
         {open && <Navigate to="/rooms_add" />} */}
      </div>

      {/* Loading State - 3 columns skeleton loader */}
      {showLoader ? (
        <RoomsLoader />
      ) : (
        <Table.Root>
          <Table.Body>
            {table.getRowModel().rows.map((row) => (
              <Table.Row
                key={row.id}
                className="bg-transparent focus:ring-0 focus:outline-none hover:bg-transparent"
              >
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
      <div className="flex flex-row justify-end items-center py-4 px-14 gap-2">
        <button
          onClick={() => handlePagination("first")}
          disabled={!table.getCanPreviousPage()}
          className={`p-2 rounded ${!table.getCanPreviousPage() ? "text-gray-400" : " text-[#35487a]"}`}
        >
          <ChevronsLeftIcon />
        </button>

        <button
          onClick={() => handlePagination("prev")}
          disabled={!table.getCanPreviousPage()}
          className={`p-2 rounded ${!table.getCanPreviousPage() ? "text-gray-400" : " text-[#35487a]"}`}
        >
          <ChevronLeft />
        </button>

        <span className="font-bold font-roboto px-4 text-[#35487a]">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>

        <button
          onClick={() => handlePagination("next")}
          disabled={!table.getCanNextPage()}
          className={`p-2 rounded ${!table.getCanNextPage() ? "text-gray-400" : " text-[#35487a]"}`}
        >
          <ChevronRight />
        </button>

        <button
          onClick={() => handlePagination("last")}
          disabled={!table.getCanNextPage()}
          className={`p-2 rounded ${!table.getCanNextPage() ? "text-gray-400" : " text-[#35487a]"}`}
        >
          <ChevronsRight />
        </button>
      </div>
    </div>
  );
}
