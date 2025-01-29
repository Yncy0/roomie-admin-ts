import { createLazyFileRoute } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import supabase from "@/utils/supabase";

export const Route = createLazyFileRoute("/archive")({
  component: Archive,
});

function Archive() {
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [archivedRooms, setArchivedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [currentPageRooms, setCurrentPageRooms] = useState(1);
  const itemsPerPage = 5;

  const paginateData = (data: any, page: any) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const handleFirstPage = (setPage: any) => setPage(1);
  const handleLastPage = (data: any, setPage: any) =>
    setPage(Math.ceil(data.length / itemsPerPage));
  const handleNextPage = (data: any, setPage: any) =>
    setPage((prev: any) =>
      prev < Math.ceil(data.length / itemsPerPage) ? prev + 1 : prev
    );
  const handlePreviousPage = (setPage: any) =>
    setPage((prev: any) => (prev > 1 ? prev - 1 : prev));

  if (loading) {
    return (
      <div className="dot-spinner">
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
      </div>
    );
  }

  // Check if there's data to display, for conditionally rendering pagination
  const hasArchivedUsers = archivedUsers.length > 0;
  const hasArchivedRooms = archivedRooms.length > 0;

  return (
    <div className="flex flex-col mx-4 sm:mx-6 md:mx-20 mt-6 gap-8 text-[#102b53]">
      <h1 className="text-2xl font-bold">Archives</h1>

      {/* Archived Users */}
      <div className="relative border-2 text-e7eae5 font-nunito p-[1.5em] flex justify-center items-start flex-col gap-[1em] rounded-[20px] bg-gradient-to-br from-white to-[#f8f8ff]">
        <h2 className="text-xl font-bold mb-4">Archived Users</h2>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : archivedUsers.length > 0 ? (
          <>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {paginateData(archivedUsers, currentPageUsers).map(
                  (user: any, index: any) => (
                    <tr
                      key={user.id}
                      className={
                        index < archivedUsers.length - 1 ? "border-b" : ""
                      }
                    >
                      <td className="px-4 py-2 text-gray-500">
                        {user.full_name}
                      </td>
                      <td className="px-4 py-2 text-gray-500">{user.email}</td>
                      <td className="px-4 py-2 text-gray-500">
                        {user.user_role}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <div className="flex justify-end items-center mt-4 gap-2">
              <button
                onClick={() => handleFirstPage(setCurrentPageUsers)}
                className="p-2 bg-blue-500 text-white rounded-lg "
                disabled={currentPageUsers === 1}
              >
                <ChevronsLeft size={18} />
              </button>
              <button
                onClick={() => handlePreviousPage(setCurrentPageUsers)}
                className="p-2 bg-blue-500 text-white rounded-lg "
                disabled={currentPageUsers === 1}
              >
                <ChevronLeft size={18} />
              </button>
              <p className="mx-2">
                Page {currentPageUsers} of{" "}
                {Math.ceil(archivedUsers.length / itemsPerPage)}
              </p>
              <button
                onClick={() =>
                  handleNextPage(archivedUsers, setCurrentPageUsers)
                }
                className="p-2 bg-blue-500 text-white rounded-lg "
                disabled={
                  currentPageUsers ===
                  Math.ceil(archivedUsers.length / itemsPerPage)
                }
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() =>
                  handleLastPage(archivedUsers, setCurrentPageUsers)
                }
                className="p-2 bg-blue-500 text-white rounded-lg "
                disabled={
                  currentPageUsers ===
                  Math.ceil(archivedUsers.length / itemsPerPage)
                }
              >
                <ChevronsRight size={18} />
              </button>
            </div>
          </>
        ) : (
          <p>No archived users found.</p>
        )}
      </div>

      {/* Archived Rooms */}
      <div className="relative border-2 text-e7eae5 font-nunito p-[1.5em] flex justify-center items-start flex-col gap-[1em] rounded-[20px] bg-gradient-to-br from-white to-[#f8f8ff]">
        <h2 className="text-xl font-bold mb-4">Archived Rooms</h2>
        {archivedRooms.length > 0 ? (
          <>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Room Name</th>
                  <th className="px-4 py-2 text-left">Room Type</th>
                  <th className="px-4 py-2 text-left">Capacity</th>
                </tr>
              </thead>
              <tbody>
                {paginateData(archivedRooms, currentPageRooms).map(
                  (room: any, index: any) => (
                    <tr
                      key={room.id}
                      className={
                        index < archivedRooms.length - 1 ? "border-b" : ""
                      }
                    >
                      <td className="px-4 py-2 text-gray-500">
                        {room.room_name}
                      </td>
                      <td className="px-4 py-2 text-gray-500">
                        {room.room_type}
                      </td>
                      <td className="px-4 py-2 text-gray-500">
                        {room.room_capacity}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            {/* Pagination Controls for Archived Rooms */}
            <div className="flex justify-start items-center mt-4 gap-2">
              {hasArchivedRooms && (
                <>
                  <button
                    onClick={() => handleFirstPage(setCurrentPageRooms)}
                    className="p-2 bg-blue-500 text-white rounded-lg "
                    disabled={currentPageRooms === 1}
                  >
                    <ChevronsLeft size={18} />
                  </button>
                  <button
                    onClick={() => handlePreviousPage(setCurrentPageRooms)}
                    className="p-2 bg-blue-500 text-white rounded-lg "
                    disabled={currentPageRooms === 1}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <p className="mx-2">
                    Page {currentPageRooms} of{" "}
                    {Math.ceil(archivedRooms.length / itemsPerPage)}
                  </p>
                  <button
                    onClick={() =>
                      handleNextPage(archivedRooms, setCurrentPageRooms)
                    }
                    className="p-2 bg-blue-500 text-white rounded-lg "
                    disabled={
                      currentPageRooms ===
                      Math.ceil(archivedRooms.length / itemsPerPage)
                    }
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={() =>
                      handleLastPage(archivedRooms, setCurrentPageRooms)
                    }
                    className="p-2 bg-blue-500 text-white rounded-lg"
                    disabled={
                      currentPageRooms ===
                      Math.ceil(archivedRooms.length / itemsPerPage)
                    }
                  >
                    <ChevronsRight size={18} />
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <p>No archived rooms found.</p>
        )}
      </div>
    </div>
  );
}
