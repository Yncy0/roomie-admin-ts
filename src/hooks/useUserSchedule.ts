import { useState, useEffect, useCallback } from "react"
import supabase from "@/utils/supabase"
import type { BookingData, ScheduleData, UserInfo } from "../routes/user_schedule.lazy"

export const useSupabaseQueries = (selectedUser: string | null) => {
  const [isLoading, setIsLoading] = useState(false)
  const [bookingData, setBookingData] = useState<BookingData[]>([])
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([])
  const [rooms, setRooms] = useState<{ id: string; room_name: string }[]>([])
  const [users, setUsers] = useState<string[]>([])
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Fetch Users
      const { data: usersData, error: usersError } = await supabase.from("profiles").select("*")
      if (usersError) throw new Error("Error fetching users: " + usersError.message)

      // Fetch Schedule
      const { data: scheduleData, error: scheduleError } = await supabase
        .from("schedule")
        .select("*, rooms (*), profiles (*), subject (*), course (*)")
      if (scheduleError) throw new Error("Error fetching schedule: " + scheduleError.message)

      // Fetch Bookings
      const { data: bookingData, error: bookingError } = await supabase
        .from("booked_rooms")
        .select("*, rooms (*), profiles (*)")
      if (bookingError) throw new Error("Error fetching bookings: " + bookingError.message)

      // Fetch Rooms
      const { data: roomData, error: roomError } = await supabase.from("rooms").select("*")
      if (roomError) throw new Error("Error fetching rooms: " + roomError.message)

      // Set Rooms
      setRooms(
        roomData?.map((room) => ({
          id: room.id,
          room_name: room.room_name ?? "Unknown",
        })) || [],
      )

      // Transform Data
      setScheduleData(transformScheduleData(scheduleData || []))
      setBookingData(transformBookingData(bookingData || []))

      // Set User Options
      const usersList = new Set([
        ...scheduleData.map((item) => item.profiles?.username),
        ...bookingData.map((item) => item.profiles?.username),
        ...usersData.map((user) => user.username),
      ])
      setUsers(Array.from(usersList).filter(Boolean) as string[])

      // Set the user info based on selected user
      if (selectedUser) {
        const selectedUserInfo = usersData.find((user) => user.username === selectedUser)

        if (selectedUserInfo) {
          const userInfo: UserInfo = {
            user_id: selectedUserInfo.id || "Unknown",
            username: selectedUserInfo.username || "Unknown",
            full_name: selectedUserInfo.full_name || "Unknown",
            avatar_url: selectedUserInfo.avatar_url || "",
            website: selectedUserInfo.website || "",
            mobile_number: selectedUserInfo.mobile_number || "",
            user_email: selectedUserInfo.email || "Unknown",
            user_role: selectedUserInfo.user_role || "Unknown",
            user_department: selectedUserInfo.user_department || "Unknown",
          }
          setUserInfo(userInfo)
        } else {
          setUserInfo(null)
        }
      }
    } catch (error: any) {
      console.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [selectedUser])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const addSchedule = async (scheduleData: Partial<ScheduleData>) => {
    try {
      const { data, error } = await supabase.from("schedule").insert([scheduleData]).select()
      if (error) throw error
      await fetchData() // Refresh data after update
      return data
    } catch (error) {
      console.error("Error adding schedule:", error)
      throw error
    }
  }

  const updateSchedule = async (scheduleData: Partial<ScheduleData>) => {
    try {
      const { data, error } = await supabase.from("schedule").update(scheduleData).eq("id", scheduleData.id).select()
      if (error) throw error
      await fetchData() // Refresh data after update
      return data
    } catch (error) {
      console.error("Error updating schedule:", error)
      throw error
    }
  }

  const addBooking = async (bookingData: Partial<BookingData>) => {
    try {
      const { data, error } = await supabase.from("booked_rooms").insert([bookingData]).select()
      if (error) throw error
      await fetchData() // Refresh data after update
      return data
    } catch (error) {
      console.error("Error adding booking:", error)
      throw error
    }
  }

  const updateBooking = async (bookingData: Partial<BookingData>) => {
    try {
      const { data, error } = await supabase.from("booked_rooms").update(bookingData).eq("id", bookingData.id).select()
      if (error) throw error
      await fetchData() // Refresh data after update
      return data
    } catch (error) {
      console.error("Error updating booking:", error)
      throw error
    }
  }

  return {
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
    refreshData: fetchData,
  }
}

// Helper functions (you can move these to a separate file if needed)
const transformBookingData = (data: any[]): BookingData[] => {
  return data.map((item) => ({
    id: item.id || "",
    room_name: item.rooms?.room_name || "Unknown",
    subject: item.subject_code || "Unknown",
    course_section: item.course_and_section || "Unknown",
    date: item.date || "N/A",
    book_timeIn: item.time_in || "N/A",
    book_timeOut: item.time_out || "N/A",
    status: item.status || "PENDING",
    user_name: item.profiles?.username || "Unknown",
  }))
}

const transformScheduleData = (data: any[]): ScheduleData[] => {
  return data.map((item) => ({
    id: item.id || "",
    room_name: item.rooms?.room_name || "Unknown",
    subject_code: item.subject?.subject_code || "Unknown",
    course_name: item.course?.course_name || "Unknown",
    days: item.days || "N/A",
    time_in: item.time_in || "N/A",
    time_out: item.time_out || "N/A",
    status: item.status || "PENDING",
    user_name: item.profiles?.username || "Unknown",
  }))
}