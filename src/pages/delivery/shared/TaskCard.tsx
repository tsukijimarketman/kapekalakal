import React from "react";
import { MapPin } from "lucide-react";
import type { Task } from "../types/rider";

interface TaskCardProps {
  task: Task;
  onAccept?: () => void;
  showActions?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onAccept,
  showActions = true,
}) => (
  <div className="bg-[#f9f6ed] dark:bg-[#59382a] border-l-4 border-[#b28341] rounded-lg p-4 mb-3 shadow-sm">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
      <span className="font-bold text-[#7a4e2e] dark:text-[#e1d0a7]">
        Order {task.id}
      </span>
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${
          task.status === "pending"
            ? "bg-yellow-200 text-yellow-800"
            : task.status === "accepted"
            ? "bg-blue-200 text-blue-800"
            : task.status === "picked-up"
            ? "bg-orange-200 text-orange-800"
            : "bg-green-200 text-green-800"
        }`}
      >
        {task.status.replace("-", " ").toUpperCase()}
      </span>
    </div>

    <div className="space-y-2 mb-3">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm">
        <span>
          <strong>Items:</strong> {task.items}
        </span>
        <span>
          <strong>Amount:</strong> ₱{task.amount}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm">
        <span>
          <strong>Distance:</strong> {task.distance}
        </span>
        <span>
          <strong>Fee:</strong> ₱{task.fee}
        </span>
      </div>
      {task.customer && (
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm">
          <span>
            <strong>Customer:</strong> {task.customer}
          </span>
          <span>
            <strong>Phone:</strong> {task.phone}
          </span>
        </div>
      )}
      <div className="text-sm text-[#7a4e2e] dark:text-[#e1d0a7] break-words">
        <MapPin className="inline w-4 h-4 mr-1 flex-shrink-0" />
        {task.address}
      </div>
    </div>

    {showActions && onAccept && (
      <button
        onClick={onAccept}
        className="w-full bg-gradient-to-r from-[#b28341] to-[#996936] hover:from-[#996936] hover:to-[#7a4e2e] text-white py-3 rounded-lg font-bold transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
      >
        Accept Task
      </button>
    )}
  </div>
);

export default TaskCard;
