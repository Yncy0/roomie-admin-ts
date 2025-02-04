import { fetchBookedRoomsWithUserId } from "@/hooks/queries/booking/useFetchBookedRooms";
import { fetchProfilesWithId } from "@/hooks/queries/profiles/useFetchProfiles";
import { fetchScheduleWithUserId } from "@/hooks/queries/schedule/useFetchSchedule";
import { Tabs } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Tables } from "database.types";
import React from "react";

export const Route = createFileRoute("/profile_view/$id")({
  component: UserView,
  loader: async ({ params }) => {
    return {
      id: params.id,
    };
  },
});

type Profile = Tables<"schedule">;

function UserView() {
  const { id } = Route.useLoaderData();
  return (
    <Tabs.Root defaultValue="userInfo">
      <Tabs.List>
        <Tabs.Trigger value="userInfo">User Info</Tabs.Trigger>
        <Tabs.Trigger value="bookingInfo">Booking Info</Tabs.Trigger>
        <Tabs.Trigger value="scheduleInfo">Schedule Info</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="userInfo">
        <ProfileInfo userId={id} />
      </Tabs.Content>
      <Tabs.Content value="bookingInfo">
        <BookingInfo userId={id} />
      </Tabs.Content>
      <Tabs.Content value="scheduleInfo">
        <ScheduleInfo userId={id} />
      </Tabs.Content>
    </Tabs.Root>
  );
}

//README: Component for profiles table
const ProfileInfo = ({ userId }: { userId: string }) => {
  const { data } = fetchProfilesWithId(userId);

  return (
    <div>
      {data?.map((user) => (
        <div key={user.id}>
          <p>Name: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      ))}
    </div>
  );
};

//README: components for booked_rooms table
const BookingInfo = ({ userId }: { userId: string }) => {
  const {
    data: bookingInfo,
    isLoading,
    error,
  } = fetchBookedRoomsWithUserId(userId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {bookingInfo?.map((booking) => (
        <div key={booking.id}>
          <p>Room: {booking.rooms?.room_name}</p>
          <p>Date: {booking.date}</p>
        </div>
      ))}
    </div>
  );
};

//README: components for schedule table
const ScheduleInfo = ({ userId }: { userId: string }) => {
  const { data } = fetchScheduleWithUserId(userId);

  return (
    <div>
      {data?.map((schedule) => (
        <div key={schedule.id}>
          <p>Subject Code: {schedule.subject?.subject_code}</p>
          <p>Date: {schedule.date}</p>
        </div>
      ))}
    </div>
  );
};
