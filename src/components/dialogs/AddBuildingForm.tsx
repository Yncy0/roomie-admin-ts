import { useState } from 'react'
import { buildings } from '@/assets/dummy/building'  // Assuming buildings are imported from a dummy data file
import '@/styles/building.css'

interface AddBuildingFormProps {
  onSubmit: (formData: { buildingName: string; floors: string; numberOfRooms: string }) => void
  onClose: () => void
}

const AddBuildingForm: React.FC<AddBuildingFormProps> = ({ onSubmit, onClose }) => {
  const [buildingName, setBuildingName] = useState<string>('')  // Default to empty string
  const [floors, setFloors] = useState<string>('1')  // Default to 1
  const [numberOfRooms, setNumberOfRooms] = useState<string>('1')  // Default to 1

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!buildingName || !floors || !numberOfRooms) {
      alert('Please fill out all fields.')
      return
    }

    // Ensure floors and rooms are valid integers
    const parsedFloors = parseInt(floors)
    const parsedRooms = parseInt(numberOfRooms)

    if (isNaN(parsedFloors) || parsedFloors <= 0 || isNaN(parsedRooms) || parsedRooms <= 0) {
      alert('Please enter valid numbers for floors and rooms.')
      return
    }

    // Create new building object
    const newBuilding = {
      name: buildingName,
      imageUrl: 'https://via.placeholder.com/150',  // Placeholder image, modify as needed
      floors: parsedFloors,
      rooms: parsedRooms
    }

    // Add new building to the dummy data (or state management)
    buildings.push(newBuilding)
    console.log('Updated buildings:', buildings)

    // Pass data to parent onSubmit
    onSubmit({ buildingName, floors, numberOfRooms })
    onClose()  // Close the modal after submission
  }

  const handleCancel = () => {
    onClose()  // Close modal without submitting
  }

  return (
    <form onSubmit={handleFormSubmit} className="add-building-form">
      <div>
        <label htmlFor="buildingName">Building Name</label>
        <input
          id="buildingName"
          type="text"
          value={buildingName}
          onChange={(e) => setBuildingName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="floors">Floors</label>
        <select
          id="floors"
          value={floors}
          onChange={(e) => setFloors(e.target.value)}
          required
        >
          {[...Array(10).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="numberOfRooms">Number of Rooms</label>
        <select
          id="numberOfRooms"
          value={numberOfRooms}
          onChange={(e) => setNumberOfRooms(e.target.value)}
          required
        >
          {[...Array(20).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Separate div for form actions */}
      <div className="form-actions">
        <div className="button-container">
          <button type="submit">Submit</button>
        </div>
        <div className="button-container">
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}

export default AddBuildingForm
