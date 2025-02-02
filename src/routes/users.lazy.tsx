import { createLazyFileRoute } from "@tanstack/react-router";
import { Table, Dialog } from "@radix-ui/themes";
import { fetchProfiles } from "@/hooks/queries/profiles/useFetchProfiles";
import ProfileEditDialog from "@/components/dialogs/ProfileEditDialog";
import ProfileDeleteDialog from "@/components/dialogs/ProfileDeleteDialog";
import * as Avatar from "@radix-ui/react-avatar";
import PaginationControls from "@/components/PaginationControls";
import { MagnifyingGlassIcon, PersonIcon, HomeIcon } from "@radix-ui/react-icons";
// Alternative: Use Heroicons for a better building icon
// import { BuildingOfficeIcon } from "@heroicons/react/24/solid";
import { useState, useMemo } from "react";
import "../styles/user.css";

export const Route = createLazyFileRoute("/users")({
  component: Users,
});

function Users() {
  const { data, error } = fetchProfiles();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const pageSize = 5;

  if (error) return <div className="error-message">Error: {error.message}</div>;

  const filteredData = useMemo(() => {
    return (data || []).filter((item) => {
      const matchesSearch = searchQuery
        ? Object.values(item).some((value) =>
            value?.toString().toLowerCase().startsWith(searchQuery.toLowerCase())
          )
        : true;

      const matchesRole = selectedRole ? item.user_role?.toLowerCase() === selectedRole.toLowerCase() : true;
      const matchesDepartment = selectedDepartment
        ? item.user_department?.toLowerCase() === selectedDepartment.toLowerCase()
        : true;

      return matchesSearch && matchesRole && matchesDepartment;
    });
  }, [data, searchQuery, selectedRole, selectedDepartment]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const handlePagination = (action: string) => {
    if (action === "first") setCurrentPage(0);
    if (action === "prev" && currentPage > 0) setCurrentPage(currentPage - 1);
    if (action === "next" && currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    if (action === "last") setCurrentPage(totalPages - 1);
  };

  return (
    <div className="users-container">
      <h1 className="users-title">Users List</h1>

      {/* Search, Filter, and Add User Button */}
      <div className="filters-container">
        <div className="filter-items">
          {/* Search Input with Icon */}
          <div className="search-input-container">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Role Selection with Icon */}
          <div className="role-select-container">
            <PersonIcon className="role-icon" />
            <select
              className="role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Role</option>
              <option value="Admin">Admin</option>
              <option value="Student">Student</option>
              <option value="Professor">Professor</option>
            </select>
          </div>

          {/* Department Selection with Icon */}
          <div className="department-select-container">
            <HomeIcon className="department-icon" />
            <select
              className="department-select"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">Department/Faculty</option>
              <option value="CITE">CITE</option>
              <option value="CBEA">CBEA</option>
              <option value="CASE">CASE</option>
            </select>
          </div>
        </div>

        {/* "Add User" Button */}
        <button className="add-user-button">
          Add User
        </button>
      </div>

      {/* Table */}
      <Table.Root className="table">
        <Table.Header className="table-header">
          <Table.Row>
            <Table.ColumnHeaderCell className="table-column-header-cell">Avatar</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">Username</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">Mobile Number</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">Role</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">Department/Faculty</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">Edit</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="table-column-header-cell">Delete</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {paginatedData.map((item, index) => (
            <Table.Row key={index} className="table-row">
              <Table.Cell className="avatar-cell">
                <Avatar.Root>
                  <Avatar.Image
                    src={item.avatar_url || "/path/to/default-avatar.png"}
                    alt="Avatar"
                    className="avatar-img"
                  />
                  <Avatar.Fallback className="avatar-fallback">
                    {item.username?.[0] || "U"}
                  </Avatar.Fallback>
                </Avatar.Root>
              </Table.Cell>
              <Table.Cell className="table-cell">{item.username}</Table.Cell>
              <Table.Cell className="table-cell">{item.mobile_number}</Table.Cell>
              <Table.Cell className="table-cell">{item.email}</Table.Cell>
              <Table.Cell className="table-cell">{item.user_role}</Table.Cell>
              <Table.Cell className="table-cell">{item.user_department}</Table.Cell>
              <Table.Cell className="table-cell">
                <Dialog.Root>
                  <ProfileEditDialog items={item} />
                </Dialog.Root>
              </Table.Cell>
              <Table.Cell className="table-cell">
                <Dialog.Root>
                  <ProfileDeleteDialog />
                </Dialog.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      {/* Pagination Controls */}
      <PaginationControls currentPage={currentPage} totalPages={totalPages} handlePagination={handlePagination} />
    </div>
  );
}

export default Users;