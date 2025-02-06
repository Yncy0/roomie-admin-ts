import React, { useState } from "react";
import BuildingPreview from "@/components/dialogs/BuildingPreview"; // Correct import
import { useNavigate } from "@tanstack/react-router";

type BuildingCardProps = {
  id: string;
  building_name: string;
  num_of_rooms: number;
  num_of_floors: number;
  building_image: string;
};

const BuildingCard: React.FC<BuildingCardProps> = ({
  id,
  building_name,
  num_of_rooms,
  num_of_floors,
  building_image,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // State to manage modal visibility

  const nav = useNavigate();

  const handleViewDetails = () => {
    setIsPreviewOpen(true); // Open the modal when the button is clicked
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false); // Close the modal
  };

  const clickEdit = () => {
    nav({ to: "/building_edit/$id", params: { id: id } });
  };

  return (
    <div className="relative flex flex-col rounded-xl bg-white p-6 gap-4 shadow-md w-full max-w-xs">
      {/* Image */}
      <div className="relative h-40 overflow-hidden rounded-xl bg-gray-200">
        <img
          src={building_image || "/assets/dummy/image-placeholder.png"}
          alt={building_name}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* Building Details */}
      <div>
        <h3 className="mb-2 text-xl font-semibold text-[#35487a]">
          {building_name}
        </h3>
        <p className="text-sm text-gray-600">
          {num_of_rooms} rooms | {num_of_floors} floors
        </p>
      </div>

      {/* View More Details Button */}
      <div className="pt-4">
        <button className="view-details-button" onClick={handleViewDetails}>
          View Details
        </button>
      </div>

      {/* Modal */}
      {isPreviewOpen && (
        <BuildingPreview
          buildingName={building_name}
          buildingImage="/assets/dummy/image-placeholder.png"
          numOfFloors={num_of_floors}
          numOfRooms={num_of_rooms}
          onClose={handleClosePreview}
          onEdit={clickEdit}
        />
      )}
    </div>
  );
};

export default BuildingCard;
