import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const fetchBuildings = () => {
    return useQuery({
        queryKey: ["building"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("building")
                .select("*");

            if (error) throw error;

            return data;
        },
    });
};
