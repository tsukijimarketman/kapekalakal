import React from "react";
import { Clock } from "lucide-react";
import type { HistoryItem } from "../types/rider";

interface HistorySectionProps {
  history: HistoryItem[];
}

const HistorySection: React.FC<HistorySectionProps> = ({ history }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-[#67412c] rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#b28341] to-[#996936] text-white p-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Delivery History
          </h2>
        </div>
        <div className="p-4 space-y-3">
          {history.length > 0 ? (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-[#f9f6ed] dark:bg-[#59382a] p-4 rounded-lg border-l-4 border-[#b28341]"
              >
                <div className="text-xs text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
                  {item.date}
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex-1">
                    <div className="font-bold text-sm sm:text-base">
                      {item.id}
                    </div>
                    <div className="text-xs sm:text-sm text-[#996936] dark:text-[#e1d0a7] break-words">
                      {item.items} → {item.location}
                    </div>
                  </div>
                  <div className="font-bold text-[#b28341] text-sm sm:text-base">
                    ₱{item.fee}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[#996936] dark:text-[#e1d0a7]">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No delivery history yet</p>
              <p className="text-sm mt-1">
                Complete your first delivery to see history here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorySection;
