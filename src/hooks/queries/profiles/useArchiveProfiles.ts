import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const fetchProfiles = () => {
    return useQuery({
        queryKey: ["profiles"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("id, full_name, email, user_role, is_archived")
                .eq("is_archived", true);

            if (error) {
                console.log(error);
                throw error;
            }

            return data;
        },
    });
};