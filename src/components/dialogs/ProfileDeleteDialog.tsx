import { Button, Dialog } from "@radix-ui/themes";
import "@/styles/dialog.css";

const ProfileDeleteDialog = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button className="delete-button">Delete</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <p>This is Delete</p>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ProfileDeleteDialog;