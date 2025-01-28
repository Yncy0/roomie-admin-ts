import React from "react";
import { useQueryClient } from "@tanstack/react-query";

import supabase from "@/utils/supabase";

export const subscriptionBookedRoom = () => {
    const queryClient = useQueryClient();

    React.useEffect(() => {
        const channels = supabase.channel("custom-all-channel")
            .on(
                "postgres_changes",
                {
                    event: "*",
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
            .subscribe();

        return () => {
            channels.unsubscribe();
        };
    }, []);
};

export const subscriptionSchedule = () => {
    const queryClient = useQueryClient();

    React.useEffect(() => {
        const channels = supabase.channel("custom-all-channel")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "schedule",
                },
                (payload) => {
                    console.log("Change received!", payload);
                    queryClient.invalidateQueries({
                        queryKey: ["schedule"],
                    });
                },
            )
            .subscribe();

        return () => {
            channels.unsubscribe();
        };
    }, []);
};
