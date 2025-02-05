import Input from "@/components/Input";
import { insertBacklogs } from "@/hooks/queries/backlogs/useInsertBacklogs";
import { insertBuilding } from "@/hooks/queries/buildings/useInsertBuilding";
import { isBuildingNameExists } from "@/utils/isBuildingExist";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";

export const Route = createLazyFileRoute("/building_add")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [buildingName, setBuildingName] = React.useState("");
  const [buildingImage, setBuildingImage] = React.useState("");
  const [numOfRooms, setNumOfRooms] = React.useState(0);
  const [numOfFloors, setNumOfFloors] = React.useState(0);

  const handleNumOfRoomsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumOfRooms(Number(e.target.value));
  };

  const handleNumOfFloorsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumOfFloors(Number(e.target.value));
  };

  const onHandleInsert = async () => {
    try {
      // Validate if the building name already exists
      const buildingExists = await isBuildingNameExists(buildingName);

      if (buildingExists) {
        alert("Building name already exists. Please choose a different name.");
        return;
      }

      // Insert new building if the building name doesn't exist
      await insertBuilding(buildingName, buildingImage, numOfRooms, numOfFloors);
      // Log the insertion in the backlogs
      await insertBacklogs("INSERT", `The new ${buildingName} has been added`);

      // Notify the user and navigate to the buildings page
      alert("Data saved successfully");
      navigate({ to: "/building" });
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-10 bg-white flex flex-col gap-7">
      <h1 className="text-center font-bold text-xl pb-8">Create New Building</h1>

      {/* Image Preview */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src={buildingImage ? buildingImage : "src/assets/dummy/image-placeholder.png"}
          alt="Room Preview"
          style={{ objectFit: "cover", width: "16rem" }}
        />
      </div>

      {/* Image File Input */}
      <div className="inputGroup" style={{ fontFamily: "'Segoe UI', sans-serif", position: "relative" }}>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setBuildingImage(
              e.target.files && e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : ""
            )
          }
          style={{
            fontSize: "100%",
            padding: "30px",
            outline: "none",
            border: "2px solid #35487a",
            backgroundColor: "transparent",
            borderRadius: "20px",
            width: "100%",
          }}
        />
        <label
          htmlFor="imageInput"
          style={{
            fontSize: "100%",
            position: "absolute",
            left: "0",
            padding: "0.8em",
            marginLeft: "0.5em",
            pointerEvents: "none",
            transition: "all 0.3s ease",
            color: "#35487a",
          }}
        >
          Upload Image
        </label>
      </div>

      <Input
        id="buildingName"
        htmlFor="buildingName"
        placeholder=""
        value={buildingName}
        onChange={(e) => setBuildingName(e.target.value)}
        label="Building Name"
        type={"text"}
      />

      <div className="flex gap-6">
        {/* Number of Rooms Dropdown */}
        <div className="inputGroup flex-1">
          <label htmlFor="numOfRooms">Number of Rooms</label>
          <select
            id="numOfRooms"
            value={numOfRooms}
            onChange={handleNumOfRoomsChange}
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "10px",
              border: "1px solid #35487a",
              width: "100%",
            }}
          >
            {[...Array(50)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Number of Floors Dropdown */}
        <div className="inputGroup flex-1">
          <label htmlFor="numOfFloors">Number of Floors</label>
          <select
            id="numOfFloors"
            value={numOfFloors}
            onChange={handleNumOfFloorsChange}
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "10px",
              border: "1px solid #35487a",
              width: "100%",
            }}
          >
            {[...Array(50)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", width: "100%" }}>
        <button
          onClick={() => navigate({ to: "/building" })}
          style={{
            border: "2px solid #d1d1d1",
            backgroundColor: "#f1f1f1",
            borderRadius: "0.9em",
            cursor: "pointer",
            padding: "0.8em 1.2em",
            fontSize: "16px",
            fontWeight: 500,
            color: "#333",
            transition: "background-color 0.2s ease-in-out",
            width: "100%",
            maxWidth: "100%",
            textAlign: "center",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onHandleInsert}
          style={{
            border: "2px solid #35487a",
            backgroundColor: "#6b92e5",
            borderRadius: "0.9em",
            cursor: "pointer",
            padding: "0.8em 1.2em",
            fontSize: "16px",
            fontWeight: 600,
            color: "#fff",
            transition: "background-color 0.2s ease-in-out",
            width: "100%",
            maxWidth: "100%",
            textAlign: "center",
          }}
        >
          Create
        </button>
      </div>

      <style>
        {`
          .inputGroup select:focus {
            border-color: rgb(150, 150, 200);
            outline: none;
          }
        `}
      </style>
    </div>
  );
}
