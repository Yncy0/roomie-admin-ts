import { insertBacklogs } from "@/hooks/queries/backlogs/useInsertBacklogs";
import { updateProfiles } from "@/hooks/queries/profiles/useUpdateProfiles";
import { Button, Dialog, Flex, TextField, Text } from "@radix-ui/themes";
import React from "react";
import "@/styles/dialog.css";

type Props = {
  items: any;
};

const ProfileEditDialog = ({ items }: Props) => {
  const [username, setUsername] = React.useState(items.username);
  const [mobileNumber, setMobileNumber] = React.useState(items.mobile_number);
  const [email, setEmail] = React.useState(items.email);
  const [userRole, setUserRole] = React.useState(items.user_role);
  const [userDepartment, setUserDepartment] = React.useState(
    items.user_department
  );

  const handleUpdate = async () => {
    try {
      const data = await updateProfiles(
        items.id,
        username,
        mobileNumber,
        email,
        userRole,
        userDepartment
      );

      await insertBacklogs(
        "UPDATE",
        `The profile of ${username} has been changed`
      );
      console.log("Profile updated:", data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button className="edit-button">Edit</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Edit Profile</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Make changes to this profile. {items.id}
        </Dialog.Description>
        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root
              defaultValue={items.username}
              placeholder="Enter full name"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Mobile Number
            </Text>
            <TextField.Root
              defaultValue={items.mobile_number}
              placeholder="Enter mobile number"
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Email
            </Text>
            <TextField.Root
              defaultValue={items.email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              User Role
            </Text>
            <TextField.Root
              defaultValue={items.user_role}
              placeholder="Enter role"
              onChange={(e) => setUserRole(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              User Department
            </Text>
            <TextField.Root
              defaultValue={items.user_department}
              placeholder="Enter department"
              onChange={(e) => setUserDepartment(e.target.value)}
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={handleUpdate}>Save</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ProfileEditDialog;