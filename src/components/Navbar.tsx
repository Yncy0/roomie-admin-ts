"use client";

import { useState } from "react";
import {
  faLayerGroup,
  faObjectUngroup,
  faObjectGroup,
  faBoxArchive,
  faUserGroup,
  faCalendar,
  faCalendarWeek,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { ChevronFirst, ChevronLast } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "../lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface NavItem {
  icon: typeof faLayerGroup;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: faObjectGroup, label: "Index", href: "/" },
  { icon: faBook, label: "Booked Rooms", href: "/booked-rooms" },
  { icon: faUserGroup, label: "Users", href: "/users" },
  { icon: faLayerGroup, label: "Rooms", href: "/rooms" },
  { icon: faCalendar, label: "Schedule", href: "/schedule" },
  { icon: faObjectUngroup, label: "Backlogs", href: "/backlogs" },
  { icon: faBoxArchive, label: "Archive", href: "/archive" },
];

export default function NavBar() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <nav
      className={cn(
        "flex flex-col h-screen bg-[#6b92e5] text-white transition-all duration-300 items",
        isExpanded ? "w-64" : "w-16"
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-end p-4 hover:bg-white/10 transition-colors "
      >
        {isExpanded ? (
          <ChevronFirst className="w-6 h-6" />
        ) : (
          <ChevronLast className="w-6 h-6" />
        )}
      </button>

      <div className="flex-col flex gap-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center px-4 py-3 hover:bg-white/10 transition-colors gap-2.5",
              !isExpanded && "justify-center"
            )}
          >
            <FontAwesomeIcon icon={item.icon} className="w-6 h-6 shrink-0" />
            {isExpanded && (
              <span className="ml-4 text-sm font-medium">{item.label}</span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
