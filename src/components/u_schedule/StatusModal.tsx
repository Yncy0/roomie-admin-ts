import type React from "react"
import { useState, useEffect } from "react"
import { Modal, Box } from "@mui/material"

interface StatusModalProps {
  statusModalOpen: boolean
  closeStatusModal: () => void
  selectedEvent: any
  FormData: () => void
}

const StatusModal: React.FC<StatusModalProps> = ({ statusModalOpen, closeStatusModal, selectedEvent, FormData }) => {
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    if (selectedEvent) {
      console.log("Selected Event:", selectedEvent)
      setNewStatus(selectedEvent.status || "")
    }
  }, [selectedEvent])

  const handleStatusUpdate = async () => {
    // ... (keep the existing handleStatusUpdate logic)
  }

  return (
    <Modal open={statusModalOpen} onClose={closeStatusModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 1,
        }}
      >
        {/* ... (keep the existing JSX structure) */}
      </Box>
    </Modal>
  )
}

export default StatusModal

