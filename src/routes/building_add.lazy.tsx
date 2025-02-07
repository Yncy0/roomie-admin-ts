import type React from "react"
import { useState } from "react"
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router"
import "@/styles/Buildings/buildingAdd.css"
import imagePlaceholder from "@/assets/dummy/image-placeholder.png"
import Input from "@/components/Input"
import { insertBacklogs } from "@/hooks/queries/backlogs/useInsertBacklogs"
import { insertBuilding } from "@/hooks/queries/buildings/useInsertBuilding"
import { isBuildingNameExists } from "@/utils/isBuildingExist"
import Alert from "@/components/Alert"

export const Route = createLazyFileRoute("/building_add")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [building_name, setBuildingName] = useState("")
  const [building_image, setBuildingImage] = useState("")
  const [num_of_rooms, setNumOfRooms] = useState(1)
  const [num_of_floors, setNumOfFloors] = useState(1)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error" | "info" | "warning">("info")

  const handleNumOfRoomsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumOfRooms(Number(e.target.value))
  }

  const handleNumOfFloorsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumOfFloors(Number(e.target.value))
  }

  const onHandleInsert = async () => {
    try {
      const buildingExists = await isBuildingNameExists(building_name)
      if (buildingExists) {
        setAlertType("error")
        setAlertMessage("Building name already exists. Please choose a different name.")
        setShowAlert(true)
        return
      }

      await insertBuilding(building_name, building_image, num_of_rooms, num_of_floors)
      await insertBacklogs("INSERT", `The new building ${building_name} has been added`)

      setAlertType("success")
      setAlertMessage("Building created successfully")
      setShowAlert(true)

      setTimeout(() => {
        navigate({ to: "/building" })
      }, 3000)
    } catch (err) {
      console.error("Unexpected error:", err)
      setAlertType("error")
      setAlertMessage("An error occurred. Please try again.")
      setShowAlert(true)
    }
  }

  return (
    <div className="building-add-container">
      {showAlert && (
        <Alert type={alertType} message={alertMessage} duration={3000} onClose={() => setShowAlert(false)} />
      )}
      <h1 className="building-add-title">Create New Building</h1>

      {/* Image Preview */}
      <div className="image-preview-container">
        <img src={building_image || imagePlaceholder} alt="Building Preview" className="image-preview" />
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
              setBuildingImage(URL.createObjectURL(file))
            }
          }}
        />
      </div>

      {/* Building Name */}
      <Input
        id="buildingName"
        htmlFor="buildingName"
        placeholder=""
        value={building_name}
        onChange={(e) => setBuildingName(e.target.value)}
        label="Building Name"
        type="text"
      />

      {/* Room Settings Row */}
      <div className="inputRow">
      {/* Number of Rooms */}
        <div className="inputGroup">
          <label htmlFor="numOfRooms">Number of Rooms</label>
          <select
            id="numOfRooms"
            value={num_of_rooms}
            onChange={handleNumOfRoomsChange}
          >
            {[...Array(50).keys()].map((_, index) => {
            const value = index + 1
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              )
            })}
          </select>
        </div>

  {/* Number of Floors */}
  <div className="inputGroup">
    <label htmlFor="numOfFloors">Number of Floors</label>
    <select
      id="numOfFloors"
      value={num_of_floors}
      onChange={handleNumOfFloorsChange}
    >
      {[...Array(50).keys()].map((_, index) => {
        const value = index + 1
        return (
          <option key={value} value={value}>
            {value}
          </option>
        )
      })}
    </select>
  </div>
</div>


      {/* Buttons */}
      <div className="button-container">
        <button onClick={() => navigate({ to: "/building" })} className="cancel-button">
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
