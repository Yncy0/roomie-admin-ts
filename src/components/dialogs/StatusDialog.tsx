"use client"

import { insertBacklogs } from "@/hooks/queries/backlogs/useInsertBacklogs"
import { updateBookedRoomsStatus } from "@/hooks/queries/booking/useUpdateBookedRooms"
import { insertNotification } from "@/hooks/queries/useNotifications"
import { Button, Dialog, Flex } from "@radix-ui/themes"
import { Pencil } from "lucide-react"
import React from "react"
import Alert from "@/components/alert"

type Props = {
  item: any
}

const StatusDialog = ({ item }: Props) => {
  const [value, setValue] = React.useState(item.status)
  const latestValueRef = React.useRef(value)

  React.useEffect(() => {
    latestValueRef.current = value
  }, [value])

  const [alertMessage, setAlertMessage] = React.useState<string | null>(null)
  const [alertType, setAlertType] = React.useState<"success" | "error" | "info" | "warning">("info")

  const handleAccept = async () => {
    const update = updateBookedRoomsStatus(item.id, "INCOMING")
    if (update) await update

    insertNotification(item.profiles.id, `Booking request has been ACCEPTED`)

    insertBacklogs("UPDATE", `The booking request of ${item.profiles?.username} has been ACCEPTED`)

    setAlertType("success")
    setAlertMessage("Booking has been ACCEPTED")
  }

  const handleDecline = async () => {
    const update = updateBookedRoomsStatus(item.id, "CANCELLED")
    if (update) await update

    insertNotification(item.profiles.id, `Booking request has been DECLINED`)

    insertBacklogs("UPDATE", `The booking request of ${item.profiles?.username} has been DECLINED`)

    setAlertType("error")
    setAlertMessage("The status has been DECLINED")
  }

  return (
    <>
      {alertMessage && (
        <Alert type={alertType} message={alertMessage} duration={3000} onClose={() => setAlertMessage(null)} />
      )}
      <Dialog.Root>
        <Dialog.Trigger>
          <Button>
            <Pencil />
          </Button>
        </Dialog.Trigger>
        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Grant Status</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Would you like to accept this booking reservation?
          </Dialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button color="red" onClick={handleDecline}>
                Decline
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button onClick={handleAccept}>Accept</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}

export default StatusDialog

