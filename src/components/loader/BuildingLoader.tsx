import "@/styles/Buildings/buildingLoader.css";

const BuildingLoader = () => {
  return (
    <div className="building-loader">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="loader-card">
          {/* Image Skeleton */}
          <div className="image-skeleton"></div>
          {/* Building Details Skeleton */}
          <div className="details-skeleton">
            <div className="text-skeleton"></div>
            <div className="text-skeleton short"></div>
          </div>
          {/* Button Skeleton */}
          <div className="button-skeleton"></div>
        </div>
      ))}
    </div>
  );
};

export default BuildingLoader;
