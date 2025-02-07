"use client"

import { useState, useCallback, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react"
import { Card, Table, Tabs } from "@radix-ui/themes"
import { createFileRoute } from "@tanstack/react-router"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import EventModal from "../../components/u_schedule/EventModal"
import StatusModal from "../../components/u_schedule/StatusModal"
import "@/styles/u_schedule.css"
import { useSupabaseQueries } from "../../hooks/useUserSchedule"
import { fetchBookedRoomsWithUserId } from "@/hooks/queries/booking/useFetchBookedRooms"
import { fetchProfilesWithId } from "@/hooks/queries/profiles/useFetchProfiles"
import { fetchScheduleWithUserId } from "@/hooks/queries/schedule/useFetchSchedule"
import supabase from "@/utils/supabase"
dayjs.extend(utc)

export const Route = createFileRoute("/profile_view/$id")({
  component: UserView,
  loader: async ({ params }) => {
    return {
      id: params.id,
    }
  },
})

function UserView() {
  const { id } = Route.useLoaderData()
  const [modalOpen, setModalOpen] = useState(false)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [modalType, setModalType] = useState<"booking" | "schedule">("booking")
  const [formData, setFormData] = useState({})
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [activeTab, setActiveTab] = useState<string>("userInfo")

  const { rooms, addSchedule, updateSchedule, addBooking, updateBooking } = useSupabaseQueries(id)
  const { data: bookingData, refetch: refetchBookings } = fetchBookedRoomsWithUserId(id)
  const { data: scheduleData, refetch: refetchSchedule } = fetchScheduleWithUserId(id)
  const { data: userInfo } = fetchProfilesWithId(id)

  const closeModal = () => setModalOpen(false)
  const closeStatusModal = () => setStatusModalOpen(false)

  const handleFormChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFormSubmit = async () => {
    try {
      if (!formData.room_id || !formData.time_in || !formData.time_out) {
        alert("Please fill in all required fields.")
        return
      }

      let courseId = null

      if (modalType === "schedule") {
        if (!formData.subject_code || !formData.days) {
          alert("Please complete all schedule fields.")
          return
        }

        const { data: courseData, error: courseError } = await supabase
          .from("course")
          .select("id")
          .eq("course_name", formData.course_name)
          .single()

        if (!courseError) {
          courseId = courseData?.id
        }
      } else if (modalType === "booking" && !formData.date) {
        alert("Please enter a valid date for booking.")
        return
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", id)
        .single()

      if (profileError || !profileData) {
        alert("Invalid profile ID: No matching record found.")
        return
      }

      const profileId = profileData.id

      if (modalType === "schedule") {
        const { data: subjectData, error: subjectError } = await supabase
          .from("subject")
          .select("id")
          .eq("subject_code", formData.subject_code)
          .single()

        if (subjectError || !subjectData) {
          alert("Error: No subject found for the given subject code.")
          return
        }

        const subjectId = subjectData.id

        const scheduleData = {
          room_id: formData.room_id,
          subject_id: subjectId,
          days: formData.days,
          time_in: formData.time_in,
          time_out: formData.time_out,
          course_id: courseId,
          profile_id: profileId,
        }

        if (selectedEvent) {
          await updateSchedule({ ...scheduleData, id: selectedEvent.id })
          alert("Schedule updated successfully!")
        } else {
          await addSchedule(scheduleData)
          alert("Schedule added successfully!")
        }

        refetchSchedule()
      } else if (modalType === "booking") {
        const bookingData = {
          room_id: formData.room_id,
          subject_code: formData.subject_code,
          course_and_section: formData.course_name,
          date: formData.date,
          time_in: formatTimestamptz(formData.date, formData.time_in),
          time_out: formatTimestamptz(formData.date, formData.time_out),
          profile_id: profileId,
        }

        if (selectedEvent) {
          await updateBooking({ ...bookingData, id: selectedEvent.id })
          alert("Booking updated successfully!")
        } else {
          await addBooking(bookingData)
          alert("Booking added successfully!")
        }

        refetchBookings()
      }

      setFormData({}) // Clear form data after successful submission
      setSelectedEvent(null) // Clear selected event
      closeModal() // Close the modal
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred while processing your request.")
    }
  }

  const handleStatusUpdate = async (newStatus: any) => {
    try {
      // Ensure an event is selected
      if (!selectedEvent) {
        alert("No event selected for status update.")
        return
      }

      await supabase
        .from("booked_rooms") // or "schedule" depending on the context
        .update({ status: newStatus })
        .eq("id", selectedEvent.id)

      alert("Status updated successfully!")

      closeStatusModal()
      refetchBookings() // or refetchSchedule() if applicable
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status.")
    }
  }

  const handleRowClick = useCallback((event, type: "booking" | "schedule") => {
    setSelectedEvent(event)
    setModalOpen(true)
    setModalType(type)

    // Set formData based on the event type
    if (type === "booking") {
      setFormData({
        room_id: event.room_id,
        subject_code: event.subject_code,
        course_name: event.course_and_section,
        date: event.date,
        // Use the same conversion as the table
        time_in: dayjs(event.time_in).utc().format("HH:mm"),
        time_out: dayjs(event.time_out).utc().format("HH:mm"),
      })
    } else {
      setFormData({
        room_id: event.room_id,
        subject_code: event.subject?.subject_code,
        course_name: event.course?.course_name,
        days: event.days,
        time_in: event.timef_in,
        time_out: event.timef_out,
      })
    }
  }, [])

  const handleStatusClick = useCallback((e: React.MouseEvent, event) => {
    e.stopPropagation()
    setSelectedEvent(event)
    setStatusModalOpen(true)
  }, [])


  

  return (
    <Card className="schedule-container m-10">
      <div className="button-container">
        {activeTab === "bookingInfo" && (
          <button
            id="addBooking"
            className="bookButton"
            onClick={() => {
              setSelectedEvent(null)
              setModalOpen(true)
              setModalType("booking")
            }}
          >
            Add Booking
          </button>
        )}
        {activeTab === "scheduleInfo" && (
          <button
            id="addSchedule"
            className="schedButton"
            onClick={() => {
              setSelectedEvent(null)
              setModalOpen(true)
              setModalType("schedule")
            }}
          >
            Add Schedule
          </button>
        )}
      </div>
      <div className="container, mt-0 mb-5 pl-5 pr-5 border-r-12px">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="container, mt-10 mb-5 pl-5 pr-5 border-r-12px">
            <Tabs.Trigger className="tabs-name" style={{fontSize: "16px" }} value="userInfo">
              User Info
            </Tabs.Trigger>
            <Tabs.Trigger
              className="tabs-name"
              style={{ fontSize: "16px", marginLeft: "1%" }}
              value="bookingInfo"
            >
              Booking Info
            </Tabs.Trigger>
            <Tabs.Trigger
              className="tabs-name"
              style={{ fontSize: "16px", marginLeft: "1%" }}
              value="scheduleInfo"
            >
              Schedule Info
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="userInfo">
            <ProfileInfo userInfo={userInfo} />
          </Tabs.Content>
          <Tabs.Content value="bookingInfo">
            <BookingInfo
              bookingData={bookingData}
              handleRowClick={handleRowClick}
              handleStatusClick={handleStatusClick}
            />
          </Tabs.Content>
          <Tabs.Content value="scheduleInfo">
            <ScheduleInfo
              scheduleData={scheduleData}
              handleRowClick={handleRowClick}
              handleStatusClick={handleStatusClick}
            />
          </Tabs.Content>
        </Tabs.Root>
      </div>

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
        closeStatusModal={closeStatusModal}
        selectedEvent={selectedEvent}
        handleStatusUpdate={handleStatusUpdate}
      />
    </Card>
  )
}

//README: Component for profiles table
const ProfileInfo = ({ userInfo }: { userInfo: any }) => {
  //const { data } = fetchProfilesWithId(userId)

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell style={{ color: "#4C516D" }}>Field</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell style={{ color: "#4C516D" }}>Value</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row style={{ color: "#4C516D" }}>
          <Table.Cell>ID:</Table.Cell>
          <Table.Cell>{userInfo?.id}</Table.Cell>
        </Table.Row>
        <Table.Row style={{ color: "#4C516D" }}>
          <Table.Cell>Username:</Table.Cell>
          <Table.Cell>{userInfo?.username}</Table.Cell>
        </Table.Row>
        <Table.Row style={{ color: "#4C516D" }}>
          <Table.Cell>Full name:</Table.Cell>
          <Table.Cell>{userInfo?.full_name}</Table.Cell>
        </Table.Row>
        <Table.Row style={{ color: "#4C516D" }}>
          <Table.Cell>Email:</Table.Cell>
          <Table.Cell>{userInfo?.email}</Table.Cell>
        </Table.Row>
        <Table.Row style={{ color: "#4C516D" }}>
          <Table.Cell>Mobile Number:</Table.Cell>
          <Table.Cell>{userInfo?.mobile_number}</Table.Cell>
        </Table.Row>
        <Table.Row style={{ color: "#4C516D" }}>
          <Table.Cell>Department</Table.Cell>
          <Table.Cell>{userInfo?.user_department}</Table.Cell>
        </Table.Row>
        <Table.Row style={{ color: "#4C516D" }}>
          <Table.Cell>User Role:</Table.Cell>
          <Table.Cell>{userInfo?.user_role}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  )
}

//README: components for booked_rooms table
const BookingInfo = ({
  bookingData,
  handleRowClick,
  handleStatusClick,
}: {
  bookingData: any
  handleRowClick: (event: any, type: "booking" | "schedule") => void
  handleStatusClick: (e: React.MouseEvent, event: any) => void
}) => {
  //const { data, isLoading, error } = fetchBookedRoomsWithUserId(userId)

  //if (isLoading) return <div>Loading...</div>
  //if (error) return <div>Error: {error.message}</div>

  return (
    <>
      <Table.Root>
        <Table.Header className="table-header-group">
          <Table.Row>
            <Table.ColumnHeaderCell style={{ color: "#4C516D" }}>Room Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: "#4C516D" }}>Subject Code</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: "#4C516D" }}>Section</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: "#4C516D" }}>Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: "#4C516D" }}>Time</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: "#4C516D" }}>Status</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {bookingData?.map((items: { rooms: { room_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined }; subject_code: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; course_and_section: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; date: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; time_in: string | number | Date | dayjs.Dayjs | null | undefined; time_out: string | number | Date | dayjs.Dayjs | null | undefined; status: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined }, index: Key | null | undefined) => (
            <Table.Row key={index} onClick={() => handleRowClick(items, "booking")}>
              <Table.Cell>{items.rooms?.room_name}</Table.Cell>
              <Table.Cell>{items.subject_code}</Table.Cell>
              <Table.Cell>{items.course_and_section}</Table.Cell>
              <Table.Cell>{items.date}</Table.Cell>
              <Table.Cell>
                {`${dayjs(items.time_in).utc().format("h:mm A")} - ${dayjs(items.time_out).utc().format("h:mm A")}`}
              </Table.Cell>
              <Table.Cell>
                <span className="status-pill" onClick={(e) => handleStatusClick(e, items)}>
                  {items.status}
                </span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  )
}

//README: components for schedule table
const ScheduleInfo = ({
  scheduleData,
  handleRowClick,
  handleStatusClick,
}: {
  scheduleData: any
  handleRowClick: (event: any, type: "booking" | "schedule") => void
  handleStatusClick: (e: React.MouseEvent, event: any) => void
}) => {
  //const { data } = fetchScheduleWithUserId(userId)

  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell style={{ color: "#4C516D" }}>Room Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: "#4C516D" }}>Subject Code</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: "#4C516D" }}>Section</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: "#4C516D" }}>Weekday</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: "#4C516D" }}>Time</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell style={{ color: "#4C516D" }}>Status</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {scheduleData?.map((items: { rooms: { room_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined }; subject: { subject_code: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined }; course: { course_name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined }; days: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; timef_in: string; timef_out: string; status: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined }, index: Key | null | undefined) => (
            <Table.Row key={index} onClick={() => handleRowClick(items, "schedule")}>
              <Table.Cell>{items.rooms?.room_name}</Table.Cell>
              <Table.Cell>{items.subject?.subject_code}</Table.Cell>
              <Table.Cell>{items.course?.course_name}</Table.Cell>
              <Table.Cell>{items.days}</Table.Cell>
              <Table.Cell>
                {convertToStandardTime(items.timef_in)} - {convertToStandardTime(items.timef_out)}
              </Table.Cell>
              <Table.Cell>
                <span className="status-pill" onClick={(e) => handleStatusClick(e, items)}>
                  {items.status}
                </span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  )
}

export default UserView

const formatTimestamptz = (date: string, time: string) => {
  // Create a date object in local time
  const localDate = new Date(`${date}T${time}`)
  // Convert to UTC
  return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString()
}
const convertToStandardTime = (militaryTime: string) => {
  if (!militaryTime) {
    return "" // Or return a default value or error message
  }

  const [hours, minutes] = militaryTime.split(":") // Assuming format is HH:mm
  const hour = Number.parseInt(hours, 10)
  const suffix = hour >= 12 ? "PM" : "AM"
  const standardHour = hour % 12 || 12 // Convert 0 (midnight) to 12 and 13-23 to 1-11
  return `${standardHour}:${minutes} ${suffix}`
}

