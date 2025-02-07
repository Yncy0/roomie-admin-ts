import { useQuery } from "@tanstack/react-query"
import supabase from "@/utils/supabase"

export const fetchAvailableBookedRooms = () => {
  return useQuery({
    queryKey: ["available_booked_rooms"],
    queryFn: async () => {
      // Fetch all rooms with their names
      const { data: roomsData, error: roomsError } = await supabase.from("rooms").select("id, room_name")

      if (roomsError) {
        console.error("Error fetching rooms:", roomsError)
        throw roomsError
      }

      const totalRooms = roomsData?.length || 0
      const roomMap = new Map(roomsData?.map((room) => [room.id, room.room_name]))

      // Fetch all bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("booked_rooms")
        .select("id, room_id, profile_id, created_at, status")

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError)
        throw bookingsError
      }

      // Process bookings and map to rooms
      const bookings =
        bookingsData?.map((booking) => ({
          id: Number(booking.id),
          room_id: Number(booking.room_id),
          room_name: roomMap.get(booking.room_id) || "Unknown Room", // Handle null here
          user_id: booking.profile_id ? Number(booking.profile_id) : 0,
          booked_time: booking.created_at || "", // Handle null created_at
          status: booking.status,
        })) || []

      // Filter for "ON GOING" and "INCOMING" statuses
      const excludedStatuses = ["ON GOING", "INCOMING"]
      const bookedRooms = bookings.filter((booking) => excludedStatuses.includes(booking.status))

      // Calculate available rooms by subtracting the booked rooms
      const availableRooms = totalRooms - bookedRooms.length

      return {
        totalRooms,
        availableRooms,
        bookedRooms,
        allRooms: roomsData, // All room data fetched
        allBookings: bookings, // All booking data fetched
      }
    },
    refetchInterval: 5000, // Refresh every 5 seconds to keep it real-time
  })
}
