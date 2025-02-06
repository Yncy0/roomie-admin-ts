import React from "react";
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft as ChevronsLeftIcon } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  handlePagination: (action: string) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  handlePagination,
}) => {
  return (
    <div className="flex flex-row justify-end items-center py-4 px-14 gap-2">
      <button
        onClick={() => handlePagination("first")}
        disabled={currentPage === 0}
        className={`p-2 rounded ${currentPage === 0 ? "text-gray-400" : " text-[#35487a]"}`}
      >
        <ChevronsLeftIcon />
      </button>

      <button
        onClick={() => handlePagination("prev")}
        disabled={currentPage === 0}
        className={`p-2 rounded ${currentPage === 0 ? "text-gray-400" : " text-[#35487a]"}`}
      >
        <ChevronLeft />
      </button>

      <span className="font-bold font-roboto px-4 text-[#35487a]">
        Page {currentPage + 1} of {totalPages}
      </span>

      <button
        onClick={() => handlePagination("next")}
        disabled={currentPage >= totalPages - 1}
        className={`p-2 rounded ${currentPage >= totalPages - 1 ? "text-gray-400" : " text-[#35487a]"}`}
      >
        <ChevronRight />
      </button>

      <button
        onClick={() => handlePagination("last")}
        disabled={currentPage >= totalPages - 1}
        className={`p-2 rounded ${currentPage >= totalPages - 1 ? "text-gray-400" : " text-[#35487a]"}`}
      >
        <ChevronsRight />
      </button>
    </div>
  );
};

export default PaginationControls;
