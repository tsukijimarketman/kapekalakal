import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { ActiveSection, DeliveryState, UploadedFile } from "./types/rider";
import { useRiderData } from "./hooks/useRiderData";

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

  const { signout } = useAuth();
  const { tasks, activeTask, history, stats } = useRiderData();

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

  const acceptTask = (taskId: string) => {
    toast.success(`Task ${taskId} accepted! Redirecting to active delivery...`);
    setActiveSection("active");
  };

  const handlePickupSubmit = () => {
    if (uploadedFiles.find((f) => f.type === "pickup")) {
      toast.success("Pickup proof submitted! Waiting for admin approval...");
      setCurrentDeliveryState("picked-up");
      // Simulate admin approval after 3 seconds
      setTimeout(() => {
        toast.success("Pickup approved! You can now deliver the order.");
        setCurrentDeliveryState("ready-to-deliver");
      }, 3000);
    }
  };

  const handleDeliverySubmit = () => {
    if (uploadedFiles.find((f) => f.type === "delivery")) {
      toast.success("Delivery completed! Waiting for admin validation...");
      // Simulate admin validation
      setTimeout(() => {
        toast.success("Delivery validated successfully! Order completed.");
        setActiveSection("history");
      }, 2000);
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
        return <TasksSection tasks={tasks} onAcceptTask={acceptTask} />;
      case "active":
        return (
          <ActiveDeliverySection
            activeTask={activeTask}
            currentDeliveryState={currentDeliveryState}
            setCurrentDeliveryState={setCurrentDeliveryState}
            uploadedFiles={uploadedFiles}
            onFileUpload={handleFileUpload}
            onPickupSubmit={handlePickupSubmit}
            onDeliverySubmit={handleDeliverySubmit}
          />
        );
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
