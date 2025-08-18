import React, { useEffect, useState } from "react";
import { Package } from "lucide-react";
import TaskCard from "../shared/TaskCard";
import type { Task } from "../types/rider";
import deliveryApi from "../../../services/deliveryApi";
import { toast } from "react-toastify";

interface TasksSectionProps {
  onAcceptTask: (taskId: string) => void;
}

// Haversine distance in KM
const toRad = (x: number) => (x * Math.PI) / 180;
const haversineKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const TasksSection: React.FC<TasksSectionProps> = ({ onAcceptTask }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const requestGeolocation = () =>
      new Promise<{ lat: number; lng: number } | null>((resolve) => {
        if (!("geolocation" in navigator)) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (pos) =>
            resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 7000 }
        );
      });

    const loadTasks = async () => {
      try {
        setLoading(true);
        const coords = await requestGeolocation();
        const { data } = await deliveryApi.getAvailableTasks();
        if (!data?.ok) throw new Error("Failed to load tasks");

        const mapped: Task[] = (data.data || []).map((t: any) => {
          const dropLat = t?.deliveryInfo?.latitude;
          const dropLng = t?.deliveryInfo?.longitude;
          let distanceStr = "—";
          if (
            coords &&
            typeof dropLat === "number" &&
            typeof dropLng === "number" &&
            Math.abs(dropLat) > 0 &&
            Math.abs(dropLng) > 0
          ) {
            const km = haversineKm(coords.lat, coords.lng, dropLat, dropLng);
            distanceStr = `${km.toFixed(1)} km`;
          }

          const itemsSummary = Array.isArray(t.items)
            ? t.items.map((it: any) => `${it.quantity}x ${it.name}`).join(", ")
            : "—";

          const task: Task = {
            dbId: t._id,
            id: t.transactionId || t._id || "N/A",
            items: itemsSummary,
            amount: t.totalAmount ?? 0,
            distance: distanceStr,
            fee: t.deliveryFee ?? 50,
            address: t.shippingAddress ?? "—",
            status: "pending",
          };
          return task;
        });

        if (mounted) setTasks(mapped);
      } catch (err: any) {
        console.error("Failed loading available tasks", err);
        toast.error(err?.message || "Failed to load available tasks");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadTasks();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAccept = async (task: Task) => {
    if (!task.dbId) return;
    try {
      await deliveryApi.acceptTask(task.dbId);
      toast.success("Task accepted!");
      setTasks((prev) => prev.filter((t) => t.dbId !== task.dbId));
      onAcceptTask(task.id);
    } catch (err: any) {
      if (err?.response?.status === 409) {
        toast.warn(
          "Task already accepted by another rider or you already have an active task."
        );
      } else {
        toast.error("Failed to accept task");
      }
    }
  };

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
          {loading ? (
            <div className="text-center py-8 text-[#996936] dark:text-[#e1d0a7]">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50 animate-pulse" />
              <p>Loading tasks...</p>
            </div>
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.dbId || task.id}
                task={task}
                onAccept={() => handleAccept(task)}
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
