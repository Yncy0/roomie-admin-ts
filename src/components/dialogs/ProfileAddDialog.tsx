import { Dialog, Button, Flex, TextField, Text } from "@radix-ui/themes";
import React from "react";

const ProfileAddDialog = () => {
  const [username, setUsername] = React.useState("");
  const [mobileNumber, setMobileNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [userRole, setUserRole] = React.useState("");
  const [userDepartment, setUserDepartment] = React.useState("");

  <Dialog.Root>
    <Dialog.Trigger>
      <Button>Edit</Button>
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Title>Edit Profile</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        Add users
      </Dialog.Description>
      <Flex direction="column" gap="3">
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Name
          </Text>
          <TextField.Root
            defaultValue={""}
            placeholder="Enter full name"
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Mobile Number
          </Text>
          <TextField.Root
            defaultValue={""}
            placeholder="Enter mobile number"
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Email
          </Text>
          <TextField.Root
            defaultValue={""}
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            User Role
          </Text>
          <TextField.Root
            defaultValue={""}
            placeholder="Enter role"
            onChange={(e) => setUserRole(e.target.value)}
          />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            User Department
          </Text>
          <TextField.Root
            defaultValue={""}
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
        <Button onClick={() => {}}>Save</Button>
      </Flex>
    </Dialog.Content>
  </Dialog.Root>;
};

export default ProfileAddDialog;
