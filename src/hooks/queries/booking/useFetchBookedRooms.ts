import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "database.types";

type BookedRooms = Tables<"booked_rooms">;

export const fetchBookedRooms = () => {
    return useQuery({
        queryKey: ["booked_rooms"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("booked_rooms")
                .select(`*, profiles(*), rooms(*)`);

            if (error) {
                console.log(error);
                throw error;
            }

            return data;
        },
    });
};

export const fetchBookedRoomsWithUserId = (id: any) => {
    return useQuery({
        queryKey: ["booked_rooms", id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("booked_rooms")
                .select(`*, profiles(*), rooms(*)`)
                .eq("profile_id", id);

            if (error) {
                console.log(error);
                throw error;
            }

            return data;
        },
    });
};
