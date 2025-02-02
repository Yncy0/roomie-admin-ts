import { useQuery } from "@tanstack/react-query";
import supabase from "@/utils/supabase";

export const fetchAvailableBookedRooms = () => {
    return useQuery({
      queryKey: ["available_booked_rooms"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("booked_rooms")
          .select(`*, profiles(*), rooms(*)`);
  
        if (error) {
          console.log(error);
          throw error;
        }
  
        // Mapping to match the required structure
        return data?.map((bookedRoom) => ({
          id: Number(bookedRoom.id), // Ensure id is a number
          room_id: Number(bookedRoom.room_id), // Ensure room_id is a number
          user_id: bookedRoom.profile_id ? Number(bookedRoom.profile_id) : 0, // Assuming profile_id represents user_id
          booked_time: bookedRoom.created_at, // Assuming created_at is when it was booked
        })) as { id: number; room_id: number; user_id: number; booked_time: string }[];
      },
    });
  };
  