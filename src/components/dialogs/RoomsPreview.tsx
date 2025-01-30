import { fetchRoomsWithId } from "@/hooks/queries/rooms/useFetchRooms";
import { Dialog, Button, Flex, TextField, Text } from "@radix-ui/themes";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  id: any;
};

export default function RoomsPreview({ id }: Props) {
  const { data } = fetchRoomsWithId(id);

  const nav = useNavigate();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>View </Button>
      </Dialog.Trigger>

      <Dialog.Content size="4" maxWidth="800px">
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

        <Flex gap="3" mt="4" justify="end">
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
