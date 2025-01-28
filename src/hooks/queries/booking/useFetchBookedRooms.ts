import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const fetchBookedRooms = () => {
    return useQuery({
        queryKey: ["booked_rooms"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("booked_rooms")
                .select("*, profiles(*), rooms(*)");

            if (error) {
                console.log(error);
                throw error;
            }

            return data;
        },
    });
};
