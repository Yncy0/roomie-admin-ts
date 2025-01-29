import supabase from "@/utils/supabase";

export const updateRooms = async (
    id: string,
    room_name: string,
    room_image: string,
    room_type: string,
    room_capacity: number,
) => {
    const { error } = await supabase
        .from("rooms")
        .update({
            room_name: room_name,
            room_image: room_image,
            room_type: room_type,
            room_capacity: room_capacity,
        })
        .eq("id", id)
        .select();

    if (error) throw error;
};
