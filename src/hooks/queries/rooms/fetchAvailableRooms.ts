import { useQuery } from "@tanstack/react-query";
import supabase from "@/utils/supabase";

export const fetchAvailableRooms = () => {
    return useQuery({
      queryKey: ["available_rooms"],
      queryFn: async () => {
        const { data, error } = await supabase.from("rooms").select("*");
  
        if (error) {
          console.log(error);
          throw error;
        }
  
        // Mapping to match the required structure
        return data?.map((room) => ({
          id: Number(room.id), // Ensure id is a number
          name: room.room_name || "", // room_name -> name
          capacity: room.room_capacity || 0, // room_capacity -> capacity
          building: room.location || "", // location -> building
        })) as { id: number; name: string; capacity: number; building: string }[];
      },
    });
  };
  