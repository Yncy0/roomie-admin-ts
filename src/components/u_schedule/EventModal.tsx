import type React from "react"
import { useEffect, useState } from "react"
import { Modal, Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button } from "@mui/material"
import supabase from "@/utils/supabase"

interface Room {
  id: string
  room_name: string
}

interface Subject {
  subject_code: string
}

interface EventData {
  booking_id?: string
  schedule_id?: string
  room_id?: string
  subject_code?: string
  course_name?: string
  status?: string
  date?: string
  time_in?: string
  time_out?: string
  days?: string
}

interface EventModalProps {
  modalOpen: boolean
  closeModal: (clearForm?: boolean) => void
  modalType: "booking" | "schedule"
  formData: EventData
  setFormData: React.Dispatch<React.SetStateAction<EventData>>
  selectedEvent: EventData | null
  rooms: Room[]
  handleFormChange: (e: React.ChangeEvent<{ name?: string; value: unknown }>) => void
  handleFormSubmit: () => void
}

const EventModal: React.FC<EventModalProps> = ({
  modalOpen,
  closeModal,
  modalType,
  formData,
  setFormData,
  selectedEvent,
  rooms,
  handleFormChange,
  handleFormSubmit,
}) => {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [courses, setCourses] = useState<string[]>([])

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data, error } = await supabase.from("subject").select("subject_code")
      if (!error) {
        setSubjects(data || [])
      } else {
        console.error("Error fetching subjects:", error)
      }
    }

    const fetchCourses = async () => {
      const { data, error } = await supabase.from("course").select("course_name")
      if (!error) {
        setCourses([...new Set(data?.map((c) => c.course_name) || [])])
      } else {
        console.error("Error fetching courses:", error)
      }
    }

    if (modalOpen) {
      fetchSubjects()
      fetchCourses()
    }
  }, [modalOpen])

  useEffect(() => {
    if (!modalOpen) {
      setFormData({})
    }
  }, [modalOpen, setFormData])

  return (
    <Modal open={modalOpen} onClose={() => closeModal(true)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          {selectedEvent
            ? `Edit ${modalType === "booking" ? "Booking" : "Schedule"}`
            : `Add ${modalType === "booking" ? "Booking" : "Schedule"}`}
        </Typography>

        {/* Display Booking ID / Schedule ID when Editing */}
        {selectedEvent?.booking_id && modalType === "booking" && (
          <TextField label="Booking ID" value={selectedEvent.booking_id} fullWidth disabled sx={{ marginBottom: 2 }} />
        )}
        {selectedEvent?.schedule_id && modalType === "schedule" && (
          <TextField
            label="Schedule ID"
            value={selectedEvent.schedule_id}
            fullWidth
            disabled
            sx={{ marginBottom: 2 }}
          />
        )}

        {/* Room Selection */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="room-select-label">Room</InputLabel>
          <Select labelId="room-select-label" name="room_id" value={formData.room_id || ""} onChange={handleFormChange}>
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {room.room_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Subject Selection */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Subject Code</InputLabel>
          <Select name="subject_code" value={formData.subject_code || ""} onChange={handleFormChange}>
            {subjects.map((subject) => (
              <MenuItem key={subject.subject_code} value={subject.subject_code}>
                {subject.subject_code}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Course Selection */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Section</InputLabel>
          <Select name="course_name" value={formData.course_name || ""} onChange={handleFormChange}>
            {courses.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Date Input for Booking */}
        {modalType === "booking" ? (
          <TextField
            label="Date"
            name="date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.date || ""}
            onChange={handleFormChange}
            sx={{ marginBottom: 2 }}
          />
        ) : (
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Days</InputLabel>
            <Select name="days" value={formData.days || ""} onChange={handleFormChange}>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Time Inputs */}
        <TextField
          label="Time In"
          name="time_in"
          type="time"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formData.time_in || ""}
          onChange={handleFormChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Time Out"
          name="time_out"
          type="time"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formData.time_out || ""}
          onChange={handleFormChange}
          sx={{ marginBottom: 2 }}
        />

        <Button variant="contained" color="primary" fullWidth onClick={handleFormSubmit}>
          Submit
        </Button>
      </Box>
    </Modal>
  )
}

export default EventModal

