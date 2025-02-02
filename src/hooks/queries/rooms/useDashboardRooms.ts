import { useQuery } from "@tanstack/react-query";
import supabase from "@/utils/supabase";

const fetchDashboardRooms = async () => {
  const { data, error } = await supabase.from("rooms").select("room_name");
  if (error) throw error;
  return data || [];
};

const useDashboardRooms = () => {
  return useQuery({
    queryKey: ["dashboard_rooms"],
    queryFn: fetchDashboardRooms,
  });
};

export default useDashboardRooms;
