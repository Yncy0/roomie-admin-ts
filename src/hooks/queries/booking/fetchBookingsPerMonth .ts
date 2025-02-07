import supabase from "@/utils/supabase"
import { useQuery } from "@tanstack/react-query"

// Fetch all bookings and group them by month on the client-side
export const fetchBookingsPerMonth = () => {
  return useQuery({
    queryKey: ["bookings_per_month"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("booked_rooms")
        .select("created_at")
        .order("created_at", { ascending: true }) // Order by date

      if (error) {
        console.error("Error fetching bookings:", error)
        throw error
      }

      // Define all months to ensure each is represented
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ]
      const bookingsCount: Record<string, number> = Object.fromEntries(
        monthNames.map((month) => [month, 0])
      )

      // Group bookings by month
      data.forEach(({ created_at }) => {
        const monthIndex = new Date(created_at).getMonth() // Get month index (0-11)
        const monthName = monthNames[monthIndex]
        bookingsCount[monthName] += 1
      })

      return bookingsCount // Returns an object with full month names and counts
    },
    refetchInterval: 60000, // Refresh data every 60 seconds
  })
}
