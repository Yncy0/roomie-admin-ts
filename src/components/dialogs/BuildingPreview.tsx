import React from "react";

type BuildingPreviewProps = {
  buildingName: string;
  buildingImage: string;
  numOfRooms: number;
  numOfFloors: number;
  onClose: () => void;
  onEdit: () => void;
};

const BuildingPreview: React.FC<BuildingPreviewProps> = ({
  buildingName,
  buildingImage,
  numOfRooms,
  numOfFloors,
  onClose,
  onEdit,
}) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-box">
          <div className="dialog-title">{buildingName}</div>
          <img
            src={buildingImage || "/assets/dummy/image-placeholder.png"}
            alt={buildingName}
            className="dialog-image"
          />
          <div className="dialog-info-container">
            <div className="dialog-info-column">
              <div className="dialog-details">
                Rooms: {numOfRooms}
              </div>
              <div className="dialog-details">
                Floors: {numOfFloors}
              </div>
            </div>
          </div>
          <div className="button-group">
            <button onClick={onEdit} className="dialog-edit-button">
              Edit
            </button>
            <button onClick={onClose} className="dialog-close-button">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingPreview;
