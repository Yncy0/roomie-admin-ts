import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, Button, Dialog } from "@radix-ui/themes";
import { fetchProfiles } from "@/hooks/queries/profiles/useFetchProfiles";
import ProfileEditDialog from "@/components/dialogs/ProfileEditDialog";
import ProfileDeleteDialog from "@/components/dialogs/ProfileDeleteDialog";

export const Route = createLazyFileRoute("/users")({
  component: Users,
});

function Users() {
  const { data, error } = fetchProfiles();

  return (
    <div className="min-w-full gap-7 flex flex-col">
      <h1 className="text-center">Users List</h1>
      <div>
        <div>
          <Button>Add</Button>
        </div>
      </div>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Avatar</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Mobile Number</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>User Role</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>User Department</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Options</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.map((items, index) => (
            <Table.Row key={index}>
              <Table.Cell>{items.avatar_url}</Table.Cell>
              <Table.Cell>{items.username}</Table.Cell>
              <Table.Cell>{items.mobile_number}</Table.Cell>
              <Table.Cell>{items.email}</Table.Cell>
              <Table.Cell>{items.user_role}</Table.Cell>
              <Table.Cell>{items.user_department}</Table.Cell>
              <Table.Cell>
                <div className="flex flex-row gap-2">
                  <Dialog.Root>
                    <ProfileEditDialog items={items} />
                  </Dialog.Root>
                  <Dialog.Root>
                    <ProfileDeleteDialog />
                  </Dialog.Root>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
