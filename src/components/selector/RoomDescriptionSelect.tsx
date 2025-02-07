import { Select } from "@radix-ui/themes";
import "@/styles/Rooms/roomsAdd.css";


type Props = {
  setDescription: (v: any) => void;
};

const RoomDescriptionSelect = ({ setDescription }: Props) => {
  const handleChange = (value: any) => {
    console.log("Selected Room Description:", value); // Debug statement
    setDescription(value);
  };

  return (
    <div className="SelectRoot">
      <Select.Root defaultValue="Lecture Room" onValueChange={handleChange}>
        <Select.Trigger className="SelectTrigger" />
        <Select.Content className="SelectContent">
          <Select.Group className="SelectGroup">
            <Select.Label className="SelectLabel">Choose Room Description</Select.Label>
            <Select.Item className="SelectItem" value="Lecture Room">
              Lecture Room
            </Select.Item>
            <Select.Item className="SelectItem" value="Computer Lab">
              Computer Lab
            </Select.Item>
            <Select.Item className="SelectItem" value="Facility">
              Facility
            </Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  );
};

export default RoomDescriptionSelect;
