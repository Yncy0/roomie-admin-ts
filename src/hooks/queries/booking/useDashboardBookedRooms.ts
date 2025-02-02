import { useQuery } from "@tanstack/react-query";
import supabase from "@/utils/supabase";

const fetchDashboardBookedRooms = async () => {
  const { data, error } = await supabase
    .from("booked_rooms")
    .select("rooms(room_name), status");
  if (error) throw error;
  return data || [];
};

const useDashboardBookedRooms = () => {
  return useQuery({
    queryKey: ["dashboard_booked_rooms"],
    queryFn: fetchDashboardBookedRooms,
  });
};

export default useDashboardBookedRooms;
