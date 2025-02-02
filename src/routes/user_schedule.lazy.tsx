import { createLazyFileRoute } from "@tanstack/react-router"
import type React from "react"
import { useState, useCallback } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  ListItemText,
  List,
  ListItem,
} from "@mui/material"

import supabase from "@/utils/supabase"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import isBetween from "dayjs/plugin/isBetween"
import isoWeek from "dayjs/plugin/isoWeek"
import EventModal from "../components/u_schedule/EventModal"
import StatusModal from "../components/u_schedule/StatusModal"
import PrintablePage from "../components/u_schedule/PrintablePage"
import { useSupabaseQueries } from "../hooks/useUserSchedule"

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)
dayjs.extend(isoWeek)

interface UserInfo {
  user_id: string
  username: string
  full_name: string
  avatar_url: string
  website: string
  mobile_number: string
  user_email: string
  user_role: string
  user_department: string
}

interface BookingData {
  id: string
  room_name: string
  subject: string
  course_section: string
  date: string
  book_timeIn: string
  book_timeOut: string
  status: string
  user_name: string
}

interface ScheduleData {
  id: string
  room_name: string
  subject_code: string
  course_name: string
  days: string
  time_in: string
  time_out: string
  status: string
  user_name: string
}

export const Route = createLazyFileRoute("/user_schedule")({
  component: RouteComponent,
})

function RouteComponent() {
  return <UserSchedulePage />
}


const UserSchedulePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalType, setModalType] = useState<"booking" | "schedule">("booking")
  const [formData, setFormData] = useState<any>({})
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [statusModalOpen, setStatusModalOpen] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const {
    isLoading,
    bookingData,
    scheduleData,
    rooms,
    users,
    userInfo,
    addSchedule,
    updateSchedule,
    addBooking,
    updateBooking,
    refreshData,
  } = useSupabaseQueries(selectedUser)

  // Function to open modal for booking or schedule
  const openModal = useCallback((type: "booking" | "schedule", event?: BookingData | ScheduleData) => {
    setModalType(type)
    setSelectedEvent(event || null)
    if (event) {
      setFormData({
        ...event,
        ...(type === "schedule" ? { id: event.id } : { id: event.id }),
      })
    } else {
      setFormData({})
    }
    setModalOpen(true)
  }, [])

  const closeModal = () => {
    setModalOpen(false)
    setSelectedEvent(null)
    setFormData({})
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name as string]: value }))
  }

  const handleFormSubmit = async () => {
    try {
      if (!formData.course_name) {
        console.error("Course name is required.")
        return
      }

      let courseId = null

      if (modalType === "schedule") {
        const { data: courseData, error: courseError } = await supabase
          .from("course")
          .select("id")
          .eq("course_name", formData.course_name)
          .single()

        if (courseError) {
          console.warn("Could not find course_id, proceeding without it.")
        } else {
          courseId = courseData?.id
        }
      }

      // Fetch the profile_id from the profiles table based on the selected user's username
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", selectedUser)
        .single()

      if (profileError || !profileData) {
        console.error("Invalid profile_id: No matching record found in profiles.")
        return
      }

      const profileId = profileData.id

      const formatTimetz = (time: string) => {
        const date = new Date(`1970-01-01T${time}`)
        return date.toTimeString().split(" ")[0]
      }

      const formatTimestamptz = (date: string, time: string) => {
        const timestamp = new Date(`${date}T${time}:00Z`)
        return timestamp.toISOString()
      }

      if (modalType === "schedule") {
        // Fetch subject_id based on subject_code
        const { data: subjectData, error: subjectError } = await supabase
          .from("subject")
          .select("id")
          .eq("subject_code", formData.subject_code)
          .single()

        if (subjectError || !subjectData) {
          console.error("Error fetching subject_id:", subjectError || "No subject found for the given subject_code.")
          return
        }

        const subjectId = subjectData.id

        const scheduleData = {
          room_id: formData.room_id,
          subject_id: subjectId,
          days: formData.days,
          time_in: formatTimetz(formData.time_in!),
          time_out: formatTimetz(formData.time_out!),
          course_id: courseId,
          profile_id: profileId,
        }

        if (formData.id) {
          await updateSchedule({ ...scheduleData, id: formData.id })
        } else {
          await addSchedule(scheduleData)
        }
      } else if (modalType === "booking") {
        const bookingData = {
          room_id: formData.room_id,
          subject_code: formData.subject_code,
          course_and_section: formData.course_name,
          date: formData.date,
          time_in: formatTimestamptz(formData.date!, formData.time_in!),
          time_out: formatTimestamptz(formData.date!, formData.time_out!),
          profile_id: profileId,
        }

        if (formData.id) {
          await updateBooking({ ...bookingData, id: formData.id })
        } else {
          await addBooking(bookingData)
        }
      }

      console.log("Form submitted successfully!")
      closeModal()
      refreshData()
    } catch (error) {
      console.error("Unexpected error:", error)
    }
  }

  const openStatusModal = (event: any) => {
    setSelectedEvent(event)
    setStatusModalOpen(true)
  }

  const closeStatusModal = () => {
    setStatusModalOpen(false)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Box sx={{ position: "relative" }}>
     

      <Box sx={{ padding: 3, color: "black", display: "flex" }}>
        <Box sx={{ width: "200px", borderRight: "1px solid #ccc" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            All Users
          </Typography>
          <List>
            {users.map((user) => (
              <ListItem key={user} onClick={() => setSelectedUser(user)} component="div">
                <ListItemText primary={user} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ flexGrow: 1, padding: "20px" }}>
          {isLoading ? (
            <CircularProgress />
          ) : selectedUser ? (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                {selectedUser} Information
              </Typography>
              <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ marginBottom: 2 }}>
                <Tab label="User Info" />
                <Tab label="Booking Info" />
                <Tab label="Schedule Info" />
              </Tabs>
              {/* User Info Tab Content */}
              {activeTab === 0 && userInfo && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>User Information</Typography>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>Field</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Value</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>ID:</TableCell>
                          <TableCell>{userInfo?.user_id || "Unknown"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Username:</TableCell>
                          <TableCell>{userInfo?.username || "Unknown"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Full Name:</TableCell>
                          <TableCell>{userInfo?.full_name || "Unknown"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Email:</TableCell>
                          <TableCell>{userInfo?.user_email || "Unknown"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Mobile Number:</TableCell>
                          <TableCell>{userInfo?.mobile_number || "Unknown"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Department:</TableCell>
                          <TableCell>{userInfo?.user_department || "Unknown"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>User Role:</TableCell>
                          <TableCell>{userInfo?.user_role || "Unknown"}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Booking Info Tab Content */}
              {activeTab === 1 && (
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Booking Information
                      </Typography>
                      <Button
                        sx={{ fontWeight: "bold", backgroundColor: "#1F305E" }}
                        variant="contained"
                        color="primary"
                        onClick={() => openModal("booking")}
                      >
                        Add Booking
                      </Button>
                    </Box>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                          <TableRow>
                            {<TableCell hidden>Booking ID</TableCell>}
                            <TableCell>Room Name</TableCell>
                            <TableCell>Subject Code</TableCell>
                            <TableCell>Section</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {bookingData
                            .filter((event) => event.user_name === selectedUser)
                            .map((event, index) => (
                              <TableRow key={index} onClick={() => openModal("booking", event)}>
                                {<TableCell hidden>{event.id}</TableCell>}
                                <TableCell>{event.room_name}</TableCell>
                                <TableCell>{event.subject}</TableCell>
                                <TableCell>{event.course_section}</TableCell>
                                <TableCell>{event.date}</TableCell>
                                <TableCell>
                                  {`${dayjs(event.book_timeIn).utc().format("h:mm A")} - ${dayjs(event.book_timeOut).utc().format("h:mm A")}`}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="contained"
                                    sx={{
                                      textTransform: "none",
                                      backgroundColor: "#1F305E",
                                      color: "white",
                                      "&:hover": { backgroundColor: "#172647" },
                                      width: "100px",
                                      fontSize: "10px",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openStatusModal(event)
                                    }}
                                  >
                                    {event.status}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              )}

              {/* Schedule Info Tab Content */}
              {activeTab === 2 && (
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Schedule Information
                      </Typography>
                      <Button
                        sx={{ fontWeight: "bold", backgroundColor: "#1F305E" }}
                        variant="contained"
                        color="primary"
                        onClick={() => openModal("schedule")}
                      >
                        Add Schedule
                      </Button>
                    </Box>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                          <TableRow>
                            {<TableCell hidden>Schedule ID</TableCell>}
                            <TableCell>Room Name</TableCell>
                            <TableCell>Subject Code</TableCell>
                            <TableCell>Section</TableCell>
                            <TableCell>Weekday</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {scheduleData
                            .filter((event) => event.user_name === selectedUser)
                            .map((event, index) => (
                              <TableRow key={index} onClick={() => openModal("schedule", event)}>
                                {<TableCell hidden>{event.id}</TableCell>}
                                <TableCell>{event.room_name}</TableCell>
                                <TableCell>{event.subject_code}</TableCell>
                                <TableCell>{event.course_name}</TableCell>
                                <TableCell>{event.days}</TableCell>
                                <TableCell>{`${dayjs(event.time_in, "HH:mm:ss").format("h:mm A")} - ${dayjs(event.time_out, "HH:mm:ss").format("h:mm A")}`}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="contained"
                                    sx={{
                                      textTransform: "none",
                                      backgroundColor: "#1F305E",
                                      color: "white",
                                      "&:hover": { backgroundColor: "#172647" },
                                      width: "100px",
                                      fontSize: "10px",
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openStatusModal(event)
                                    }}
                                  >
                                    {event.status}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              )}
            </Box>
          ) : (
            <Typography>Please select a user to view their schedule.</Typography>
          )}
        </Box>
      </Box>

      <EventModal
        modalOpen={modalOpen}
        closeModal={closeModal}
        modalType={modalType}
        formData={formData}
        setFormData={setFormData}
        selectedEvent={selectedEvent}
        rooms={rooms}
        handleFormChange={handleFormChange}
        handleFormSubmit={handleFormSubmit}
      />

      <StatusModal
        statusModalOpen={statusModalOpen}
        closeStatusModal={() => setStatusModalOpen(false)}
        selectedEvent={selectedEvent}
        FormData={async () => {
         
          useSupabaseQueries(selectedUser)
        
        }}
      />

      <PrintablePage
        selectedUser={selectedUser}
        userInfo={userInfo}
        bookingData={bookingData.filter((event) => event.user_name === selectedUser)}
        scheduleData={scheduleData.filter((event) => event.user_name === selectedUser)}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handlePrint}
        sx={{ position: "fixed", bottom: "20px", right: "20px" }}
      >
        Print Schedule
      </Button>
    </Box>
  )
}

export default UserSchedulePage

