import { insertBacklogs } from "@/hooks/queries/backlogs/useInsertBacklogs";
import { deleteBookedRoomsCancel } from "@/hooks/queries/booking/useDeleteBookedRooms";
import { updateBookedRoomsStatus } from "@/hooks/queries/booking/useUpdateBookedRooms";
import { insertNotification } from "@/hooks/queries/useNotifications";
import { Button, Dialog, Flex, Select } from "@radix-ui/themes";
import { Pencil } from "lucide-react";
import React from "react";

type Props = {
  item: any;
};

const StatusDialog = ({ item }: Props) => {
  const [value, setValue] = React.useState(item.status);
  const latestValueRef = React.useRef(value);

  React.useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  console.log(value);

  const onHandleClick = async () => {
    // Use the latest value from the ref
    const latestValue = latestValueRef.current;
    console.log("Latest value:", latestValue); // Debugging: Check the latest value

    // Call the update function with the latest value
    const update = updateBookedRoomsStatus(item.id, latestValue);
    if (update) await update;

    // Use the latest value for notifications
    insertNotification(
      item.profiles.id,
      `Your booking status is set to ${latestValue}`
    );

    insertBacklogs(
      "UPDATE",
      `The booking request of ${item.profiles?.username} has granted status ${latestValue}`
    );

    await deleteBookedRoomsCancel();
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>
          <Pencil />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Grant Status</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Select the type of approval in this booked room
        </Dialog.Description>
        <Select.Root onValueChange={setValue} defaultValue={value}>
          <Select.Trigger />
          <Select.Content>
            <Select.Group>
              <Select.Label>Status</Select.Label>
              <Select.Item value="ON GOING">ON GOING</Select.Item>
              <Select.Item value="PENDING RESERVE">PENDING RESERVE</Select.Item>
              <Select.Item value="CANCEL REQUEST">CANCEL REQUEST</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={onHandleClick}>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default StatusDialog;
