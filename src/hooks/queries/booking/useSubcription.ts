import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import supabase from "@/utils/supabase";

const useSubscriptionBookedRoom = () => {
    const queryClient = useQueryClient();

    React.useEffect(() => {
        const channels = supabase.channel("custom-all-channel")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "booked_rooms",
                },
                (payload) => {
                    console.log("Change received!", payload);
                    queryClient.invalidateQueries({
                        queryKey: ["booked_rooms"],
                    });
                },
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "booked_rooms",
                },
                (payload) => {
                    console.log("Booking updated!", payload);
                    queryClient.invalidateQueries({
                        queryKey: ["booked_rooms"],
                    });
                },
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "booked_rooms",
                },
                (payload) => {
                    console.log("Booking deleted!", payload);
                    queryClient.invalidateQueries({
                        queryKey: ["booked_rooms"],
                    });
                },
            ).subscribe();

        return () => {
            channels.unsubscribe();
        };
    }, []);
};

export default useSubscriptionBookedRoom;
