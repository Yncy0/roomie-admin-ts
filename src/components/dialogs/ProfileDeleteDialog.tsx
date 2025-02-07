"use client"

import { useState } from "react"
import { Button, Dialog, Flex } from "@radix-ui/themes"
import { useDeleteProfiles } from "@/hooks/queries/profiles/useDeleteProfiles"
import Alert from "@/components/Alert" // Adjust the import path if needed
import "@/styles/dialog.css"

interface ProfileDeleteDialogProps {
  profileId: string
  onDeleteSuccess?: () => void
}

const ProfileDeleteDialog: React.FC<ProfileDeleteDialogProps> = ({ profileId, onDeleteSuccess }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const deleteProfile = useDeleteProfiles()

  const handleDelete = async () => {
    try {
      await deleteProfile.mutateAsync(profileId)
      setAlert({ message: "Profile deleted successfully.", type: "success" })
      setIsOpen(false)

      // Trigger re-fetch if onDeleteSuccess exists
      if (onDeleteSuccess) {
        onDeleteSuccess()
      }

      // Refresh the page to reflect changes
      setTimeout(() => {
        window.location.reload()
      }, 1000) // Delay to ensure alert is visible
    } catch (error) {
      console.error("Error deleting profile:", error)
      setAlert({ message: "Failed to delete profile.", type: "error" })
    }
  }

  return (
    <>
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger>
          <Button color="red" variant="soft">
            Delete
          </Button>
        </Dialog.Trigger>

        <Dialog.Content>
          <Dialog.Title>Confirm Deletion</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to delete this profile? This action will archive the profile and cannot be undone.
          </Dialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button color="red" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}

export default ProfileDeleteDialog
