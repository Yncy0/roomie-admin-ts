import { insertBacklogs } from "@/hooks/queries/backlogs/useInsertBacklogs";
import { updateProfiles } from "@/hooks/queries/profiles/useUpdateProfiles";
import { Button, Dialog } from "@radix-ui/themes";
import { useState } from "react";
import Alert from "@/components/Alert";
import "@/styles/dialog.css"; // Import the dialog-specific styles
import "@/styles/Users/ProfileEditDialog.css"; // Import the new CSS file for profile editing

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
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [open, setOpen] = useState(false);

  const roles = ["Admin", "Faculty", "Professor"];
  const departments = ["CITE", "CITHM", "CASE", "CAMP", "CBEA", "COM"];

  const handleUpdate = async () => {
    if (!username || !mobileNumber || !email || !userRole || !userDepartment) {
      setAlertMessage("Please fill all the fields.");
      setAlertType("error");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      const data = await updateProfiles(items.id, username, mobileNumber, email, userRole, userDepartment);

      if (data) {
        await insertBacklogs("UPDATE", `The profile of ${username} has been changed`);
        setAlertMessage("Profile updated successfully!");
        setAlertType("success");
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
          setOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlertMessage("Error updating profile. Please try again later.");
      setAlertType("error");
      setShowAlert(true);

      setTimeout(() => setShowAlert(false), 3000);
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

        {showAlert && <Alert type={alertType} message={alertMessage} />}

        <div className="input-container">
          {/* Username */}
          <div className="input">
            <label htmlFor="username">Name:</label>
            <input
              id="username"
              type="text"
              placeholder="Enter full name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Mobile Number */}
          <div className="input">
            <label htmlFor="mobileNumber">Mobile Number:</label>
            <input
              id="mobileNumber"
              type="text"
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="input">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Role and Department in Column Layout */}
          <div className="input">
            <label htmlFor="userRole">User Role:</label>
            <select
              id="userRole"
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
            >
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="input">
            <label htmlFor="userDepartment">User Department:</label>
            <select
              id="userDepartment"
              value={userDepartment}
              onChange={(e) => setUserDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-buttons">
          <Dialog.Close>
            <Button variant="soft" color="gray" className="cancel-button" onClick={() => setOpen(false)}>Cancel</Button>
          </Dialog.Close>
          <Button onClick={handleUpdate}>Save</Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ProfileEditDialog;
