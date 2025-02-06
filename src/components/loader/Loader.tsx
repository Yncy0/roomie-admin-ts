import '@/styles/loader.css';  // Optional: For styling
import loaderImage from "@/components/loader/loader.png";  // Import image

const Loader = () => {
  return (
    <div className="loader-container">
      <img 
        src={loaderImage}  // Use the imported image here
        alt="Loading..."
        className="loader-image"
      />
    </div>
  );
};

export default Loader;
