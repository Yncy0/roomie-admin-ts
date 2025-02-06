"use client"

import type React from "react"
import { useState } from "react"
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router"
import "@/styles/roomsAdd.css"
import imagePlaceholder from "@/assets/dummy/image-placeholder.png"
import Input from "@/components/Input"
import BuildingSelect from "@/components/selector/BuildingSelect"
import RoomDescriptionSelect from "@/components/selector/RoomDescriptionSelect"
import { insertBacklogs } from "@/hooks/queries/backlogs/useInsertBacklogs"
import { insertRooms } from "@/hooks/queries/rooms/useInsertRooms"
import { isRoomNameExists } from "@/utils/isRoomExist"
import Alert from "@/components/Alert"

export const Route = createLazyFileRoute("/rooms_add")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [room_name, setRoomName] = useState("")
  const [room_type, setRoomType] = useState("")
  const [room_capacity, setRoomCapacity] = useState(0)
  const [room_location, setRoomLocation] = useState("")
  const [room_image, setRoomImage] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error" | "info" | "warning">("info")

  const handleRoomCapacityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const numberValue = Number.parseInt(value, 10)
    if (!isNaN(numberValue) && numberValue <= 100) {
      setRoomCapacity(numberValue)
    } else if (value === "") {
      setRoomCapacity(0)
    }
  }
  
  

  const onHandleInsert = async () => {
    try {
      const roomExists = await isRoomNameExists(room_name)
      if (roomExists) {
        setAlertType("error")
        setAlertMessage("Room name already exists. Please choose a different name.")
        setShowAlert(true)
        return
      }

      await insertRooms(room_name, room_image, room_type, room_capacity, room_location)
      await insertBacklogs("INSERT", `The new ${room_name} has been added`)

      setAlertType("success")
      setAlertMessage("Room created successfully")
      setShowAlert(true)

      setTimeout(() => {
        navigate({ to: "/rooms" })
      }, 3000)
    } catch (err) {
      console.error("Unexpected error:", err)
      setAlertType("error")
      setAlertMessage("An error occurred. Please try again.")
      setShowAlert(true)
    }
  }

  return (
    <div className="rooms-add-container">
      {showAlert && (
        <Alert type={alertType} message={alertMessage} duration={3000} onClose={() => setShowAlert(false)} />
      )}
      <h1 className="rooms-add-title">Create New Room</h1>

      {/* Image Preview */}
      <div className="image-preview-container">
      <img src={room_image || imagePlaceholder} alt="Room Preview" className="image-preview" />
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
        className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
        onChange={(e) => {
          const file = e.target.files?.[0]
        if (file) {
          setRoomImage(URL.createObjectURL(file))
        }
      }}
      />
    </div>


      {/* Room Name */}
      <Input
        id="roomName"
        htmlFor="roomName"
        placeholder=""
        value={room_name}
        onChange={(e) => setRoomName(e.target.value)}
        label="Room Name"
        type="text"
      />

      {/* Room Capacity */}
      <div className="inputGroup">
        <label htmlFor="roomCapacity">Room Capacity</label>
        <select
          id="roomCapacity"
          value={room_capacity}
          onChange={handleRoomCapacityChange}
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
        <button onClick={() => navigate({ to: "/rooms" })} className="cancel-button">
          Cancel
        </button>
        <button onClick={onHandleInsert} className="create-button">
          Create
        </button>
      </div>
    </div>
  )
}

export default RouteComponent

