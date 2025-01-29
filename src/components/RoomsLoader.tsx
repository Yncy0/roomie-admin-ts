const RoomsLoader = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="relative flex flex-col w-80 rounded-xl bg-white p-6 gap-4 animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="h-40 bg-gray-300 rounded-xl mb-4"></div>
          {/* Room Details Skeleton */}
          <div>
            <div className="h-4 bg-gray-200 rounded-full mb-2"></div>{" "}
            {/* Room Name */}
            <div className="h-3 bg-gray-200 rounded-full w-3/4"></div>{" "}
            {/* Location */}
          </div>
          {/* Button Skeleton */}
          <div className="h-12 bg-gray-300 rounded-lg w-40 mt-4"></div>{" "}
          {/* Button */}
        </div>
      ))}
    </div>
  );
};

export default RoomsLoader;
