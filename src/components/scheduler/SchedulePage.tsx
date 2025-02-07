import type React from "react"
import { useEffect, useState } from "react"
import { Box, Typography, TextField, Autocomplete, CircularProgress } from "@mui/material"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import { fetchBookedRooms } from "@/hooks/queries/booking/useFetchBookedRooms"
import { fetchSchedule } from "@/hooks/queries/schedule/useFetchSchedule"
import { fetchRooms } from "@/hooks/queries/rooms/useFetchRooms"
import CustomEventCard from "./customEventCard"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

// Enable dayjs plugins
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

interface ScheduleItem {
  event_id: string
  start: Date | null
  end: Date | null
  title: string
  subtitle: string
  color: string
  status: string
  room_name: string
  section: string
  user_name: string
  time_in: string
  time_out: string
  subject_code: string
  subject_name?: string
  formattedTime?: string
  formattedInfo?: string
}

const transformBookingData = (data: any[]): ScheduleItem[] =>
  data.map((item) => {
    const startDate = item.time_in ? dayjs.utc(item.time_in).tz("Asia/Manila", true).toDate() : null
    const endDate = item.time_out ? dayjs.utc(item.time_out).tz("Asia/Manila", true).toDate() : null

    const formattedStart = startDate ? dayjs(startDate).format("h:mm") : "Unknown"
    const formattedEnd = endDate ? dayjs(endDate).format("h:mm") : "Unknown"

    return {
      event_id: `${item.rooms?.room_name || "Unknown"}-${item.date || "Unknown"}`,
      start: startDate,
      end: endDate,
      title: item.rooms?.room_name || "Unknown Room",
      subtitle: `Prof. ${item.profiles?.full_name || "Unknown"}`,
      color: getColorBasedOnStatus(item.status),
      status: item.status,
      room_name: item.rooms?.room_name || "Unknown Room",
      section: item.course_and_section || "Unknown",
      user_name: item.profiles?.full_name || "Unknown",
      time_in: formattedStart,
      time_out: formattedEnd,
      subject_code: item.subject_code || "Unknown",
      formattedTime: `${formattedStart} - ${formattedEnd}`,
      formattedInfo: `Room: ${item.rooms?.room_name || "Unknown Room"}\nSubject: ${item.subject_code || "Unknown Subject"}\nTime: ${formattedStart} - ${formattedEnd}\nProfessor: ${item.profiles?.full_name ? "Prof. " + item.profiles?.full_name : "Unknown Professor"}`,
      source: "booking", // Set source as booking for booking data
    }
  })

const weekdayToDates = (weekday: string | string[]): Date[] => {
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  let targetDayIndices: number[] = []

  if (typeof weekday === "string") {
    const days = weekday.split(",").map((day) => day.trim())
    targetDayIndices = days.map((day) => weekdays.indexOf(day)).filter((index) => index !== -1)
  } else if (Array.isArray(weekday)) {
    targetDayIndices = weekday.map((day) => weekdays.indexOf(day)).filter((index) => index !== -1)
  }

  if (targetDayIndices.length === 0) {
    return []
  }

  const currentYear = dayjs().year()
  const firstDayOfYear = dayjs(`${currentYear}-01-01`)
  const lastDayOfYear = dayjs(`${currentYear}-12-31`)

  let currentDay = firstDayOfYear
  const dates: Date[] = []

  while (currentDay.isBefore(lastDayOfYear) || currentDay.isSame(lastDayOfYear)) {
    if (targetDayIndices.includes(currentDay.day())) {
      dates.push(currentDay.toDate())
    }
    currentDay = currentDay.add(1, "day")
  }

  return dates
}

const transformScheduleData = (data: any[]): ScheduleItem[] => {
  return data.flatMap((item) => {
    const timeFormat = "H:mm:ss"
    let dates: Date[] = []

    try {
      dates = weekdayToDates(item.days)
    } catch (error) {
      console.error(`Error processing days for item: ${JSON.stringify(item)}`, error)
      return []
    }

    return dates.map((baseDate) => {
      const startDateString = item.time_in ? `${dayjs(baseDate).format("YYYY-MM-DD")} ${item.time_in}` : null
      const endDateString = item.time_out ? `${dayjs(baseDate).format("YYYY-MM-DD")} ${item.time_out}` : null

      const startDate = startDateString
        ? dayjs.tz(startDateString, `YYYY-MM-DD ${timeFormat}`, "Asia/Manila").toDate()
        : null
      const endDate = endDateString ? dayjs.tz(endDateString, `YYYY-MM-DD ${timeFormat}`, "Asia/Manila").toDate() : null

      return {
        event_id: `${item.rooms?.room_name || "Unknown"}-${item.days || "Unknown"}-${baseDate}`,
        start: startDate,
        end: endDate,
        title: item.rooms?.room_name || "Unknown Room",
        subtitle: `Prof. ${item.profiles?.full_name || "Unknown"}`,
        color: getColorBasedOnStatus(item.status),
        status: item.status || "Unknown",
        room_name: item.rooms?.room_name || "Unknown Room",
        section: item.course?.course_name || "Unknown",
        user_name: item.profiles?.full_name || "Unknown",
        time_in: item.time_in || "Unknown",
        time_out: item.time_out || "Unknown",
        subject_code: item.subject?.subject_code || "Unknown",
        subject_name: item.subject?.subject_name,
        source: "schedule", // Set source as schedule for schedule data
      }
    })
  })
}

const getColorBasedOnStatus = (status: string): string => {
  switch (status?.toUpperCase()) {
    case "INCOMING":
      return "#aec2f0" // Blue
    case "ONGOING":
      return "#F6F7C4" // Yellow
    case "DONE":
      return "#daeec9" // Green
    default:
      return "#FFFFFF" // White
  }
}

const SchedulePage: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([])
  const [filteredData, setFilteredData] = useState<ScheduleItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedRoom, setSelectedRoom] = useState<string | null>("SA 301") // Replace "Room 101" with your desired default room
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [allRooms, setAllRooms] = useState<string[]>([])

  const { data: bookedRoomsData, error: bookedRoomsError } = fetchBookedRooms()
  const { data: scheduleDataFromAPI, error: scheduleDataError } = fetchSchedule()
  const { data: roomsData, error: roomsError } = fetchRooms()

  useEffect(() => {
    if (bookedRoomsError || scheduleDataError || roomsError) {
      console.error("Error fetching data:", bookedRoomsError || scheduleDataError || roomsError)
      setIsLoading(false)
      return
    }

    if (bookedRoomsData && scheduleDataFromAPI && roomsData) {
      // Transform booking and schedule data
      const transformedBookingData = transformBookingData(bookedRoomsData)
      const transformedScheduleData = transformScheduleData(scheduleDataFromAPI)

      // Filter for valid statuses
      const validStatuses = ["INCOMING", "ON GOING", "DONE", "PENDING CLASS", "PENDING RESERVE"]
      const validData = [...transformedBookingData, ...transformedScheduleData].filter(
        (item) => item.status && validStatuses.includes(item.status.toUpperCase()),
      )

      // Set schedule data
      setScheduleData(validData)
      setFilteredData(validData)

      // Set all rooms from rooms database
      const roomNames = roomsData.map((room) => room.room_name)
      setAllRooms(roomNames)

      setIsLoading(false)
    }
  }, [bookedRoomsData, scheduleDataFromAPI, roomsData, bookedRoomsError, scheduleDataError, roomsError])

  const handleRoomChange = (event: React.SyntheticEvent<Element, Event>, newValue: string | null) => {
    setSelectedRoom(newValue)
    applyFilters(newValue, searchQuery)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchQuery(value)
    applyFilters(selectedRoom, value)
  }

  const applyFilters = (room: string | null, search: string) => {
    if (!search && (!room || room === " ")) {
      setFilteredData([])
      return
    }

    let filtered = scheduleData

    if (room && room !== " ") {
      filtered = filtered.filter((event) => event.room_name === room)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((event) =>
        Object.values(event).some((value) => typeof value === "string" && value.toLowerCase().includes(searchLower)),
      )
    }

    setFilteredData(filtered)
  }

  useEffect(() => {
    applyFilters(selectedRoom, searchQuery)
  }, [scheduleData, selectedRoom, searchQuery])

  // Removed useEffect that was setting the default room

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Schedule
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Autocomplete
          value={selectedRoom}
          onChange={handleRoomChange}
          options={[" ", ...allRooms]}
          renderInput={(params) => <TextField {...params} label="Filter by Room" />}
          sx={{ minWidth: 300 }}
          isOptionEqualToValue={(option, value) => option === value}
          defaultValue="SA 301" // Replace "Room 101" with your desired default room
        />
        <TextField label="Search" value={searchQuery} onChange={handleSearchChange} sx={{ minWidth: 300 }} />
      </Box>

      <Box sx={{ height: "calc(100vh - 200px)", minHeight: "600px" }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          events={filteredData}
          initialView="timeGridWeek"
          eventContent={(eventInfo) => <CustomEventCard event={eventInfo} />}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          height="100%"
          slotMinTime="6:00:00"
          slotMaxTime="22:00:00"
        />
      </Box>
    </Box>
  )
}

export default SchedulePage

