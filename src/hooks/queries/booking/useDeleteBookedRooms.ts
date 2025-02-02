import supabase from "@/utils/supabase";

export const deleteBookedRoomsCancel = async () => {
    const { data, error } = await supabase
        .from("booked_rooms")
        .delete()
        .eq("status", "CANCEL REQUEST");

    if (error) throw error;

    return data;
};
