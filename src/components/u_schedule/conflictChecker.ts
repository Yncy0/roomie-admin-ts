import dayjs from "dayjs"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import supabase from "@/utils/supabase"

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

interface FormattedData {
  room_id: string
  days: string
  time_in: string
  time_out: string
  date: string
  selectedUserId: string
  id: string
}

const conflictChecker = async (formattedData: FormattedData): Promise<string | null> => {
    if (!formattedData || !formattedData.room_id || !formattedData.days || !formattedData.time_in || !formattedData.time_out || !formattedData.date || !formattedData.selectedUserId || !formattedData.id) {
        console.error("Missing required fields in formattedData:", formattedData);
        return "Error: Missing required data.";
      }
    
      const { room_id, days, time_in, time_out, date, selectedUserId, id } = formattedData;
    
      const newStart = dayjs(time_in, "HH:mm");
      const newEnd = dayjs(time_out, "HH:mm");
    
      if (!newStart.isValid() || !newEnd.isValid()) {
        console.error("Invalid time format for time_in or time_out.");
        return null;
      }
    
      try {
        // Check for booking conflicts (specific date)
        if (date) {
          const { data: existingBookings, error: bookingError } = await supabase
            .from("booked_rooms")
            .select("*, rooms (*), profiles (*)")
            .eq("room_id", room_id)
            .eq("date", date)
            .neq("id", id);  // Exclude current record by ID if updating
    
          if (bookingError) throw new Error(bookingError.message);
    
          for (const record of existingBookings) {
            const recordStart = dayjs(record.time_in).tz("Asia/Manila", true); // Convert timestampz to Manila time
            const recordEnd = dayjs(record.time_out).tz("Asia/Manila", true); // Convert timestampz to Manila time
    
            if (
              newStart.isBetween(recordStart, recordEnd, null, "[)") ||
              newEnd.isBetween(recordStart, recordEnd, null, "(]") ||
              (newStart.isSameOrBefore(recordStart) && newEnd.isSameOrAfter(recordEnd))
            ) {
              const userName = record.profiles?.username || "Unknown User";
              return `Conflict detected with a booking on ${date} by ${userName}.`;
            }
          }
        }
    
        // Check for schedule conflicts (specific weekday)
        const { data: existingSchedules, error: scheduleError } = await supabase
          .from("schedule")
          .select("*, rooms (*), profiles (*), subject (*), course (*)")
          .eq("room_id", room_id)
          .eq("days", days)
          .neq("id", id);  // Exclude current record by ID if updating
    
        if (scheduleError) throw new Error(scheduleError.message);
    
        for (const record of existingSchedules) {
          const recordStart = dayjs(record.time_in, "HH:mm");
          const recordEnd = dayjs(record.time_out, "HH:mm");
    
          if (
            newStart.isBetween(recordStart, recordEnd, null, "[)") ||
            newEnd.isBetween(recordStart, recordEnd, null, "(]") ||
            (newStart.isSameOrBefore(recordStart) && newEnd.isSameOrAfter(recordEnd))
          ) {
            const userName = record.profiles?.username || "Unknown User";
            return `Conflict detected with a schedule on ${days} by ${userName}.`;
          }
        }
      } catch (error) {
        console.error("Error in conflictChecker:", error.message);
        return "Error checking conflicts. Please try again.";
      }
    
      return null;  // No conflict found
    };

export default conflictChecker

