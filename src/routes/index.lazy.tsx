import { createLazyFileRoute } from "@tanstack/react-router";
import ColumnCard from "@/components/ColumnCard";
import DashbaordTable from "@/components/DashboardTable";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col m-2 gap-6">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-8">
          <ColumnCard
            header={"Bookings"}
            stats={287}
            percent={"+3%"}
            description={"more than last week"}
          />
          <ColumnCard
            header={"Rooms"}
            stats={287}
            percent={"+3%"}
            description={"more than last week"}
          />
          <ColumnCard
            header={"Users"}
            stats={287}
            percent={"+3%"}
            description={"more than last week"}
          />
        </div>
      </div>
      <DashbaordTable />
    </div>
  );
}
