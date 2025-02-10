"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import Input from "@/components/Input"
import BuildingSelect from "@/components/selector/BuildingSelect"
import RoomDescriptionSelect from "@/components/selector/RoomDescriptionSelect"
import Alert from "@/components/Alert"
import { insertBacklogs } from "@/hooks/queries/backlogs/useInsertBacklogs"
import { fetchRoomsWithId } from "@/hooks/queries/rooms/useFetchRooms"
import { updateRooms } from "@/hooks/queries/rooms/useUpdateRooms"
import "@/styles/Rooms/roomsAdd.css"

export const Route = createFileRoute("/room_edit/$id")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      id: params.id,
    }
  },
})

function RouteComponent() {
  const { id } = Route.useLoaderData()
  const navigate = useNavigate()

  const { data } = fetchRoomsWithId(id)

  const [roomName, setRoomName] = useState("")
  const [roomLocation, setRoomLocation] = useState("")
  const [roomCapacity, setRoomCapacity] = useState(0)
  const [roomType, setRoomType] = useState("")
  const [roomImage, setRoomImage] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  useEffect(() => {
    if (data) {
      setRoomName(data.room_name || "")
      setRoomLocation(data.location || "")
      setRoomCapacity(data.room_capacity || 0)
      setRoomType(data.room_type || "")
      setRoomImage(data.room_image || "")
    }
  }, [data])

  const handleRoomCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numberValue = Number.parseInt(value, 10)
    if (!isNaN(numberValue) && numberValue <= 100) {
      setRoomCapacity(numberValue)
    }
  }

  const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Add space after "SA" followed by numbers
    let formattedValue = value.replace(/(sa|mr|pp)(\d{1,})/gi, (match, prefix, numbers) => {
      return `${prefix.toUpperCase()} ${numbers}`;
    });

    // Add space between camelCase words
    formattedValue = formattedValue.replace(/([a-z])([A-Z])/g, '$1 $2');

    setRoomName(formattedValue);
  };

  const onHandleUpdate = async () => {
    try {
      await updateRooms(id, roomName, roomImage, roomType, roomCapacity, roomLocation)
      setAlertMessage("Room updated successfully")
      setShowAlert(true)

      await insertBacklogs("UPDATE", `The room ${roomName} has been edited`)
      setTimeout(() => {
        setShowAlert(false)
        navigate({ to: "/rooms" })
      }, 3000)
    } catch (error) {
      console.error("Error updating room:", error)
      setAlertMessage("Error saving data. Please try again.")
      setShowAlert(true)
    }
  }

  return (
    <div className="rooms-add-container">
      {showAlert && (
        <Alert
          type={alertMessage.includes("Error") ? "error" : "success"}
          message={alertMessage}
          duration={3000}
          onClose={() => setShowAlert(false)}
        />
      )}
      <h1 className="rooms-add-title">Editing {roomName}</h1>

      {/* Image Preview */}
      <div className="image-preview-container">
        <img
          src={roomImage || "/assets/dummy/image-placeholder.png"}
          alt="Room Preview"
          className="object-cover w-80"
        />
      </div>

      {/* Image File Input */}
      <div className="inputGroup">
        <label htmlFor="imageInput" className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Upload Image
        </label>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              setRoomImage(URL.createObjectURL(file))
            }
          }}
          className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
        />
      </div>
      
      {/* Room Name */}
      <Input
        id="roomName"
        htmlFor="roomName"
        placeholder=""
        value={roomName}
        onChange={handleRoomNameChange}
        label="Room Name"
        type="text"
      />

      {/* Room Capacity */}
      <div className="inputGroup">
        <label htmlFor="roomCapacity">Room Capacity</label>
        <select
          id="roomCapacity"
          value={roomCapacity}
          onChange={(e) => setRoomCapacity(Number(e.target.value))}
        >
          {[...Array(100).keys()].map((_, index) => {
            const value = index + 1
            return (
              <option key={value} value={value}>
              {value}
             </option>
            )
          })}
        </select>
      </div>


      {/* Room Details Row */}
      <div className="inputRow">
        {/* Room Description */}
        <div className="inputGroup">
          <label htmlFor="roomDescription">Room Description</label>
          <RoomDescriptionSelect setDescription={setRoomType} />
        </div>

        {/* Room Location */}
      <div className="inputGroup">
      <label htmlFor="roomLocation">Room Location</label>
        <BuildingSelect setBuilding={setRoomLocation} />
      </div>
      </div>

      {/* Buttons */}
      <div className="button-container">
        <button
          onClick={() => navigate({ to: "/rooms" })}
          className="cancel-button"
        >
          Cancel
        </button>
        <button
          onClick={onHandleUpdate}
          className="create-button"
        >
          Save Changes
        </button>
      </div>
      </div>
  )
}

