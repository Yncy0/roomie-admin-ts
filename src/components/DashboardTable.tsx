import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFilter } from "@fortawesome/free-solid-svg-icons";
import { LucideFilter } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";

interface RoomData {
  picture: string;
  name: string;
  booked: number;
  canceled: number;
}

export default function DashboardTable() {
  const [data, setData] = React.useState<RoomData[]>([
    {
      picture: "",
      name: "",
      booked: 0,
      canceled: 0,
    },
  ]);

  React.useEffect(() => {
    //DUMMY Data
    setData([
      {
        picture: "src/assets/dummy/image - product.png",
        name: "St. Agustine(SA) 402",
        booked: 0,
        canceled: 0,
      },
      {
        picture: "src/assets/dummy/image - product.png",
        name: "St. Agustine(SA) 402",
        booked: 0,
        canceled: 0,
      },
      {
        picture: "src/assets/dummy/image - product.png",
        name: "St. Agustine(SA) 402",
        booked: 0,
        canceled: 0,
      },
      {
        picture: "src/assets/dummy/image - product.png",
        name: "St. Agustine(SA) 402",
        booked: 0,
        canceled: 0,
      },
      {
        picture: "src/assets/dummy/image - product.png",
        name: "St. Agustine(SA) 402",
        booked: 0,
        canceled: 0,
      },
    ]);
  }, []);

  const columns = React.useMemo(
    () => [
      {
        header: "Rooms",
        cell: ({ row }: { row: any }) => (
          <div className="flex flex-row items-center gap-4">
            <img src={row.original.picture} alt="" />
            <p>{row.original.name}</p>
          </div>
        ),
      },
      {
        header: "Times Booked",
        accessorKey: "booked",
      },
      {
        header: "Cancelled",
        accessorKey: "canceled",
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col p-6 bg-white shadow-xl rounded-md gap-8 font-roboto item">
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-bold">Top Booked Rooms</h1>
        <div className="flex flex-row gap-4 items-center">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="text"
            placeholder="Search..."
            className="input-search min-w-40 bg-[#F5F7FA]"
          />
          <button className="flex flex-row items-center gap-2 p-1 border-solid border-[#E6E6E6] border-2 rounded-lg">
            <LucideFilter width={"16px"} />
            Filter
          </button>
        </div>
      </div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-left">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-row justify-end items-center py-4 px-14">
        <button onClick={() => table.setPageIndex(0)}>
          <ChevronsLeft />
        </button>
        <button onClick={() => table.previousPage()}>
          <ChevronLeft />
        </button>
        <span className="font-bold font-roboto">
          {table.getState().pagination.pageIndex + 1}
        </span>
        <button onClick={() => table.nextPage()}>
          <ChevronRight />
        </button>
        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
          <ChevronsRight />
        </button>
      </div>
    </div>
  );
}
