import React from "react";
import { Menu, Moon, Sun } from "lucide-react";

interface RiderHeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
}

const RiderHeader: React.FC<RiderHeaderProps> = ({
  isDarkMode,
  setIsDarkMode,
  isMenuOpen,
  setIsMenuOpen,
}) => {
  return (
    <header className="bg-gradient-to-r from-[#b28341] to-[#996936] text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="text-lg md:text-xl font-bold">KapeKalakal Rider</div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default RiderHeader;
