import { useEffect, useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import Input from "@/components/Input"
import Alert from "@/components/Alert"
import { insertBacklogs } from "@/hooks/queries/backlogs/useInsertBacklogs"
import { fetchBuildingsWithId } from "@/hooks/queries/buildings/useFetchBuildings"
import { updateBuilding } from "@/hooks/queries/buildings/useUpdateBuilding"
import "@/styles/Buildings/buildingAdd.css"

export const Route = createFileRoute("/building_edit/$id")({
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
  const [buildingName, setBuildingName] = useState("")
  const [buildingImage, setBuildingImage] = useState("")
  const [numOfRooms, setNumOfRooms] = useState(0)
  const [numOfFloors, setNumOfFloors] = useState(0)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const { data } = fetchBuildingsWithId(id)

  useEffect(() => {
    if (data) {
      setBuildingName(data.building_name || "")
      setBuildingImage(data.building_image || "")
      setNumOfFloors(data.num_of_floors || 0)
      setNumOfRooms(data.num_of_rooms || 0)
    }
  }, [data])

  const onHandleUpdate = async () => {
    try {
      await updateBuilding(id, buildingName, buildingImage, numOfRooms, numOfFloors)
      setAlertMessage("Building updated successfully")
      setShowAlert(true)

      await insertBacklogs("UPDATE", `The building ${buildingName} has been edited`)
      setTimeout(() => {
        setShowAlert(false)
        navigate({ to: "/building" })
      }, 3000)
    } catch (error) {
      console.error("Error updating building:", error)
      setAlertMessage("Error saving data. Please try again.")
      setShowAlert(true)
    }
  }

  return (
    <div className="building-add-container">
      {showAlert && (
        <Alert
          type={alertMessage.includes("Error") ? "error" : "success"}
          message={alertMessage}
          duration={3000}
          onClose={() => setShowAlert(false)}
        />
      )}
      <h1 className="building-add-title">Editing {buildingName}</h1>

      {/* Image Preview */}
      <div className="image-preview-container">
        <img
          src={buildingImage || "/assets/dummy/image-placeholder.png"}
          alt="Building Preview"
          className="object-cover w-64 h-64"
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
              setBuildingImage(URL.createObjectURL(file))
            }
          }}
          className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-400 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
        />
      </div>

      {/* Building Name */}
      <Input
        id="buildingName"
        htmlFor="buildingName"
        placeholder=""
        value={buildingName}
        onChange={(e) => setBuildingName(e.target.value)}
        label="Building Name"
        type="text"
      />

      {/* Room Settings Row */}
      <div className="inputRow">
        {/* Number of Rooms */}
        <div className="inputGroup">
          <label htmlFor="numOfRooms" className="block font-bold mb-2">
            Number of Rooms
          </label>
          <select
            id="numOfRooms"
            value={numOfRooms}
            onChange={(e) => setNumOfRooms(Number.parseInt(e.target.value, 10))}
            className="w-full p-2 rounded-md border-2 border-[#35487a] bg-transparent text-base"
          >
            <option value="">Select</option>
            {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="inputGroup">
          <label htmlFor="numOfFloors" className="block font-bold mb-2">
            Number of Floors
          </label>
          <select
            id="numOfFloors"
            value={numOfFloors}
            onChange={(e) => setNumOfFloors(Number.parseInt(e.target.value, 10))}
            className="w-full p-2 rounded-md border-2 border-[#35487a] bg-transparent text-base"
          >
            <option value="">Select</option>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="button-container">
        <button
          onClick={() => navigate({ to: "/building" })}
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

