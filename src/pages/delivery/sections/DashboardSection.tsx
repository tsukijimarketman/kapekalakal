import React from "react";
import { Package, DollarSign, Truck } from "lucide-react";
import StatCard from "../shared/StatCard";
import type { HistoryItem } from "../types/rider";

interface DashboardSectionProps {
  stats: {
    todayDeliveries: number;
    todayEarnings: number;
    totalDeliveries: number;
  };
  history: HistoryItem[];
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  stats = { todayDeliveries: 0, todayEarnings: 0, totalDeliveries: 0 },
  history = [],
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<Package />}
          number={String(stats?.todayDeliveries ?? 0)}
          label="Today's Deliveries"
        />
        <StatCard
          icon={<DollarSign />}
          number={`₱${(stats?.todayEarnings ?? 0).toLocaleString()}`}
          label="Today's Earnings"
        />
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            icon={<Truck />}
            number={String(stats?.totalDeliveries ?? 0)}
            label="Total Deliveries"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-[#67412c] rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#b28341] to-[#996936] text-white p-4">
          <h2 className="text-lg font-bold">Recent Activity</h2>
        </div>
        <div className="p-4 space-y-3">
          {history.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="bg-[#f9f6ed] dark:bg-[#59382a] p-3 rounded-lg border-l-4 border-[#b28341]"
            >
              <div className="text-xs text-[#7a4e2e] dark:text-[#e1d0a7] mb-1">
                {item.date}
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="text-sm">{item.id} delivered</span>
                <span className="font-bold text-[#b28341]">₱{item.fee}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
