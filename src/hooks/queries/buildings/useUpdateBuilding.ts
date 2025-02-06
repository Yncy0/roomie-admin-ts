import supabase from "@/utils/supabase";

export const updateBuilding = async (
    id: string,
    building_name: string,
    building_image: string,
    number_of_rooms: number,
    number_of_floors: number,
) => {
    const { error } = await supabase
        .from("building")
        .update({
            building_name: building_name,
            building_image: building_image,
            num_of_rooms: number_of_rooms,
            num_of_floors: number_of_floors,
        })
        .eq("id", id)
        .select();

    if (error) throw error;
};
