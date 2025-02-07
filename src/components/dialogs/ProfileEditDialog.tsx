import { insertBacklogs } from "@/hooks/queries/backlogs/useInsertBacklogs";
import { updateProfiles } from "@/hooks/queries/profiles/useUpdateProfiles";
import { Button, Dialog, Flex, TextField, Text } from "@radix-ui/themes";
import { useState } from "react";
import Alert from "@/components/Alert";
import "@/styles/dialog.css";

type Props = {
  items: any;
};

const ProfileEditDialog = ({ items }: Props) => {
  const [username, setUsername] = useState(items.username);
  const [mobileNumber, setMobileNumber] = useState(items.mobile_number);
  const [email, setEmail] = useState(items.email);
  const [userRole, setUserRole] = useState(items.user_role);
  const [userDepartment, setUserDepartment] = useState(items.user_department);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(false);

  const roles = ["Admin", "Faculty", "Professor"];
  const departments = ["CITE", "CITHM", "CASE", "CAMP", "CBEA", "COM"];

  const handleUpdate = async () => {
    try {
      const data = await updateProfiles(items.id, username, mobileNumber, email, userRole, userDepartment);

      if (data) {
        await insertBacklogs("UPDATE", `The profile of ${username} has been changed`);
        setAlertMessage("Profile updated successfully!");
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
          setOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button className="edit-button" onClick={() => setOpen(true)}>Edit</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Edit Profile</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Make changes to this profile.
        </Dialog.Description>

        {showAlert && <Alert type="success" message={alertMessage} />}

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">Name</Text>
            <TextField.Root
              defaultValue={items.username}
              placeholder="Enter full name"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">Mobile Number</Text>
            <TextField.Root
              defaultValue={items.mobile_number}
              placeholder="Enter mobile number"
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">Email</Text>
            <TextField.Root
              defaultValue={items.email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          
          {/* Role and Department in One Row */}
          <Flex gap="3">
            <label style={{ flex: 1 }}>
              <Text as="div" size="2" mb="1" weight="bold">User Role</Text>
              <select value={userRole} onChange={(e) => setUserRole(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </label>

            <label style={{ flex: 1 }}>
              <Text as="div" size="2" mb="1" weight="bold">User Department</Text>
              <select value={userDepartment} onChange={(e) => setUserDepartment(e.target.value)} style={{ width: "100%", padding: "8px" }}>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </label>
          </Flex>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" onClick={() => setOpen(false)}>Cancel</Button>
          </Dialog.Close>
          <Button onClick={handleUpdate}>Save</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ProfileEditDialog;
