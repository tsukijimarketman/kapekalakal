import React from "react";
import { Truck, Clock, TrendingUp } from "lucide-react";
import StatCard from "../shared/StatCard";
import type { HistoryItem } from "../types/rider";

interface DashboardSectionProps {
  stats?: {
    totalDeliveries?: number;
    lifetimeEarnings?: number;
    recentActivity?: HistoryItem[];
  };
  history?: HistoryItem[];
}

const DashboardSection: React.FC<DashboardSectionProps> = ({
  stats = {
    totalDeliveries: 0,
    totalEarnings: 0,
    recentActivity: [],
  },
  history = [],
}) => {
  // Ensure we have safe defaults for stats
  const safeStats = {
    totalDeliveries: stats?.totalDeliveries ?? 0,
    lifetimeEarnings: stats?.lifetimeEarnings ?? 0,
    recentActivity: stats?.recentActivity ?? [],
  };

  // Ensure we have a safe history array
  const safeHistory = Array.isArray(history) ? history : [];
  const recentActivity =
    safeStats.recentActivity.length > 0
      ? safeStats.recentActivity
      : safeHistory.slice(0, 5);

  // Format currency with proper Philippine Peso symbol and comma separators
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace("₱", "₱");
  };

  // Get trend emoji based on value
  const getTrendEmoji = (value: number) => {
    if (value > 0) return "↑";
    if (value < 0) return "↓";
    return "→";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<Truck className="text-blue-500" />}
          number={String(safeStats.totalDeliveries || 0)}
          label="Total Deliveries"
          trend="up"
          trendValue=""
        />
        <StatCard
          icon={<TrendingUp className="text-purple-500" />}
          number={formatCurrency(safeStats.lifetimeEarnings)}
          label="Total Earnings"
          trend="up"
          trendValue={`${getTrendEmoji(safeStats.lifetimeEarnings)}`}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-[#67412c] rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#b28341] to-[#996936] text-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent Activity</h2>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>Last 5 deliveries</span>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {recentActivity.map((item) => (
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
