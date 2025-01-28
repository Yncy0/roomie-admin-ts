import React, { PropsWithChildren } from "react";
import { ChevronFirst, ChevronLast } from "lucide-react";

const Navbar = ({ children }: PropsWithChildren) => {
  const [close, setClose] = React.useState(false);

  const expandSideBar = () => {
    setClose(!close);
  };

  return (
    <div
      className={`flex flex-row bg-[rgba(226, 240, 253, 0.4)] text-start min-h-svh max-w-full border-0 ${
        close ? "w-32" : "w52"
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-4 mb-[1px] min-w-full">
        <div className="flex flex-row">
          <button onClick={expandSideBar} className="py-2">
            {close ? (
              <ChevronLast className="min-w-6 text-white" />
            ) : (
              <ChevronFirst className="min-w-6 text-white" />
            )}
          </button>
          <h1
            className={`${
              !close ? "block" : "hidden"
            } font-righteous text-white text-xl`}
          >
            ROOMIE
          </h1>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Navbar;
