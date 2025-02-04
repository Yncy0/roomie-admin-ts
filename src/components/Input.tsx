type Props = {
  id: string;
  htmlFor: string;
  type: any;
  placeholder: string;
  value: any;
  onChange: (v: any) => void;
  label: string;
  accept?: any;
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
}: Props) => {
  return (
    <div className="inputGroup font-sans flex items-center relative my-7">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        accept={accept}
        required
        className="text-base p-3 outline-none border-2 border-[#35487a] bg-transparent rounded-[20px] w-full"
      ></input>
      <label
        htmlFor={htmlFor}
        className="text-base absolute left-0 p-2 ml-2 pointer-events-none transition-all duration-300 ease-in text-[#35487a]"
      >
        {label}
      </label>

      <style>
        {`
    .inputGroup input:focus ~ label,
    .inputGroup input:valid ~ label {
      transform: translateY(-50%) scale(0.9); /* Raised higher */
      margin-left: 1.3em;
      padding: 0.4em;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 5) 0%, rgba(255,255, 255, 3) 70%, transparent 100%);
      border-radius: 20px; /* Rounded corners */
    }

    .inputGroup input:focus,
    .inputGroup input:valid {
      border-color: rgb(150, 150, 200);
    }
  `}
      </style>
    </div>
  );
};

export default Input;
