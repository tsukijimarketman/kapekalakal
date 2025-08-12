import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  number: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, number, label }) => (
  <div className="bg-gradient-to-br from-[#b28341] to-[#996936] text-white p-4 md:p-6 rounded-xl text-center shadow-lg">
    <div className="text-xl md:text-2xl mb-2">{icon}</div>
    <div className="text-xl md:text-2xl font-bold mb-1">{number}</div>
    <div className="text-xs opacity-90">{label}</div>
  </div>
);

export default StatCard;
