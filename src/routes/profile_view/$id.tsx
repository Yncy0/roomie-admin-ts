import { fetchBookedRoomsWithUserId } from "@/hooks/queries/booking/useFetchBookedRooms";
import { fetchProfilesWithId } from "@/hooks/queries/profiles/useFetchProfiles";
import { fetchScheduleWithUserId } from "@/hooks/queries/schedule/useFetchSchedule";
import { Table, Tabs } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Tables } from "database.types";
import dayjs from "dayjs";
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
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Field</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row>
          <Table.Cell>ID:</Table.Cell>
          <Table.Cell>{data?.id}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Username:</Table.Cell>
          <Table.Cell>{data?.username}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Full name:</Table.Cell>
          <Table.Cell>{data?.full_name}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Email:</Table.Cell>
          <Table.Cell>{data?.email}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Mobile Number:</Table.Cell>
          <Table.Cell>{data?.mobile_number}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Department</Table.Cell>
          <Table.Cell>{data?.user_department}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>User Role:</Table.Cell>
          <Table.Cell>{data?.user_role}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
};

//README: components for booked_rooms table
const BookingInfo = ({ userId }: { userId: string }) => {
  const { data, isLoading, error } = fetchBookedRoomsWithUserId(userId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Room Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Subject Code</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Section</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {data?.map((items, index) => (
          <Table.Row key={index}>
            <Table.Cell>{items.rooms?.room_name}</Table.Cell>
            <Table.Cell>{items.subject_code}</Table.Cell>
            <Table.Cell>{items.course_and_section}</Table.Cell>
            <Table.Cell>{items.date}</Table.Cell>
            <Table.Cell>
              {dayjs(items.time_in).format("hh:mm a")} -{" "}
              {dayjs(items.time_out).format("hh:mm a")}
            </Table.Cell>
            <Table.Cell>{items.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

//README: components for schedule table
const ScheduleInfo = ({ userId }: { userId: string }) => {
  const { data } = fetchScheduleWithUserId(userId);

  return (
    <Table.Root>
      <Table.Header>
        <Table.ColumnHeaderCell>Room Name</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Subject Code</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Section</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Weekday</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Time</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
      </Table.Header>
      <Table.Body>
        {data?.map((items, index) => (
          <Table.Row key={index}>
            <Table.Cell>{items.rooms?.room_name}</Table.Cell>
            <Table.Cell>{items.subject?.subject_code}</Table.Cell>
            <Table.Cell>{items.course?.course_name}</Table.Cell>
            <Table.Cell>{items.days}</Table.Cell>
            <Table.Cell>
              {items.timef_in} - {items.timef_out}
            </Table.Cell>
            <Table.Cell>{items.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
