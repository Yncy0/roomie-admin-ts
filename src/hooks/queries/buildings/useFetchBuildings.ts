import { useQuery } from "@tanstack/react-query";

const dummyBuildingsData = [
  {
    id: 1,
    building_image: "image1.jpg",
    building_name: "Building A",
    number_of_floors: 5,
    number_of_rooms: 20,
  },
  {
    id: 2,
    building_image: "image2.jpg",
    building_name: "Building B",
    number_of_floors: 3,
    number_of_rooms: 15,
  },
  {
    id: 3,
    building_image: "image3.jpg",
    building_name: "Building C",
    number_of_floors: 7,
    number_of_rooms: 30,
  },
  {
    id: 4,
    building_image: "image4.jpg",
    building_name: "Building D",
    number_of_floors: 4,
    number_of_rooms: 25,
  },
  {
    id: 5,
    building_image: "image5.jpg",
    building_name: "Building E",
    number_of_floors: 6,
    number_of_rooms: 28,
  },
];

export const fetchBuildings = () => {
  return useQuery({
    queryKey: ["buildings"],
    queryFn: async () => {
      // Return dummy data instead of fetching from the database
      return dummyBuildingsData;
    },
  });
};
