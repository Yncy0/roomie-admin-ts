import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { useSupabaseQueries } from "../../hooks/useUserSchedule";
import supabase from "@/utils/supabase"; // Ensure supabase is properly imported

interface StatusModalProps {
  statusModalOpen: boolean;
  closeStatusModal: () => void;
  selectedEvent: any;
}

const StatusModal: React.FC<StatusModalProps> = ({
  statusModalOpen,
  closeStatusModal,
  selectedEvent,
}) => {
  const [newStatus, setNewStatus] = useState("");
  const { refreshData } = useSupabaseQueries(null); // Access the hook and its `refreshData` method
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (!selectedEvent) return;

    setNewStatus(selectedEvent.status || "");

    // 🔹 Real-time subscription setup using new real-time API
    const table = selectedEvent.schedule_id ? "schedule" : "booked_rooms";
    const channel = supabase
      .channel(`${table}:${selectedEvent.id}`) // Set up a real-time channel for the event
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: table, filter: `id=eq.${selectedEvent.id}` }, (payload) => {
        console.log("Real-time status update received:", payload);

        // 🔹 **Trigger refetch when a status is updated**
        if (table === "schedule") {
          refreshData("schedule"); // Trigger the refetch for schedule
        } else {
          refreshData("booked_rooms"); // Trigger the refetch for booked rooms
        }
      })
      .subscribe();

    // Cleanup the subscription on component unmount
    return () => {
      supabase.removeChannel(channel); // Unsubscribe from the channel
    };
  }, [selectedEvent, refreshData]);

  const handleStatusUpdate = async () => {
    const confirmUpdate = window.confirm("Are you sure you want to update this status?");
    if (!confirmUpdate) return;
  
    let table = "";
    let eventId = "";
    let primaryKey = "";
  
    if (selectedEvent.schedule_id) {
      table = "schedule";
      eventId = selectedEvent.schedule_id;
      primaryKey = "schedule_id";
    } else if (selectedEvent.booking_id) {
      table = "booked_rooms";
      eventId = selectedEvent.booking_id;
      primaryKey = "booking_id";
    } else if (selectedEvent.id) {
      const { data: scheduleEvent } = await supabase
        .from("schedule")
        .select("*")
        .eq("id", selectedEvent.id)
        .single();
  
      if (scheduleEvent) {
        table = "schedule";
        eventId = selectedEvent.id;
        primaryKey = "id";
      } else {
        const { data: bookedRoomEvent } = await supabase
          .from("booked_rooms")
          .select("*")
          .eq("id", selectedEvent.id)
          .single();
  
        if (bookedRoomEvent) {
          table = "booked_rooms";
          eventId = selectedEvent.id;
          primaryKey = "id";
        } else {
          alert("Error: Event not found in either table.");
          return;
        }
      }
    } else {
      alert("Error: Unable to determine event ID.");
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq(primaryKey, eventId)
        .select();
  
      if (error) throw error;
  
      if (data && data.length > 0) {
        alert("Status updated successfully!");
        refreshData(); // Ensure data is refreshed
        closeStatusModal(); // Close modal after update
        window.location.reload(); // Force page reload to reflect changes
      } else {
        alert(`No rows were updated. Please check the event ID: ${eventId}`);
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      alert(`Failed to update status: ${error.message}`);
    }
  };
  
  

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setNewStatus(event.target.value);
  };

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
  );
};

export default StatusModal;
