import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type {
  ActiveSection,
  DeliveryState,
  UploadedFile,
  Task,
} from "./types/rider";
import { useRiderData } from "./hooks/useRiderData";
import deliveryApi from "../../services/deliveryApi";

import RiderHeader from "./RiderHeader";
import RiderNavigation from "./RiderNavigation";
import DashboardSection from "./sections/DashboardSection";
import TasksSection from "./sections/TaskSection";
import ActiveDeliverySection from "./sections/ActiveDeliverySection";
import HistorySection from "./sections/HistorySection";
import ProfileSection from "./sections/ProfileSection";
import { toast } from "react-toastify";

const RiderDashboard: React.FC = () => {
  const [activeSection, setActiveSection] =
    useState<ActiveSection>("dashboard");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentDeliveryState, setCurrentDeliveryState] =
    useState<DeliveryState>("accepted");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [activeTaskOverride, setActiveTaskOverride] = useState<Task | null>(
    null
  );

  const { signout } = useAuth();
  const { activeTask, history, stats } = useRiderData();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "pickup" | "delivery"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile: UploadedFile = {
          file,
          preview: e.target?.result as string,
          type,
        };
        setUploadedFiles((prev) => [
          ...prev.filter((f) => f.type !== type),
          newFile,
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const acceptTask = async (taskId: string) => {
    toast.success(`Task ${taskId} accepted! Redirecting to active delivery...`);
    try {
      const { data } = await deliveryApi.getMyTasks();
      const list: any[] = data?.data || [];
      const t =
        list.find((x) => x.transactionId === taskId || x._id === taskId) ||
        list.find((x) => x.status === "in_transit");
      if (t) {
        const itemsSummary = Array.isArray(t.items)
          ? t.items.map((it: any) => `${it.quantity}x ${it.name}`).join(", ")
          : "—";
        const mapped: Task = {
          dbId: t._id,
          id: t.transactionId || t._id || "N/A",
          items: Array.isArray(t.items)
            ? t.items.map((it: any) => `${it.quantity}x ${it.name}`).join(", ")
            : "—",
          amount: t.totalAmount ?? 0,
          distance: "—", // You may compute this if you have rider location
          fee: 50,
          address: t.shippingAddress ?? "—",
          customer: t.customerId
            ? [t.customerId.firstName, t.customerId.lastName]
                .filter(Boolean)
                .join(" ")
            : undefined,
          phone: t.customerId?.contactNumber,
          latitude: t.deliveryInfo?.latitude,
          longitude: t.deliveryInfo?.longitude,
          status: "accepted",
        };
        setActiveTaskOverride(mapped);
      }
    } catch (e) {
      // Non-blocking; still navigate
      toast.error("Failed to accept task");
    }
    setActiveSection("active");
  };

  const handlePickupSubmit = async () => {
    const currentActive = activeTaskOverride || activeTask;
    if (!currentActive?.dbId) {
      toast.error("No active task found.");
      return;
    }
    const file = uploadedFiles.find((f) => f.type === "pickup")?.file;
    if (!file) {
      toast.error("Please upload a pickup photo first.");
      return;
    }
    try {
      await deliveryApi.completePickup(currentActive.dbId, file);
      toast.success("Pickup proof uploaded! Waiting for admin validation...");
      // Allow rider to proceed with delivery steps; admin validation happens in backoffice
      setCurrentDeliveryState("ready-to-deliver");
    } catch (err: unknown) {
      type AxiosErrorLike = { response?: { data?: { message?: string } } };
      const possible = err as AxiosErrorLike;
      const msg =
        possible.response?.data?.message || "Failed to submit pickup proof";
      toast.error(msg);
    }
  };

  const handleDeliverySubmit = async () => {
    const currentActive = activeTaskOverride || activeTask;
    if (!currentActive?.dbId) {
      toast.error("No active task found.");
      return;
    }
    const file = uploadedFiles.find((f) => f.type === "delivery")?.file;
    if (!file) {
      toast.error("Please upload a delivery photo first.");
      return;
    }
    try {
      await deliveryApi.completeDelivery(currentActive.dbId, file);
      toast.success("Delivery proof uploaded! Waiting for admin validation...");
      // Do not auto-complete; admin will validate in backoffice
    } catch (err: unknown) {
      type AxiosErrorLike = { response?: { data?: { message?: string } } };
      const possible = err as AxiosErrorLike;
      const msg =
        possible.response?.data?.message || "Failed to submit delivery proof";
      toast.error(msg);
    }
  };

  const handleSignOut = () => {
    signout();
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection stats={stats} history={history} />;
      case "tasks":
        return <TasksSection onAcceptTask={acceptTask} />;
      case "active": {
        const currentActive = activeTaskOverride || activeTask;
        if (!currentActive) {
          return (
            <div className="bg-white dark:bg-[#67412c] rounded-xl shadow p-6 text-center animate-fade-in">
              <p className="text-sm sm:text-base opacity-80">
                No active delivery yet. Go to the Tasks tab to accept a
                delivery.
              </p>
            </div>
          );
        }
        return (
          <ActiveDeliverySection
            activeTask={currentActive}
            currentDeliveryState={currentDeliveryState}
            setCurrentDeliveryState={setCurrentDeliveryState}
            uploadedFiles={uploadedFiles}
            onFileUpload={handleFileUpload}
            onPickupSubmit={handlePickupSubmit}
            onDeliverySubmit={handleDeliverySubmit}
          />
        );
      }
      case "history":
        return <HistorySection history={history} />;
      case "profile":
        return <ProfileSection stats={stats} onSignOut={handleSignOut} />;
      default:
        return <DashboardSection stats={stats} history={history} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f6ed] dark:bg-[#59382a] text-[#59382a] dark:text-[#f9f6ed] transition-colors duration-300">
      <RiderHeader
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <RiderNavigation
        isMenuOpen={isMenuOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setIsMenuOpen={setIsMenuOpen}
        onSignOut={handleSignOut}
      />

      <main className="max-w-4xl mx-auto p-4">{renderActiveSection()}</main>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RiderDashboard;
