import React from "react";
import * as Dialog from "@radix-ui/react-dialog"; // Radix Dialog component for modals
import { Button } from "@radix-ui/themes"; // Radix button
import "@/styles/BuildingPreview.css"; // Import the CSS file

type BuildingPreviewProps = {
  buildingName: string;
  buildingImage: string;
  numOfRooms: number;
  numOfFloors: number;
  onClose: () => void;
  onEdit?: () => void; // Add a new prop for the edit action
};

const BuildingPreview: React.FC<BuildingPreviewProps> = ({
  buildingName,
  buildingImage,
  numOfRooms,
  numOfFloors,
  onClose,
  onEdit, // Destructure the new prop
}) => {
  const buildingDetails = {
    building_name: buildingName,
    num_of_rooms: numOfRooms,
    num_of_floors: numOfFloors,
    building_image: buildingImage,
  };

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Overlay className="dialog-overlay" />
      <Dialog.Content className="dialog-content">
        <div className="dialog-box">
          <Dialog.Title className="dialog-title">
            {buildingDetails.building_name}
          </Dialog.Title>
          <img
            src={
              buildingDetails.building_image ||
              "/assets/dummy/image-placeholder.png"
            }
            alt={buildingDetails.building_name}
            className="dialog-image"
          />
          <p className="dialog-details">
            Rooms: {buildingDetails.num_of_rooms}
          </p>
          <p className="dialog-details">
            Floors: {buildingDetails.num_of_floors}
          </p>

          <div className="button-group">
            <Button
              onClick={onEdit}
              className="dialog-button dialog-edit-button"
            >
              Edit Details
            </Button>
            <Button
              onClick={onClose}
              className="dialog-button dialog-close-button"
            >
              Close
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default BuildingPreview;
