import { useQuery } from "@tanstack/react-query"
import supabase from "@/utils/supabase"

export const fetchAvailableRooms = () => {
  return useQuery({
    queryKey: ["available_rooms_today"],
    queryFn: async () => {
      const now = new Date()
      const today = now.toISOString().split("T")[0] // Get current date (YYYY-MM-DD)

      // Fetch total number of rooms
      const { data: allRooms, error: roomError } = await supabase.from("rooms").select("*")

      if (roomError) {
        console.error(roomError)
        throw roomError
      }

      const totalRooms = allRooms?.length ?? 0

      // Fetch booked rooms for today
      const { data: bookedRooms, error: bookedError } = await supabase
        .from("booked_rooms")
        .select("room_id, status")
        .eq("date", today)

      if (bookedError) {
        console.error(bookedError)
        throw bookedError
      }

      const totalBookingsToday = bookedRooms?.length ?? 0

      // Count rooms with "ONGOING" or "INCOMING" status
      const unavailableRoomsCount =
        bookedRooms?.filter(
          (room) => room.status.toUpperCase() === "ONGOING" || room.status.toUpperCase() === "INCOMING",
        ).length ?? 0

      // Calculate available rooms by subtracting unavailable rooms from total rooms
      const availableRoomsCount = totalRooms - unavailableRoomsCount

      return {
        totalRooms,
        availableRoomsCount,
        totalBookingsToday,
      }
    },
    refetchInterval: 10000, // Refresh data every 10 seconds
  })
}

