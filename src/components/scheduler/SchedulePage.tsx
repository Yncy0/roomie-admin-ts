import React, { useEffect, useState } from "react"
import { Box, Typography, TextField, MenuItem, Autocomplete, CircularProgress } from "@mui/material"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import { fetchBookedRooms } from "@/hooks/queries/booking/useFetchBookedRooms"
import { fetchSchedule } from "@/hooks/queries/schedule/useFetchSchedule"
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
    console.warn(`Invalid weekday provided: ${weekday}`)
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
        subject_name: item.subject?.subject_name || "Unknown",
      }
    })
  })
}

const getColorBasedOnStatus = (status: string): string => {
  switch (status) {
    case "Incoming":
      return "#cae9ff"
    case "In Progress":
      return "#a3cef1"
    case "Complete":
      return "#8ebee6"
    case "Cancelled":
      return "#84a9d9"
    default:
      return "#fff"
  }
}

const SchedulePage: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([])
  const [filteredData, setFilteredData] = useState<ScheduleItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [filterType, setFilterType] = useState<string>("All")
  const [selectedFilterValue, setSelectedFilterValue] = useState<string>("")
  const [roomOptions, setRoomOptions] = useState<string[]>([])
  const [userOptions, setUserOptions] = useState<string[]>([])
  const [sectionOptions, setSectionOptions] = useState<string[]>([])
  const [statusOptions] = useState<string[]>(["Incoming", "In Progress", "Complete", "Cancelled"])

  const { data: bookedRoomsData, error: bookedRoomsError } = fetchBookedRooms()
  const { data: scheduleDataFromAPI, error: scheduleDataError } = fetchSchedule()

  useEffect(() => {
    if (bookedRoomsError || scheduleDataError) {
      console.error("Error fetching data:", bookedRoomsError || scheduleDataError)
      setIsLoading(false)
      return
    }

    if (bookedRoomsData && scheduleDataFromAPI) {
      const transformedBookingData = transformBookingData(bookedRoomsData)
      const transformedScheduleData = transformScheduleData(scheduleDataFromAPI)

      const combinedData = [...transformedBookingData, ...transformedScheduleData]
      setScheduleData(combinedData)
      setFilteredData(combinedData)

      const rooms = Array.from(new Set(combinedData.map((item) => item.room_name || "Unknown")))
      const users = Array.from(new Set(combinedData.map((item) => item.user_name || "Unknown")))
      const sections = Array.from(new Set(combinedData.map((item) => item.section || "Unknown")))

      setRoomOptions(rooms)
      setUserOptions(users)
      setSectionOptions(sections)
      setIsLoading(false)
    }
  }, [bookedRoomsData, scheduleDataFromAPI, bookedRoomsError, scheduleDataError])

  const handleFilterTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterType(event.target.value)
    setSelectedFilterValue("")
    if (event.target.value === "All") {
      setFilteredData(scheduleData)
    }
  }

  const handleFilterValueChange = (event: React.SyntheticEvent<Element, Event>, newValue: string | null) => {
    const value = newValue || ""
    setSelectedFilterValue(value)
    applyFilter(filterType, value)
  }

  const applyFilter = (filterCriteria: string, value: string) => {
    if (filterCriteria === "All") {
      setFilteredData(scheduleData)
    } else {
      const filtered = scheduleData.filter((event) => {
        let result = false
        switch (filterCriteria) {
          case "User":
            result = event.user_name.toLowerCase().includes(value.toLowerCase())
            break
          case "Room":
            result = event.room_name.toLowerCase().includes(value.toLowerCase())
            break
          case "Section":
            result = event.section.toLowerCase().includes(value.toLowerCase())
            break
          case "Status":
            result = event.status.toLowerCase() === value.toLowerCase()
            break
          default:
            result = true
        }
        return result
      })
      console.log(`Filtered data for ${filterCriteria}:`, filtered)
      setFilteredData(filtered)
    }
  }

  useEffect(() => {
    if (filterType !== "All" && selectedFilterValue) {
      applyFilter(filterType, selectedFilterValue)
    } else {
      setFilteredData(scheduleData)
    }
  }, [scheduleData, filterType, selectedFilterValue])

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
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
        <TextField select label="Filter By" value={filterType} onChange={handleFilterTypeChange} sx={{ minWidth: 200 }}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="User">Professor</MenuItem>
          <MenuItem value="Room">Room</MenuItem>
          <MenuItem value="Section">Section</MenuItem>
          <MenuItem value="Status">Status</MenuItem>
        </TextField>

        {filterType !== "All" && (
          <Autocomplete
            value={selectedFilterValue}
            onChange={handleFilterValueChange}
            options={
              filterType === "User"
                ? userOptions
                : filterType === "Room"
                ? roomOptions
                : filterType === "Section"
                ? sectionOptions
                : statusOptions
            }
            renderInput={(params) => <TextField {...params} label={`Filter by ${filterType}`} />}
            sx={{ minWidth: 300 }}
          />
        )}
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
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
        />
      </Box>
    </Box>
  )
}

export default SchedulePage
