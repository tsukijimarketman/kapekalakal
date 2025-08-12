import React from "react";
import { BarChart3, Package, Truck, Clock, User, LogOut } from "lucide-react";
import type { ActiveSection } from "./types/rider";

interface RiderNavigationProps {
  isMenuOpen: boolean;
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  setIsMenuOpen: (value: boolean) => void;
  onSignOut: () => void;
}

const RiderNavigation: React.FC<RiderNavigationProps> = ({
  isMenuOpen,
  activeSection,
  setActiveSection,
  setIsMenuOpen,
  onSignOut,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "tasks", label: "Available Tasks", icon: Package },
    { id: "active", label: "Active Delivery", icon: Truck },
    { id: "history", label: "Delivery History", icon: Clock },
    { id: "profile", label: "Profile", icon: User },
  ] as const;

  return (
    <nav
      className={`${
        isMenuOpen ? "block" : "hidden"
      } lg:hidden bg-[#efe8d2] dark:bg-[#67412c] m-4 rounded-xl shadow-lg overflow-hidden`}
    >
      {navItems.map(({ id, label, icon: Icon }) => (
        <div
          key={id}
          className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
            activeSection === id
              ? "bg-[#b28341] text-white"
              : "hover:bg-[#e1d0a7] dark:hover:bg-[#7a4e2e]"
          }`}
          onClick={() => {
            setActiveSection(id);
            setIsMenuOpen(false);
          }}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm md:text-base">{label}</span>
        </div>
      ))}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600"
        onClick={onSignOut}
      >
        <LogOut className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm md:text-base">Sign Out</span>
      </div>
    </nav>
  );
};

export default RiderNavigation;
