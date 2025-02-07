import { Dialog, Button, Flex, TextField, Text } from "@radix-ui/themes";
import React from "react";
import Alert from "@/components/Alert"; // Import the Alert component

const ProfileAddDialog = () => {
  const [username, setUsername] = React.useState("");
  const [mobileNumber, setMobileNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [userRole, setUserRole] = React.useState("");
  const [userDepartment, setUserDepartment] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false);

  const handleSave = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Edit</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Edit Profile</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Add users
        </Dialog.Description>
        {showAlert && <Alert type="success" message="Profile updated successfully!" />}
        
        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root
              value={username}
              placeholder="Enter full name"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Mobile Number
            </Text>
            <TextField.Root
              value={mobileNumber}
              placeholder="Enter mobile number"
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Email
            </Text>
            <TextField.Root
              value={email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              User Role
            </Text>
            <TextField.Root
              value={userRole}
              placeholder="Enter role"
              onChange={(e) => setUserRole(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              User Department
            </Text>
            <TextField.Root
              value={userDepartment}
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
          <Button onClick={handleSave}>Save</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ProfileAddDialog;
