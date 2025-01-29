import { Button, Dialog } from "@radix-ui/themes";

const ProfileEditDialog = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Edit</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <p>This is Edit</p>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ProfileEditDialog;
