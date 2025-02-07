import supabase from "@/utils/supabase";

// Function to upload image to Supabase Storage
const uploadImage = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase
    .storage
    .from('buildings')  // Ensure you have a bucket called 'buildings' in Supabase Storage
    .upload(fileName, file);

  if (error) {
    throw error;  // This will be an unknown error type
  }

  return data?.path; // Return the file path of the uploaded image
};

export const updateBuilding = async (
  id: string,
  building_name: string,
  building_image: File | string | null, // Accept either file, string, or null
  number_of_rooms: number,
  number_of_floors: number
) => {
  let imageUrl: string | null = null;

  // If it's a File, upload it to Supabase Storage
  if (building_image instanceof File) {
    try {
      imageUrl = await uploadImage(building_image); // Upload image and get the path
    } catch (error: unknown) {
      // Ensure error is of type Error
      if (error instanceof Error) {
        throw new Error("Error uploading image: " + error.message);
      } else {
        throw new Error("Unknown error occurred during image upload.");
      }
    }
  } else if (typeof building_image === "string") {
    imageUrl = building_image; // Keep the existing image URL
  }

  // Now update the building data in the database with the image URL
  const { error } = await supabase
    .from("building")
    .update({
      building_name,
      building_image: imageUrl, // Use the image URL (either uploaded or existing)
      num_of_rooms: number_of_rooms,
      num_of_floors: number_of_floors,
    })
    .eq("id", id)
    .select();

  if (error) {
    // Handle the error type safely
    if (error instanceof Error) {
      throw error; // Re-throw if it's an instance of Error
    } else {
      throw new Error("An unknown error occurred while updating the building.");
    }
  }
};
