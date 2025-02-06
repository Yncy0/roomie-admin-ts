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

  const handleAccpet = async () => {
    const update = updateBookedRoomsStatus(item.id, "INCOMING");
    if (update) await update;

    // Use the latest value for notifications
    insertNotification(
      item.profiles.id,
      `Your booking reacquest has been ACCEPTED`
    );

    insertBacklogs(
      "UPDATE",
      `The booking request of ${item.profiles?.username} has been ACCEPT`
    );

    alert("The statatus has been ACCEPTED");
  };

  const handleDecline = async () => {
    const update = updateBookedRoomsStatus(item.id, "CANCELLED");
    if (update) await update;

    // Use the latest value for notifications
    insertNotification(
      item.profiles.id,
      `Your booking reacquest has been DECLINED`
    );

    insertBacklogs(
      "UPDATE",
      `The booking request of ${item.profiles?.username} has been DECLINE`
    );

    alert("The statatus has been ACCEPTED");
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
          Would you like to accept this booking reservation?
        </Dialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button color="red" onClick={handleDecline}>
              Decline
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={handleAccpet}>Accept</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default StatusDialog;
