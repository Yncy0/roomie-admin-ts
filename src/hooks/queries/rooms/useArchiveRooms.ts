import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const fetchArchivedRooms = () => {
    return useQuery({
        queryKey: ["rooms"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("rooms")
                .select("*")
                .eq("is_archived", true);

            if (error) {
                console.log(error);
                throw error;
            }

            return data;
        },
    });
};
