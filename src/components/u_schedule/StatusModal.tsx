import React, { useState, useEffect } from "react"
import { Modal, Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material"
import { SelectChangeEvent } from "@mui/material"
import { useSupabaseQueries } from "../../hooks/useUserSchedule"
import supabase from "@/utils/supabase"  // Ensure supabase is properly imported

interface StatusModalProps {
  statusModalOpen: boolean
  closeStatusModal: () => void
  selectedEvent: any
}

const StatusModal: React.FC<StatusModalProps> = ({
  statusModalOpen,
  closeStatusModal,
  selectedEvent,
}) => {
  const [newStatus, setNewStatus] = useState("")
  const { refreshData } = useSupabaseQueries(null)  // Access the hook and its `refreshData` method
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    if (selectedEvent) {
      setNewStatus(selectedEvent.status || "")
    }

    // Real-time subscription setup
    const setupSubscription = async () => {
      let table = ""
      if (selectedEvent.schedule_id) {
        table = "schedule"
      } else if (selectedEvent.booking_id) {
        table = "booked_rooms"
      } else if (selectedEvent.id) {
        const { data: scheduleEvent } = await supabase
          .from("schedule")
          .select("*")
          .eq("id", selectedEvent.id)
          .single()

        if (scheduleEvent) {
          table = "schedule"
        } else {
          const { data: bookedRoomEvent } = await supabase
            .from("booked_rooms")
            .select("*")
            .eq("id", selectedEvent.id)
            .single()

          if (bookedRoomEvent) {
            table = "booked_rooms"
          }
        }
      }

      if (table) {
        const newSubscription = supabase
          .from(`${table}:id=eq.${selectedEvent.id}`)
          .on("UPDATE", (payload) => {
            console.log("Real-time status update received:", payload)
            refreshData()  // Trigger refreshData to fetch latest data
          })
          .subscribe()

        setSubscription(newSubscription)
      }
    }

    setupSubscription()

    // Cleanup the subscription when the component is unmounted
    return () => {
      if (subscription) {
        supabase.removeSubscription(subscription)
      }
    }
  }, [selectedEvent, refreshData, subscription])

  const handleStatusUpdate = async () => {
    const confirmUpdate = window.confirm("Are you sure you want to update this status?")
    if (!confirmUpdate) return

    let table = ""
    let eventId = ""
    let primaryKey = ""

    if (selectedEvent.schedule_id) {
      table = "schedule"
      eventId = selectedEvent.schedule_id
      primaryKey = "schedule_id"
    } else if (selectedEvent.booking_id) {
      table = "booked_rooms"
      eventId = selectedEvent.booking_id
      primaryKey = "booking_id"
    } else if (selectedEvent.id) {
      const { data: scheduleEvent } = await supabase
        .from("schedule")
        .select("*")
        .eq("id", selectedEvent.id)
        .single()

      if (scheduleEvent) {
        table = "schedule"
        eventId = selectedEvent.id
        primaryKey = "id"
      } else {
        const { data: bookedRoomEvent } = await supabase
          .from("booked_rooms")
          .select("*")
          .eq("id", selectedEvent.id)
          .single()

        if (bookedRoomEvent) {
          table = "booked_rooms"
          eventId = selectedEvent.id
          primaryKey = "id"
        } else {
          console.error("Error: No matching event found with ID:", selectedEvent.id)
          alert("Error: Event not found in either table.")
          return
        }
      }
    } else {
      console.error("Error: Event ID is not defined.")
      alert("Error: Unable to determine event ID.")
      return
    }

    console.log("Updating status for:", { table, eventId, newStatus, selectedEvent })

    try {
      const { data, error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq(primaryKey, eventId)
        .select()

      if (error) {
        throw error
      }

      console.log("Update result:", data)

      if (data && data.length > 0) {
        alert("Status updated successfully!")
        refreshData()  // Refresh the data
        closeStatusModal()
      } else {
        alert(`No rows were updated. Please check the event ID: ${eventId}`)
      }
    } catch (error: any) {
      console.error("Error updating status:", error)
      alert(`Failed to update status: ${error.message}`)
    }
  }

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setNewStatus(event.target.value)
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
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Update Status
        </Typography>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select value={newStatus} onChange={handleStatusChange}>
            {["PENDING", "INCOMING", "ONGOING", "DONE", "CANCELLED"].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" fullWidth onClick={handleStatusUpdate}>
          Update Status
        </Button>
      </Box>
    </Modal>
  )
}

export default StatusModal
