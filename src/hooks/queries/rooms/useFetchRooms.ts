import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const fetchRooms = () => {
    return useQuery({
        queryKey: ["rooms"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("rooms")
                .select("*, building(*)");

            if (error) {
                console.log(error);
                throw error;
            }

            return data;
        },
    });
};
