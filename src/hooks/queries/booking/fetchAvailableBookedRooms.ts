import { useQuery } from "@tanstack/react-query"
import supabase from "@/utils/supabase"

interface Room {
  id: number
  room_name: string
  building_id?: number // Optional if not present in the database
}

interface Building {
  id: string // Changed to string based on error
  building_name: string | null
}

interface BookedRoom {
  id: number
  room_id: number
  profile_id: number
  created_at: string
  status: string
  time_out?: string
}

export const fetchAvailableBookedRooms = () => {
  return useQuery({
    queryKey: ["available_booked_rooms"],
    queryFn: async () => {
      // Debug: Check actual room table structure
      const { data: roomColumns, error: roomColumnError } = await supabase
        .from("rooms")
        .select("*")
        .limit(1) // Fetch only one row to inspect column names

      if (roomColumnError) {
        console.error("Error fetching room columns:", roomColumnError)
      } else {
        console.log("Room table structure:", roomColumns)
      }

      // Fetch rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from("rooms")
        .select("id, room_name, building_id")

      if (roomsError) {
        console.error("Error fetching rooms:", roomsError)
        throw roomsError
      }

      // Fetch buildings (only if building_id exists)
      let buildingMap: Record<string, string> = {}

      if (roomsData.some(room => room.building_id !== undefined)) {
        const { data: buildingsData, error: buildingsError } = await supabase
          .from("building") // Ensure table name is correct in your schema
          .select("id, building_name")

        if (buildingsError) {
          console.warn("Skipping building data due to error:", buildingsError)
        } else {
          buildingsData?.forEach((b: Building) => {
            buildingMap[b.id] = b.building_name || "Unknown Building"
          })
        }
      }

      // Attach building names to rooms
      const roomsWithBuildings: (Room & { building: string })[] = roomsData.map((room: Room) => ({
        ...room,
        building: room.building_id ? buildingMap[room.building_id] || "Unknown Building" : "No Building Info",
      }))

      // Fetch current bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("booked_rooms")
        .select("room_id")
        .in("status", ["ONGOING", "INCOMING"])

      if (bookingsError) {
        console.error("Error fetching bookings:", bookingsError)
        throw bookingsError
      }

      // Create a set of booked room IDs
      const bookedRoomIds = new Set(bookingsData.map((booking: { room_id: string | null }) => Number(booking.room_id)))

      // Filter out booked rooms
      const availableRooms = roomsWithBuildings.filter((room) => !bookedRoomIds.has(room.id))

      return { availableRooms }
    },
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  })
}
