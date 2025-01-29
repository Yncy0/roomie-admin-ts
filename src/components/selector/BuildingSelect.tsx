import { fetchBuildings } from "@/hooks/queries/buildings/useFetchBuildings";
import { Select } from "@radix-ui/themes";

const BuildingSelect = () => {
  const { data } = fetchBuildings();

  return (
    <Select.Root defaultValue="apple">
      <Select.Trigger />
      <Select.Content>
        <Select.Group>
          <Select.Label>Choose Rooms</Select.Label>
          {data &&
            data.map((items) => (
              <Select.Item value={items.id}>{items.building_name}</Select.Item>
            ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default BuildingSelect;
