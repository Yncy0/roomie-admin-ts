import {
  Button,
  Dialog,
  Flex,
  TextField,
  Text,
  Select,
} from "@radix-ui/themes";
import { Pencil } from "lucide-react";

type Props = {
  status: string;
};

const StatusDialog = ({ status }: Props) => {
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
        <Select.Root defaultValue={status}>
          <Select.Trigger />
          <Select.Content>
            <Select.Group>
              <Select.Label>Status</Select.Label>
              <Select.Item value="ON GOING">ON GOING</Select.Item>
              <Select.Item value="PENDING RESERVE">PENDING RESERVE</Select.Item>
              <Select.Item value="CANCEL RESERVE">CANCEL RESERVE</Select.Item>
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
            <Button>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default StatusDialog;
