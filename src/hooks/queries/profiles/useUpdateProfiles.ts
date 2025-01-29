import supabase from "@/utils/supabase";

export const updateProfiles = async (
    id: string,
    username: string,
    mobile_number: string,
    email: string,
    user_role: string,
    user_department: string,
) => {
    const { data, error, status } = await supabase
        .from("profiles")
        .update({
            username: username,
            mobile_number: mobile_number,
            email: email,
            user_role: user_role,
            user_department: user_department,
        })
        .eq("id", id)
        .select();

    if (error) {
        console.error("Error updating profile:", error);
    } else {
        console.log("Profile updated:", data);
    }

    if (status) console.log(status);

    return data;
};
