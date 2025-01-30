import { useNavigate } from "@tanstack/react-router";
import React from "react";

type Props = {
  id: string;
  room_image: string;
  room_name: string;
  room_capacity: number;
  room_type: string;
  location: string;
};

export default function RoomsCard({
  id,
  room_image,
  room_name,
  room_capacity,
  room_type,
  location,
}: Props) {
  const navigate = useNavigate({ from: "/rooms" });

  return (
    <div
      className="relative flex flex-col rounded-xl bg-white p-6 gap-4 shadow-md 
             w-full max-w-xs md:max-w-sm lg:max-w-md" // Tailwind for responsive widths
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(8px) saturate(180%) contrast(100%)",
        WebkitBackdropFilter: "blur(8px) saturate(180%) contrast(100%)",
        borderRadius: "10px",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 5px 10px #b0b0b0",
      }}
    >
      {/*Image*/}
      <div
        className="relative h-40 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border 
    text-white shadow-lg shadow-blue-gray-500/40"
      >
        <img
          src={
            room_image ? room_image : "src/assets/dummy/image-placeholder.png"
          }
          alt="Room Preview"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Room Details */}
      <div>
        <p className="block font-sans text-base font-light leading-relaxed text-gray-500 antialiased">
          {location}
        </p>
        <h5
          className="mb-2 block font-sans text-xl font-semibold 
      leading-snug tracking-normal text-[#35487a] antialiased"
        >
          {room_name}
        </h5>
      </div>

      {/* View Room Button */}
      <div className="pt-4">
        <button
          type="button"
          className="select-none rounded-lg bg-[#35487a] py-3 px-6 text-center align-middle 
        font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all 
        hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] 
        active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          onClick={() => navigate({ to: "/room_edit/$id", params: { id: id } })}
        >
          VIEW ROOM
        </button>
      </div>
    </div>
  );
}
