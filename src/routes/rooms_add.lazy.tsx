import Input from "@/components/Input";
import BuildingSelect from "@/components/selector/BuildingSelect";
import RoomDescriptionSelect from "@/components/selector/RoomDescriptionSelect";
import { insertBacklogs } from "@/hooks/queries/backlogs/useInsertBacklogs";
import { insertRooms } from "@/hooks/queries/rooms/useInsertRooms";
import supabase from "@/utils/supabase";
import { Select } from "@radix-ui/themes";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";

export const Route = createLazyFileRoute("/rooms_add")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [room_name, setRoomName] = React.useState("");
  const [room_type, setRoomType] = React.useState("");
  const [room_capacity, setRoomCapacity] = React.useState(0);
  const [room_location, setRoomLocation] = React.useState("");
  const [room_image, setRoomImage] = React.useState("");

  React.useEffect(() => {
    if (room_location) {
      // Handle any updates or side effects here
      console.log("Room Location (Building ID) Updated:", room_location);
    }
  }, [room_location]);

  const handleRoomCapacityChange = (e: any) => {
    const value = e.target.value;
    const numberValue = parseInt(value, 10);
    // Check if the input is a number and within the range
    if (!isNaN(numberValue) && numberValue <= 100) {
      setRoomCapacity(numberValue);
    } else if (value === "") {
      // alert("The maximum room capacity is 100."); // Clear the state if the input is empty
    }
  };

  const onHandleInsert = async () => {
    // Check if room_name already exists
    //TODO: Put in seperate file later
    try {
      // Check if room_name already exists
      const { data, error } = await supabase
        .from("rooms")
        .select("room_name")
        .eq("room_name", room_name)
        .single();

      if (error && error.code !== "PGRST116") {
        // Ignore the "No rows found" error
        console.error("Error checking room name:", error.message);
        return;
      }

      if (data) {
        alert("Room name already exists. Please choose a different name.");
        return;
      }

      // Insert new room if room_name doesn't exist
      await insertRooms(
        room_name,
        room_image,
        room_type,
        room_capacity,
        room_location
      );

      await insertBacklogs("INSERT", `The new ${room_name} has been added`);

      alert("Data saved successfully");
      navigate({ to: "/rooms" });
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div className="p-10 bg-white flex flex-col gap-7">
      <h1 className="text-center font-bold text-xl pb-8">Create New Room</h1>

      {/* Image Preview */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src={
            room_image ? room_image : "src/assets/dummy/image-placeholder.png"
          }
          alt="Room Preview"
          style={{ objectFit: "cover", width: "16rem" }} // 64px equivalent
        />
      </div>

      {/* Image File Input */}

      <div
        className="inputGroup"
        style={{
          fontFamily: "'Segoe UI', sans-serif",
          position: "relative",
        }}
      >
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={(e) =>
            setRoomImage(
              e.target.files && e.target.files[0]
                ? URL.createObjectURL(e.target.files[0])
                : ""
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

      {/* Room Name */}
      <Input
        id="roomName"
        htmlFor="roomName"
        placeholder=""
        value={room_name}
        onChange={(e) => setRoomName(e.target.value)}
        label="Room Name"
        type={"text"}
      />

      {/* Room Capacity */}
      <Input
        id="roomCapacity"
        htmlFor="roomCapacity"
        placeholder=""
        value={room_capacity}
        onChange={handleRoomCapacityChange}
        label="Room Capacity"
        type={"text"}
      />

      {/* Room Description */}
      <RoomDescriptionSelect setDescription={setRoomType} />

      {/* Room Location */}
      <BuildingSelect setBuilding={setRoomLocation} />

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          width: "100%",
        }}
      >
        <button
          onClick={() => navigate({ to: "/rooms" })}
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
            width: "100%", // Full width
            maxWidth: "100%", // Ensure it doesn't exceed the screen width
            textAlign: "center", // Center text inside the button
          }}
          // onMouseOver={(e) => (e.target.style.backgroundColor = "#e1e1e1")}
          // onMouseOut={(e) => (e.target.style.backgroundColor = "#f1f1f1")}
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
            width: "100%", // Full width
            maxWidth: "100%", // Ensure it doesn't exceed the screen width
            textAlign: "center", // Center text inside the button
          }}
          // onMouseOver={(e) => (e.target.style.backgroundColor = "#35487a")}
          // onMouseOut={(e) => (e.target.style.backgroundColor = "#6b92e5")}
        >
          Create
        </button>
      </div>

      {/* Style for animation in Add Room Forms */}
      <style>
        {`
    .inputGroup input:focus ~ label,
    .inputGroup input:valid ~ label {
      transform: translateY(-50%) scale(0.9); /* Raised higher */
      margin-left: 1.3em;
      padding: 0.4em;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 5) 0%, rgba(255,255, 255, 3) 70%, transparent 100%);
      border-radius: 20px; /* Rounded corners */
    }

    .inputGroup input:focus,
    .inputGroup input:valid {
      border-color: rgb(150, 150, 200);
    }
  `}
      </style>
    </div>
  );
}
