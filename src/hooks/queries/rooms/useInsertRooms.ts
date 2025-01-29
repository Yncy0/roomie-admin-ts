import supabase from "@/utils/supabase";

export const insertRooms = async (
    room_name: string,
    room_image: string,
    room_type: string,
    room_capacity: number,
) => {
    const { data, error } = await supabase
        .from("rooms")
        .insert([{
            room_name: room_name,
            room_image: room_image,
            room_type: room_type,
            room_capacity: room_capacity,
        }])
        .select();

    if (error) throw error;

    return data;
};
