import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  number: string;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  number, 
  label, 
  trend,
  trendValue = '' 
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-300';
      case 'down':
        return 'text-red-300';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#b28341] to-[#996936] text-white p-4 md:p-6 rounded-xl text-center shadow-lg relative">
      <div className="text-xl md:text-2xl mb-2">{icon}</div>
      <div className="text-2xl md:text-3xl font-bold mb-1">{number}</div>
      <div className="text-xs opacity-90 mb-1">{label}</div>
      {trendValue && (
        <div className={`text-xs ${getTrendColor()} font-medium mt-1`}>
          {trendValue}
        </div>
      )}
    </div>
  );
};

export default StatCard;
