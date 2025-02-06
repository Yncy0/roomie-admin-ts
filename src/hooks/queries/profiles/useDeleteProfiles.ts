import supabase from "@/utils/supabase";
import { useMutation } from "@tanstack/react-query";

export const useDeleteProfiles = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from("profiles")
                .update({ is_archived: true })  // Setting is_archived to true
                .eq("id", id);

            if (error) {
                console.log(error);
                throw error;
            }

            return data;
        },
    });
};
