import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import supabase from "@/utils/supabase"
import type { BookingData, ScheduleData, Conflict } from "../types"

dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

interface TimeRange {
  start: dayjs.Dayjs
  end: dayjs.Dayjs
}

export function checkTimeOverlap(range1: TimeRange, range2: TimeRange): boolean {
  return (
    (range1.start.isBefore(range2.end) && range1.end.isAfter(range2.start)) ||
    range1.start.isSame(range2.start) ||
    range1.end.isSame(range2.end)
  )
}

export function checkDayOverlap(days1: string[], days2: string[]): boolean {
  const normalizedDays1 = days1.map((d) => d.trim().toLowerCase())
  const normalizedDays2 = days2.map((d) => d.trim().toLowerCase())
  return normalizedDays1.some((day) => normalizedDays2.includes(day))
}

export async function findDatabaseConflicts(newEvent: BookingData | ScheduleData): Promise<Conflict[]> {
  const conflicts: Conflict[] = []
  const isNewEventBooking = "date" in newEvent

  try {
    // Check booked_rooms table for conflicts
    if (isNewEventBooking) {
      const { data: bookingConflicts, error: bookingError } = await supabase
        .from("booked_rooms")
        .select(`
          id,
          room_id,
          date,
          time_in,
          time_out,
          profiles:profile_id (username)
        `)
        .eq("room_id", newEvent.room_id)
        .eq("date", newEvent.date)
        .neq("id", newEvent.id || "") // Exclude current event if updating
        .not("status", "eq", "Cancelled") // Exclude cancelled bookings

      if (bookingError) throw bookingError

      if (bookingConflicts) {
        const newTimeRange = {
          start: dayjs(`${newEvent.date} ${newEvent.book_timeIn}`),
          end: dayjs(`${newEvent.date} ${newEvent.book_timeOut}`),
        }

        bookingConflicts.forEach((conflict, index) => {
          const existingTimeRange = {
            start: dayjs(`${conflict.date} ${conflict.time_in}`),
            end: dayjs(`${conflict.date} ${conflict.time_out}`),
          }

          if (checkTimeOverlap(newTimeRange, existingTimeRange)) {
            conflicts.push({
              type: "booking",
              user: conflict.profiles?.username || "Unknown",
              rowNumber: index + 1,
              details: `Booking time conflict on ${conflict.date}`,
            })
          }
        })
      }

      // Also check schedule table for conflicts with the booking day
      const bookingDay = dayjs(newEvent.date).format("dddd")
      const { data: scheduleConflicts, error: scheduleError } = await supabase
        .from("schedule")
        .select(`
          id,
          room_id,
          days,
          time_in,
          time_out,
          profiles:profile_id (username)
        `)
        .eq("room_id", newEvent.room_id)
        .not("status", "eq", "Cancelled")
        .ilike("days", `%${bookingDay}%`)

      if (scheduleError) throw scheduleError

      if (scheduleConflicts) {
        const newTimeRange = {
          start: dayjs(newEvent.book_timeIn, "HH:mm:ss"),
          end: dayjs(newEvent.book_timeOut, "HH:mm:ss"),
        }

        scheduleConflicts.forEach((conflict, index) => {
          const existingTimeRange = {
            start: dayjs(conflict.time_in, "HH:mm:ss"),
            end: dayjs(conflict.time_out, "HH:mm:ss"),
          }

          if (checkTimeOverlap(newTimeRange, existingTimeRange)) {
            conflicts.push({
              type: "schedule",
              user: conflict.profiles?.username || "Unknown",
              rowNumber: index + 1,
              details: `Booking conflicts with existing schedule on ${bookingDay}`,
            })
          }
        })
      }
    } else {
      // Check schedule table for conflicts
      const { data: scheduleConflicts, error: scheduleError } = await supabase
        .from("schedule")
        .select(`
          id,
          room_id,
          days,
          time_in,
          time_out,
          profiles:profile_id (username)
        `)
        .eq("room_id", newEvent.room_id)
        .neq("id", newEvent.id || "") // Exclude current event if updating
        .not("status", "eq", "Cancelled")

      if (scheduleError) throw scheduleError

      if (scheduleConflicts) {
        const newDays = newEvent.days.split(",")
        const newTimeRange = {
          start: dayjs(newEvent.time_in, "HH:mm:ss"),
          end: dayjs(newEvent.time_out, "HH:mm:ss"),
        }

        scheduleConflicts.forEach((conflict, index) => {
          const existingDays = conflict.days.split(",")
          if (checkDayOverlap(newDays, existingDays)) {
            const existingTimeRange = {
              start: dayjs(conflict.time_in, "HH:mm:ss"),
              end: dayjs(conflict.time_out, "HH:mm:ss"),
            }

            if (checkTimeOverlap(newTimeRange, existingTimeRange)) {
              conflicts.push({
                type: "schedule",
                user: conflict.profiles?.username || "Unknown",
                rowNumber: index + 1,
                details: `Schedule time conflict on ${existingDays.join(", ")}`,
              })
            }
          }
        })
      }

      // Also check booked_rooms table for conflicts with the schedule days
      const newDays = newEvent.days.split(",").map((d: string) => d.trim())
      const { data: bookingConflicts, error: bookingError } = await supabase
        .from("booked_rooms")
        .select(`
          id,
          room_id,
          date,
          time_in,
          time_out,
          profiles:profile_id (username)
        `)
        .eq("room_id", newEvent.room_id)
        .not("status", "eq", "Cancelled")

      if (bookingError) throw bookingError

      if (bookingConflicts) {
        const newTimeRange = {
          start: dayjs(newEvent.time_in, "HH:mm:ss"),
          end: dayjs(newEvent.time_out, "HH:mm:ss"),
        }

        bookingConflicts.forEach((conflict, index) => {
          const bookingDay = dayjs(conflict.date).format("dddd")
          if (newDays.includes(bookingDay)) {
            const existingTimeRange = {
              start: dayjs(conflict.time_in, "HH:mm:ss"),
              end: dayjs(conflict.time_out, "HH:mm:ss"),
            }

            if (checkTimeOverlap(newTimeRange, existingTimeRange)) {
              conflicts.push({
                type: "booking",
                user: conflict.profiles?.username || "Unknown",
                rowNumber: index + 1,
                details: `Schedule conflicts with existing booking on ${bookingDay}`,
              })
            }
          }
        })
      }
    }

    return conflicts
  } catch (error) {
    console.error("Error checking for conflicts:", error)
    throw error
  }
}

