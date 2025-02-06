import supabase from "@/utils/supabase";

export const insertBuilding = async (
    building_name: string,
    building_image: string,
    num_of_rooms: number,
    num_of_floors: number,
) => {
    const { data, error } = await supabase
        .from("building")
        .insert([{
            building_name: building_name,
            building_image: building_image,
            num_of_rooms: num_of_rooms,
            num_of_floors: num_of_floors,
        }])
        .select();

    if (error) throw error;

    return data;
};
