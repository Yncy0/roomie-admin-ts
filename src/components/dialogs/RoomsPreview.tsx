import { fetchRoomsWithId } from "@/hooks/queries/rooms/useFetchRooms";
import { fetchScheduleWithId } from "@/hooks/queries/schedule/useFetchSchedule";
import {
  Dialog,
  Button,
  Flex,
  TextField,
  Text,
  Inset,
  Table,
} from "@radix-ui/themes";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  id: any;
};

export default function RoomsPreview({ id }: Props) {
  const { data } = fetchRoomsWithId(id);
  const { data: sched } = fetchScheduleWithId(id);

  const nav = useNavigate();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>View</Button>
      </Dialog.Trigger>

      <Dialog.Content size="4" maxWidth="1000px">
        <Dialog.Title>Room Information</Dialog.Title>

        <Flex direction="row" gap="6">
          {data?.room_image && (
            <img src={data.room_image} className="w-[500px] h-64" />
          )}
          <Flex direction="column" gap="3" pb="6">
            <Flex direction={"column"}>
              <Dialog.Title>Room Name</Dialog.Title>
              <Text>{data?.room_name}</Text>
            </Flex>
            <Flex direction={"column"}>
              <Dialog.Title>Room Location</Dialog.Title>
              <Text>{data?.location}</Text>
            </Flex>
            <Flex direction={"column"}>
              <Dialog.Title>Seat Capacity</Dialog.Title>
              <Text>{data?.room_capacity}</Text>
            </Flex>
            <Flex direction={"column"}>
              <Dialog.Title>Room Type</Dialog.Title>
              <Text>{data?.room_type}</Text>
            </Flex>
          </Flex>
        </Flex>

        <Dialog.Description>Schedule of Room</Dialog.Description>
        <Inset side="x" my="5">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Subject Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>
                  Course & Section
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Day</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Profile</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Time In</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Time Out</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {sched &&
                sched.map((items, index) => (
                  <Table.Row key={index}>
                    <Table.RowHeaderCell>
                      {items?.subject?.subject_code}
                    </Table.RowHeaderCell>
                    <Table.Cell>{items?.course?.course_name}</Table.Cell>
                    <Table.Cell>{items?.days}</Table.Cell>
                    <Table.Cell>{items?.profiles?.username}</Table.Cell>
                    <Table.Cell>{items?.timef_in}</Table.Cell>
                    <Table.Cell>{items?.timef_out}</Table.Cell>
                    <Table.Cell>{items?.status}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table.Root>
        </Inset>

        <Flex gap="3" mt="4" justify="end" pt="6">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button
              onClick={() => nav({ to: "/room_edit/$id", params: { id: id } })}
            >
              Edit
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
