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

export const fetchProfilesWithId = (id: any) => {
    return useQuery({
        queryKey: ["profiles", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", id);

            if (error) {
                console.log(error);
                throw error;
            }

            return data;
        },
    });
};
