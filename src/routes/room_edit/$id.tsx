import Input from "@/components/Input";
import BuildingSelect from "@/components/selector/BuildingSelect";
import { insertBacklogs } from "@/hooks/queries/backlogs/useInsertBacklogs";
import { fetchRoomsWithId } from "@/hooks/queries/rooms/useFetchRooms";
import { updateRooms } from "@/hooks/queries/rooms/useUpdateRooms";
import { Select } from "@radix-ui/themes";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/room_edit/$id")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      id: params.id,
    };
  },
});

function RouteComponent() {
  const { id } = Route.useLoaderData();
  const navigate = useNavigate();

  const { data } = fetchRoomsWithId(id);

  const [roomName, setRoomName] = React.useState("");
  const [roomLocation, setRoomLocation] = React.useState("");
  const [roomCapacity, setRoomCapacity] = React.useState(0);
  const [roomType, setRoomType] = React.useState("");
  const [roomImage, setRoomImage] = React.useState("");

  React.useEffect(() => {
    if (data) {
      setRoomName(data.room_name || "");
      setRoomLocation(data.location || "");
      setRoomCapacity(data.room_capacity || 0);
      setRoomType(data.room_type || "");
      setRoomImage(data.room_image || "");
    }
  }, [data]);

  // const handleImageChange = (event: any) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setRoomImage(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const onHandleUpdate = async () => {
    await updateRooms(
      id,
      roomName,
      roomImage,
      roomType,
      roomCapacity,
      roomLocation
    );
    console.log(updateRooms);
    alert("Data saved successfully");

    await insertBacklogs("UPDATE", `The room ${roomName} has been edited`);
    navigate({ to: "/rooms" });
  };

  //FIXME: USE GAP INSTEAD OF MARGIN, AND USE TAILWIND CSS FOR MORE CONVENIENCE

  return (
    <div className="p-10 bg-white flex flex-col gap-7">
      <h1 className="text-center font-bold text-xl pb-8">Create New Room</h1>

      {/* Image Preview */}
      <div className="flex justify-center">
        <img
          src={roomImage ? roomImage : "src/assets/dummy/image-placeholder.png"}
          alt="Room Preview"
          className="object-cover w-80"
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
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        label="Room Name"
        type={"text"}
      />

      {/* Room Description */}
      <Input
        id="roomDescription"
        htmlFor="roomDescription"
        placeholder=""
        value={roomType}
        onChange={(e) => setRoomType(e.target.value)}
        label="Room Description"
        type={"text"}
      />

      {/* Room Capacity */}
      <Input
        id="roomCapacity"
        htmlFor="roomCapacity"
        placeholder=""
        value={roomCapacity}
        onChange={(e) => setRoomCapacity(e.target.value)}
        label="Room Capacity"
        type={"text"}
      />

      {/* Room Location */}
      <div className="inputGroup font-sans relative">
        <label
          htmlFor="roomLocation"
          className="text-base p-3 ml-2 pointer-events-none transition-all duration-300 ease-in-out text-[#35487a]"
        >
          Room Location/Building
        </label>
        <Select.Root>
          <BuildingSelect setBuilding={setRoomLocation} />
        </Select.Root>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-8 w-full">
        <button
          onClick={() => navigate({ to: "/rooms" })}
          className="w-full max-w-full text-center border-2 border-[#d1d1d1] bg-[#f1f1f1] rounded-xl cursor-pointer py-3 px-5 text-base font-medium text-[#333] transition-colors duration-200 ease-in-out hover:bg-[#e1e1e1]"
        >
          Cancel
        </button>
        <button
          onClick={onHandleUpdate}
          className="w-full max-w-full text-center border-2 border-[#35487a] bg-[#6b92e5] rounded-xl cursor-pointer py-3 px-5 text-base font-semibold text-white transition-colors duration-200 ease-in-out hover:bg-[#35487a]"
        >
          Create
        </button>
      </div>

      {/* Style for animation in Add Room Forms */}
      <style>
        {`
      .inputGroup input:focus ~ label,
      .inputGroup input:valid ~ label {
        transform: translateY(-50%) scale(0.9);
        margin-left: 1.3em;
        padding: 0.4em;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 5) 0%, rgba(255,255, 255, 3) 70%, transparent 100%);
        border-radius: 20px;
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
