import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const fetchProfiles = () => {
    return useQuery({
        queryKey: ["profiles"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .neq("is_archived", true); // Excluding archived profiles

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
                .eq("id", id)
                .neq("is_archived", true) // Excluding archived profile by ID
                .single();

            if (error) {
                console.log(error);
                throw error;
            }

            return data;
        },
    });
};

export const fetchProfilesSingle = () => {
    return useQuery({
        queryKey: ["profiles"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .single(); // Excluding archived profiles

            if (error) {
                console.log(error);
                throw error;
            }

            return data;
        },
    });
};
