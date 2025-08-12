import React from "react";
import { Package } from "lucide-react";
import TaskCard from "../shared/TaskCard";
import type { Task } from "../types/rider";

interface TasksSectionProps {
  tasks: Task[];
  onAcceptTask: (taskId: string) => void;
}

const TasksSection: React.FC<TasksSectionProps> = ({ tasks, onAcceptTask }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-[#67412c] rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#b28341] to-[#996936] text-white p-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Package className="w-5 h-5" />
            Available Delivery Tasks
          </h2>
        </div>
        <div className="p-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onAccept={() => onAcceptTask(task.id)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-[#996936] dark:text-[#e1d0a7]">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No available tasks at the moment</p>
              <p className="text-sm mt-1">
                Check back later for new deliveries
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksSection;
