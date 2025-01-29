import { Button, Dialog } from "@radix-ui/themes";

const ProfileDeleteDialog = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Delete</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <p>This is Delete</p>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ProfileDeleteDialog;
