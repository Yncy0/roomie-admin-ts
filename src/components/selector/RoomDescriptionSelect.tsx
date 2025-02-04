import { Select } from "@radix-ui/themes";

type Props = {
  setDescription: (v: any) => void;
};

const RoomDescriptionSelect = ({ setDescription }: Props) => {
  const handleChange = (value: any) => {
    console.log("Selected Building ID:", value); // Debug statement
    setDescription(value);
  };

  return (
    <Select.Root defaultValue="Lecture Room" onValueChange={handleChange}>
      <Select.Trigger />
      <Select.Content>
        <Select.Group>
          <Select.Label>Choose Room Description</Select.Label>
          <Select.Item value="Lecture Room">Lecture Room</Select.Item>
          <Select.Item value="Computer Lab">Computer Lab</Select.Item>
          <Select.Item value="Facility">Facility</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default RoomDescriptionSelect;
