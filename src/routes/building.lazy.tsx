import React from "react";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { fetchBuildings } from "@/hooks/queries/buildings/useFetchBuildings"; // Use the updated fetchBuildings
import { Table, Button, Card, Heading } from "@radix-ui/themes";
import BuildingCard from "@/components/BuildingCard"; // Ensure you're importing BuildingCard
import Loader from "@/components/loader/Loader";
import BuildingLoader from "@/components/loader/BuildingLoader";
import PaginationControls from "@/components/PaginationControls";
import "@/styles/building.css";

// Lazy load the page
export const Route = createLazyFileRoute("/building")({
  component: Buildings,
});

function Buildings() {
  const [showLoader, setShowLoader] = React.useState(true);
  const [showBuildingsLoader, setShowBuildingsLoader] = React.useState(false);

  // Using the fetchBuildings hook to fetch building data (now using dummy data)
  const { data = [], isLoading, error } = fetchBuildings();
  const buildingsPerRow = 3;

  const nav = useNavigate();

  const columns = React.useMemo(
    () => [
      {
        header: "Buildings",
        accessorKey: "building",
        cell: ({ row }: any) => (
          <div className="buildings-row">
            {row.original.buildings.map((item: any) => (
              <BuildingCard
                key={item.id}
                id={item.id}
                building_image={item.building_image}
                building_name={item.building_name}
                num_of_floors={item.num_of_floors}
                num_of_rooms={item.num_of_rooms}
              />
            ))}
          </div>
        ),
      },
    ],
    []
  );

  const paginatedData = React.useMemo(() => {
    const totalPages = Math.ceil(data.length / buildingsPerRow);
    return Array.from({ length: totalPages }, (_, pageIndex) => {
      const start = pageIndex * buildingsPerRow;
      return { buildings: data.slice(start, start + buildingsPerRow) };
    });
  }, [data, buildingsPerRow]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 1 } },
  });

  const handlePagination = (action: string) => {
    setShowBuildingsLoader(true);
    setTimeout(() => {
      if (action === "first") table.setPageIndex(0);
      else if (action === "prev") table.previousPage();
      else if (action === "next") table.nextPage();
      else if (action === "last") table.setPageIndex(table.getPageCount() - 1);
      setShowBuildingsLoader(false);
    }, 1000);
  };

  React.useEffect(() => {
    if (!isLoading && data.length > 0) setShowLoader(false);
  }, [isLoading, data]);

  if (error)
    return <div className="buildings-error">Error loading buildings</div>;

  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  return (
    <Card className="buildings-container">
      {showLoader ? (
        <Loader />
      ) : (
        <>
          <div className="buildings-header">
            <Heading size="4">Buildings</Heading>
            <Button
              onClick={() => nav({ to: "/building_add" })}
              className="buildings-add-button"
            >
              Add Building
            </Button>
          </div>

          {showBuildingsLoader ? (
            <BuildingLoader />
          ) : (
            <Table.Root className="buildings-table">
              <Table.Body>
                {table.getRowModel().rows.map((row) => (
                  <Table.Row key={row.id} className="buildings-table-row">
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
        </>
      )}
    </Card>
  );
}

export default Buildings;
