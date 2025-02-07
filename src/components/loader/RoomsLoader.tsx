import "@/styles/Rooms/roomsLoader.css";

const RoomsLoader = () => {
  return (
    <div className="rooms-loader">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="loader-card">
          {/* Image Skeleton */}
          <div className="image-skeleton"></div>
          {/* Room Details Skeleton */}
          <div className="details-skeleton">
            <div className="text-skeleton"></div> {/* Room Name */}
            <div className="text-skeleton short"></div> {/* Location */}
          </div>
          {/* Button Skeleton */}
          <div className="button-skeleton"></div>
        </div>
      ))}
    </div>
  );
};

export default RoomsLoader;
