import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const fetchSchedule = () => {
    return useQuery({
        queryKey: ["schedule"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("schedule")
                .select("*")
                .eq("status", "DONE")
                
            if (error) {
                console.log(error);
                throw error;
            }

            return data;
        },
    });
};

export const fetchScheduleWithId = (id: any) => {
    return useQuery({
        queryKey: ["schedule", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("schedule")
                .select("*")
                .eq("status", "DONE")

            if (error) {
                console.log(error);
                throw error;
            }

            return data;
        },
    });
};
