import supabase from "@/utils/supabase";

export const updateBookedRoomsStatus = async (id: any, v: string) => {
    const { data, error } = await supabase
        .from("booked_rooms")
        .update({ status: v })
        .eq("id", id)
        .select();

    if (error) throw error;

    return data;
};
