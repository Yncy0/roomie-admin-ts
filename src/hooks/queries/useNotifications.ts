import supabase from "@/utils/supabase";

export const insertNotification = async (id: string, body: string) => {
    const { data, error } = await supabase
        .from("notifications")
        .insert([{
            user_id: id,
            body: body,
        }])
        .select()
        .single();

    if (error) throw error;

    return data;
};
