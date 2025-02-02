import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

// Fetch all bookings and group them by month on the client-side
export const fetchBookingsPerMonth = () => {
  return useQuery({
    queryKey: ["bookings_per_month"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("booked_rooms")
        .select("created_at")
        .order("created_at", { ascending: true });  // Order by the created_at timestamp

      if (error) {
        console.log(error);
        throw error;
      }

      // Group bookings by month
      const bookingsByMonth = data?.reduce((acc: Record<string, number>, booking) => {
        // Extract the month from created_at and convert it to a short month name (e.g., "Jan", "Feb")
        const month = new Date(booking.created_at).toLocaleString("default", {
          month: "short", // Month in short format ("Jan", "Feb", etc.)
        });

        // Increment the count for the month
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      return bookingsByMonth;  // Returns an object with month names as keys and counts as values
    },
  });
};
