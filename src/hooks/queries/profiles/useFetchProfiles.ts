import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const fetchProfiles = () => {
    return useQuery({
        queryKey: ["profiles"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*");

            if (error) {
                console.log(error);
                throw error;
            }

            return data;
        },
    });
};
