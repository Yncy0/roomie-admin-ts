import { fetchBacklogs } from "@/hooks/queries/backlogs/useFetchBacklogs";
import { Table } from "@radix-ui/themes";
import { createLazyFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";

export const Route = createLazyFileRoute("/backlogs")({
  component: Backlogs,
});

function Backlogs() {
  const { data } = fetchBacklogs();

  return (
    <div className="min-w-full gap-7 flex flex-col">
      <h1 className="text-center">Booked Rooms List</h1>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Event</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.map((items, index) => (
            <Table.Row key={index}>
              <Table.Cell>{items.action}</Table.Cell>
              <Table.Cell>{items.event}</Table.Cell>
              <Table.Cell>
                {dayjs(items.created_at).format("DD/MM/YYYY")}
              </Table.Cell>
              <Table.Cell>
                {dayjs(items.created_at).format("HH:mm:ss a")}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
