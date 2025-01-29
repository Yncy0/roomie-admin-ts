import supabase from "@/utils/supabase";

export const insertBacklogs = async (action: string, event: string) => {
    const { data, error } = await supabase
        .from("backlogs")
        .insert([{ action: action, event: event }]).select();

    if (error) throw error;

    return data;
};
