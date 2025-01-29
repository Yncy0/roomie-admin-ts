import BuildingSelect from "@/components/selector/BuildingSelect";
import { insertRooms } from "@/hooks/queries/rooms/useInsertRooms";
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

  const insert = insertRooms(room_name, room_image, room_type, room_capacity);

  const onHandleInsert = async () => {
    await insert;

    alert("Data saved successfully");
    navigate({ to: "/rooms" });
  };

  return (
    <div
      style={{
        padding: "2.5rem 2rem",
        backgroundColor: "#fff",
        gap: "1.25rem",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.25rem",
          paddingBottom: "30px",
        }}
      >
        Create New Room
      </h1>

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
          margin: "1.7em 0",
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
      <div
        className="inputGroup"
        style={{
          fontFamily: "'Segoe UI', sans-serif",
          margin: "1.8em 0",
          position: "relative",
        }}
      >
        <input
          id="roomName"
          value={room_name}
          type="text"
          placeholder=" "
          onChange={(e) => setRoomName(e.target.value)}
          required
          style={{
            fontSize: "100%",
            padding: "12px",
            outline: "none",
            border: "2px solid #35487a",
            backgroundColor: "transparent",
            borderRadius: "20px",
            width: "100%",
          }}
        />
        <label
          htmlFor="roomName"
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
          Room Name
        </label>
      </div>

      {/* Room Description */}
      <div
        className="inputGroup"
        style={{
          fontFamily: "'Segoe UI', sans-serif",
          margin: "1.8em 0",
          position: "relative",
        }}
      >
        <input
          id="roomDescription"
          value={room_type}
          type="text"
          placeholder=" "
          onChange={(e) => setRoomType(e.target.value)}
          required
          style={{
            fontSize: "100%",
            padding: "12px",
            outline: "none",
            border: "2px solid #35487a",
            backgroundColor: "transparent",
            borderRadius: "20px",
            width: "100%",
          }}
        />
        <label
          htmlFor="roomDescription"
          style={{
            fontSize: "100%",
            position: "absolute",
            left: "0",
            padding: "14px",
            marginLeft: "0.5em",
            pointerEvents: "none",
            transition: "all 0.3s ease",
            color: "#35487a",
          }}
        >
          Room Description
        </label>
      </div>

      {/* Room Capacity */}
      <div
        className="inputGroup"
        style={{
          fontFamily: "'Segoe UI', sans-serif",
          margin: "1.8em 0",
          position: "relative",
        }}
      >
        <input
          id="roomCapacity"
          value={room_capacity}
          type="number"
          placeholder=" "
          onChange={(e) => setRoomCapacity(Number(e.target.value))}
          required
          style={{
            fontSize: "100%",
            padding: "12px",
            outline: "none",
            border: "2px solid #35487a",
            backgroundColor: "transparent",
            borderRadius: "20px",
            width: "100%",
          }}
        />
        <label
          htmlFor="roomCapacity"
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
          Room Capacity
        </label>
      </div>

      {/*TODO: Dropdown */}
      {/* Room Location */}
      <div
        className="inputGroup"
        style={{
          fontFamily: "'Segoe UI', sans-serif",
          margin: "1.8em 0",
          position: "relative",
        }}
      >
        <label
          htmlFor="roomLocation"
          style={{
            fontSize: "100%",
            padding: "0.8em",
            marginLeft: "0.5em",
            pointerEvents: "none",
            transition: "all 0.3s ease",
            color: "#35487a",
          }}
        >
          Room Location/Building
        </label>
        <Select.Root>
          <BuildingSelect />
        </Select.Root>
      </div>

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
