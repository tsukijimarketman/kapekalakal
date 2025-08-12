import React from "react";
import { User, Truck } from "lucide-react";
import StatCard from "../shared/StatCard";

interface ProfileSectionProps {
  stats: {
    totalDeliveries: number;
  };
  onSignOut: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  stats,
  onSignOut,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-[#67412c] rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#b28341] to-[#996936] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl sm:text-2xl">
            <User className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold mb-2 text-[#7a4e2e] dark:text-[#e1d0a7]">
            Delivery Rider
          </h2>
          <p className="text-sm sm:text-base text-[#996936] dark:text-[#e1d0a7] mb-6 break-words">
            deliveryrider@gmail.com
          </p>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <StatCard
              icon={<Truck />}
              number={stats.totalDeliveries.toString()}
              label="Total Deliveries"
            />
          </div>

          <div className="space-y-3">
            <button className="w-full bg-[#b28341] hover:bg-[#996936] text-white py-3 rounded-lg font-medium transition-colors text-sm sm:text-base">
              Edit Profile
            </button>
            <button
              onClick={onSignOut}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
