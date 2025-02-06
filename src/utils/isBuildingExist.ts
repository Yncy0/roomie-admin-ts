import supabase from "@/utils/supabase";

/**
 * Check if a room name already exists in the database.
 * @param building_name - The room name to check.
 * @returns `true` if the room name exists, `false` otherwise.
 */
export const isBuildingNameExists = async (
    building_name: string,
): Promise<boolean> => {
    const { data, error } = await supabase
        .from("building")
        .select("building_name")
        .eq("building_name", building_name)
        .single();

    // If the error is "No rows found," it means the room name doesn't exist.
    if (error && error.code !== "PGRST116") {
        console.error("Error checking room name:", error.message);
        throw error; // Re-throw the error for the caller to handle.
    }

    // If data exists, the room name is already taken.
    return !!data;
};
