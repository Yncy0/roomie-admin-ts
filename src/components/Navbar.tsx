"use client";

import { useState } from "react";
import {
  Home,
  BookOpen,
  Users,
  LayoutDashboard,
  Calendar,
  History,
  Archive,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "../lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Index", href: "/" },
  { icon: BookOpen, label: "Booked Rooms", href: "/booked-rooms" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: LayoutDashboard, label: "Rooms", href: "/rooms" },
  { icon: Calendar, label: "Schedule", href: "/schedule" },
  { icon: History, label: "Backlogs", href: "/backlogs" },
  { icon: Archive, label: "Archive", href: "/archive" },
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
          <ChevronLeft className="w-6 h-6" />
        ) : (
          <ChevronRight className="w-6 h-6" />
        )}
      </button>

      <div className="flex-col flex gap-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center px-4 py-3 hover:bg-white/10 transition-colors gap-2",
              !isExpanded && "justify-center"
            )}
          >
            <item.icon className="w-6 h-6 shrink-0" />
            {isExpanded && (
              <span className="ml-4 text-sm font-medium">{item.label}</span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
