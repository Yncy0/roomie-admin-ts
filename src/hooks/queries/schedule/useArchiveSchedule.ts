import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const fetchArchivedSchedule = () => {
    return useQuery({
        queryKey: ["schedule"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("schedule")
                .select("*")
                .eq("status", "DONE");

            if (error) {
                console.log(error);  // Log error if any
                throw error;
            }

            return data || [];  // Return data or empty array if no data is found
        },
    });
};
