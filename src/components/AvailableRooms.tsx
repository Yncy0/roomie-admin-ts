import React from "react"
import { fetchAvailableBookedRooms } from "@/hooks/queries/booking/fetchAvailableBookedRooms"
import '@/styles/Dashboard/AvailableRooms.css' // Import the CSS file here

interface Room {
  id: number
  room_name: string
  building: string
}

const AvailableRooms: React.FC = () => {
  const { data, isLoading, isError } = fetchAvailableBookedRooms()

  if (isLoading) return <p>Loading available rooms...</p>
  if (isError) return <p>Error fetching room data.</p>
  if (!data || !data.availableRooms) return <p>No room data available.</p>

  const availableRoomsByBuilding = data.availableRooms.reduce(
    (acc, room: Room) => {
      if (!acc[room.building]) acc[room.building] = []
      acc[room.building].push(room.room_name)
      return acc
    },
    {} as Record<string, string[]>,
  )

  const buildings = Object.keys(availableRoomsByBuilding).sort()

  const splitIntoColumns = (rooms: string[], columnsPerRow: number) => {
    const rows = []
    for (let i = 0; i < rooms.length; i += columnsPerRow) {
      rows.push(rooms.slice(i, i + columnsPerRow))
    }
    return rows
  }

  return (
    <div className="chart-box">
      <h3 className="text-lg font-semibold mb-2">Available Rooms</h3>
      {buildings.length > 0 ? (
        <div className="columns-wrapper">
          {buildings.map((building) => {
            const rooms = availableRoomsByBuilding[building]
            const columns = splitIntoColumns(rooms, 4) // Split rooms into 4 columns per row

            return (
              <div key={building} className="building-column">
                <h4 className="font-semibold mb-2">{building}</h4>
                {columns.map((column, index) => (
                  <ul key={index}>
                    {column.map((room, idx) => (
                      <li key={idx}>{room}</li>
                    ))}
                  </ul>
                ))}
              </div>
            )
          })}
        </div>
      ) : (
        <p className="no-available-rooms">❌ No rooms available at the moment.</p>
      )}
    </div>
  )
}

export default AvailableRooms
