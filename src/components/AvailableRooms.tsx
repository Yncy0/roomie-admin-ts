// src/components/AvailableRooms.tsx

import React from "react"
import { fetchAvailableBookedRooms } from "@/hooks/queries/booking/fetchAvailableBookedRooms"

const AvailableRooms: React.FC = () => {
  const { data, isLoading, isError } = fetchAvailableBookedRooms()

  if (isLoading) return <p>Loading available rooms...</p>
  if (isError) return <p>Error fetching room data.</p>

  // Group available rooms by building
  const availableRoomsByBuilding = data
    ? data.allRooms.reduce((acc, room) => {
        // Check if the room is available (not booked)
        if (!data.bookedRooms.some((bookedRoom) => bookedRoom.room_id === room.id)) {
          const building = room.building || "Unknown Building"  // Fallback to "Unknown Building" if no building info

          if (!acc[building]) {
            acc[building] = []
          }
          acc[building].push(room.room_name || "Unknown Room")  // Fallback to "Unknown Room" if no room name
        }
        return acc
      }, {} as Record<string, string[]>)
    : {}

  // Get the list of building names (sorted)
  const buildings = Object.keys(availableRoomsByBuilding)

  return (
    <div className="chart-box">
      <h3 className="text-lg font-semibold mb-2">Available Rooms</h3>
      {buildings.length > 0 ? (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              {/* Header cells for each building */}
              {buildings.map((building) => (
                <th key={building} className="px-4 py-2">{building}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* Render available rooms under each building header */}
              {buildings.map((building) => (
                <td key={building} className="border px-4 py-2">
                  <ul>
                    {availableRoomsByBuilding[building].map((room, index) => (
                      <li key={index}>{room}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="no-available-rooms">❌ No rooms available at the moment.</p>
      )}
    </div>
  )
}

export default AvailableRooms
