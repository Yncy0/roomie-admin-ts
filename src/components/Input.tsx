type Props = {
  id: string;
  htmlFor: string;
  type: any;
  placeholder: string;
  value: any;
  onChange: (v: any) => void;
  label: string;
  accept?: any;
  max?: any;
};

const Input = ({
  id,
  htmlFor,
  type,
  placeholder,
  value,
  onChange,
  label,
  accept,
  max,
}: Props) => {
  return (
    <div className="inputGroup">
      <label htmlFor={htmlFor} className="roomName">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        accept={accept}
        required
        className="input-field"
        max={max}
      />
    </div>
  );
};

export default Input;
