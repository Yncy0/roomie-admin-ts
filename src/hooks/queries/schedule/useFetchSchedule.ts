import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const fetchSchedule = () => {
    return useQuery({
        queryKey: ["schedule"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("schedule")
                .select("*, subject(*), course(*), profiles(*), rooms(*)");

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
                .select("*, subject(*), course(*), profiles(*)")
                .eq("room_id", id);

            if (error) {
                console.log(error);
                throw error;
            }

            return data;
        },
    });
};

export const fetchScheduleWithUserId = (id: any) => {
    return useQuery({
        queryKey: ["schedule", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("schedule")
                .select("*, subject(*), course(*), profiles(*)")
                .eq("profile_id", id);

            if (error) {
                console.log(error);
                throw error;
            }

            return data;
        },
    });
};
