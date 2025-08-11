import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Package,
  Camera,
  Navigation,
  Clock,
  DollarSign,
  Truck,
  User,
  LogOut,
  Menu,
  Moon,
  Sun,
  BarChart3,
} from "lucide-react";

interface Task {
  id: string;
  items: string;
  amount: number;
  distance: string;
  fee: number;
  address: string;
  customer?: string;
  phone?: string;
  status: "pending" | "accepted" | "picked-up" | "delivered";
}

interface HistoryItem {
  id: string;
  date: string;
  items: string;
  location: string;
  fee: number;
}

interface UploadedFile {
  file: File;
  preview: string;
  type: "pickup" | "delivery";
}

const DeliveryRiderDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentDeliveryState, setCurrentDeliveryState] = useState<
    "accepted" | "picked-up" | "ready-to-deliver"
  >("accepted");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const pickupFileRef = useRef<HTMLInputElement>(null);
  const deliveryFileRef = useRef<HTMLInputElement>(null);

  const [tasks] = useState<Task[]>([
    {
      id: "ORD-2024-003",
      items: "2x Americano, 1x Croissant",
      amount: 320,
      distance: "2.5 km",
      fee: 45,
      address: "123 Makati Ave, Makati City",
      status: "pending",
    },
    {
      id: "ORD-2024-004",
      items: "1x Cappuccino, 2x Muffins",
      amount: 280,
      distance: "1.8 km",
      fee: 35,
      address: "456 BGC Central, Taguig City",
      status: "pending",
    },
  ]);

  const [activeTask] = useState<Task>({
    id: "ORD-2024-005",
    items: "3x Latte, 1x Sandwich",
    amount: 450,
    distance: "3.2 km",
    fee: 55,
    address: "789 Ortigas Center, Pasig City",
    customer: "Juan Dela Cruz",
    phone: "09123456789",
    status: "accepted",
  });

  const [history] = useState<HistoryItem[]>([
    {
      id: "ORD-2024-001",
      date: "January 15, 2024 - 2:30 PM",
      items: "2x Americano, 1x Croissant",
      location: "BGC",
      fee: 45,
    },
    {
      id: "ORD-2024-002",
      date: "January 15, 2024 - 11:45 AM",
      items: "1x Cappuccino, 2x Muffins",
      location: "Makati",
      fee: 35,
    },
    {
      id: "ORD-2024-003",
      date: "January 14, 2024 - 4:15 PM",
      items: "3x Latte, 1x Sandwich",
      location: "Ortigas",
      fee: 55,
    },
    {
      id: "ORD-2024-004",
      date: "January 14, 2024 - 1:20 PM",
      items: "4x Espresso, 2x Pastry",
      location: "Pasig",
      fee: 65,
    },
  ]);

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
    alert(`Task ${taskId} accepted! Redirecting to active delivery...`);
    setActiveSection("active");
  };

  const openInGoogleMaps = () => {
    const destination = encodeURIComponent(activeTask.address);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handlePickupSubmit = () => {
    if (uploadedFiles.find((f) => f.type === "pickup")) {
      alert("Pickup proof submitted! Waiting for admin approval...");
      setCurrentDeliveryState("picked-up");
      // Simulate admin approval after 3 seconds
      setTimeout(() => {
        alert("Pickup approved! You can now deliver the order.");
        setCurrentDeliveryState("ready-to-deliver");
      }, 3000);
    }
  };

  const handleDeliverySubmit = () => {
    if (uploadedFiles.find((f) => f.type === "delivery")) {
      alert("Delivery completed! Waiting for admin validation...");
      // Simulate admin validation
      setTimeout(() => {
        alert("Delivery validated successfully! Order completed.");
        setActiveSection("history");
      }, 2000);
    }
  };

  const StatCard: React.FC<{
    icon: React.ReactNode;
    number: string;
    label: string;
  }> = ({ icon, number, label }) => (
    <div className="bg-gradient-to-br from-[#b28341] to-[#996936] text-white p-6 rounded-xl text-center shadow-lg">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold mb-1">{number}</div>
      <div className="text-xs opacity-90">{label}</div>
    </div>
  );

  const TaskCard: React.FC<{
    task: Task;
    onAccept?: () => void;
    showActions?: boolean;
  }> = ({ task, onAccept, showActions = true }) => (
    <div className="bg-[#f9f6ed] dark:bg-[#59382a] border-l-4 border-[#b28341] rounded-lg p-4 mb-3 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <span className="font-bold text-[#7a4e2e] dark:text-[#e1d0a7]">
          Order {task.id}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
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
        <div className="flex justify-between text-sm">
          <span>
            <strong>Items:</strong> {task.items}
          </span>
          <span>
            <strong>Amount:</strong> ₱{task.amount}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>
            <strong>Distance:</strong> {task.distance}
          </span>
          <span>
            <strong>Fee:</strong> ₱{task.fee}
          </span>
        </div>
        {task.customer && (
          <div className="flex justify-between text-sm">
            <span>
              <strong>Customer:</strong> {task.customer}
            </span>
            <span>
              <strong>Phone:</strong> {task.phone}
            </span>
          </div>
        )}
        <div className="text-sm text-[#7a4e2e] dark:text-[#e1d0a7]">
          <MapPin className="inline w-4 h-4 mr-1" />
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

  const FileUploadArea: React.FC<{
    type: "pickup" | "delivery";
    fileRef: React.RefObject<HTMLInputElement>;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    title: string;
    description: string;
  }> = ({ type, fileRef, onUpload, title, description }) => {
    const uploadedFile = uploadedFiles.find((f) => f.type === type);

    return (
      <div
        className="border-2 border-dashed border-[#b28341] rounded-lg p-8 text-center cursor-pointer hover:bg-[#f9f6ed] dark:hover:bg-[#59382a] transition-colors"
        onClick={() => fileRef.current?.click()}
      >
        {uploadedFile ? (
          <div className="space-y-3">
            <img
              src={uploadedFile.preview}
              alt="Uploaded"
              className="w-32 h-32 object-cover rounded-lg mx-auto"
            />
            <p className="text-green-600 font-medium">
              Photo uploaded successfully!
            </p>
          </div>
        ) : (
          <>
            <Camera className="w-12 h-12 text-[#b28341] mx-auto mb-3" />
            <p className="font-medium">{title}</p>
            <p className="text-sm text-[#996936] dark:text-[#e1d0a7]">
              {description}
            </p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={onUpload}
        />
      </div>
    );
  };

  const Navigation: React.FC = () => (
    <nav
      className={`${
        isMenuOpen ? "block" : "hidden"
      } lg:hidden bg-[#efe8d2] dark:bg-[#67412c] m-4 rounded-xl shadow-lg overflow-hidden`}
    >
      {[
        { id: "dashboard", label: "Dashboard", icon: BarChart3 },
        { id: "tasks", label: "Available Tasks", icon: Package },
        { id: "active", label: "Active Delivery", icon: Truck },
        { id: "history", label: "Delivery History", icon: Clock },
        { id: "profile", label: "Profile", icon: User },
      ].map(({ id, label, icon: Icon }) => (
        <div
          key={id}
          className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
            activeSection === id
              ? "bg-[#b28341] text-white"
              : "hover:bg-[#e1d0a7] dark:hover:bg-[#7a4e2e]"
          }`}
          onClick={() => {
            setActiveSection(id);
            setIsMenuOpen(false);
          }}
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </div>
      ))}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600"
        onClick={() => alert("Signing out...")}
      >
        <LogOut className="w-5 h-5" />
        <span>Sign Out</span>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f9f6ed] dark:bg-[#59382a] text-[#59382a] dark:text-[#f9f6ed] transition-colors duration-300">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#b28341] to-[#996936] text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">KapeKalakal Rider</div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <Navigation />

      <main className="max-w-4xl mx-auto p-4">
        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <div className="space-y-6 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                icon={<Package />}
                number="12"
                label="Today's Deliveries"
              />
              <StatCard
                icon={<DollarSign />}
                number="₱2,450"
                label="Today's Earnings"
              />
              <StatCard
                icon={<Truck />}
                number="156"
                label="Total Deliveries"
              />
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
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{item.id} delivered</span>
                      <span className="font-bold text-[#b28341]">
                        ₱{item.fee}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Available Tasks Section */}
        {activeSection === "tasks" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-[#67412c] rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#b28341] to-[#996936] text-white p-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Available Delivery Tasks
                </h2>
              </div>
              <div className="p-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onAccept={() => acceptTask(task.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Delivery Section */}
        {activeSection === "active" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-[#67412c] rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#b28341] to-[#996936] text-white p-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Active Delivery
                </h2>
              </div>
              <div className="p-4">
                <TaskCard task={activeTask} showActions={false} />

                {/* Map */}
                <div className="bg-[#e1d0a7] dark:bg-[#7a4e2e] h-48 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Navigation className="w-12 h-12 text-[#b28341] mx-auto mb-2" />
                    <p className="text-[#996936] dark:text-[#e1d0a7]">
                      Route map will be displayed here
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={openInGoogleMaps}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Open in Google Maps
                  </button>

                  {currentDeliveryState === "accepted" && (
                    <button
                      onClick={() => setCurrentDeliveryState("picked-up")}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Mark as Picked Up
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Pickup Upload Section */}
            {currentDeliveryState !== "accepted" && (
              <div className="bg-white dark:bg-[#67412c] rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Upload Pickup Photo
                  </h2>
                </div>
                <div className="p-4">
                  <FileUploadArea
                    type="pickup"
                    fileRef={pickupFileRef}
                    onUpload={(e) => handleFileUpload(e, "pickup")}
                    title="Take a photo of the picked up items"
                    description="Click to capture photo"
                  />
                  <button
                    onClick={handlePickupSubmit}
                    disabled={!uploadedFiles.find((f) => f.type === "pickup")}
                    className="w-full mt-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Submit Pickup Proof
                  </button>
                </div>
              </div>
            )}

            {/* Delivery Upload Section */}
            {currentDeliveryState === "ready-to-deliver" && (
              <div className="bg-white dark:bg-[#67412c] rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Upload Delivery Photo
                  </h2>
                </div>
                <div className="p-4">
                  <FileUploadArea
                    type="delivery"
                    fileRef={deliveryFileRef}
                    onUpload={(e) => handleFileUpload(e, "delivery")}
                    title="Take a photo with the customer"
                    description="Include product and customer in photo"
                  />
                  <button
                    onClick={handleDeliverySubmit}
                    disabled={!uploadedFiles.find((f) => f.type === "delivery")}
                    className="w-full mt-4 bg-green-600 hover:green-700                     disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Complete Delivery
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Section */}
        {activeSection === "history" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-[#67412c] rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#b28341] to-[#996936] text-white p-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Delivery History
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#f9f6ed] dark:bg-[#59382a] p-4 rounded-lg border-l-4 border-[#b28341]"
                  >
                    <div className="text-xs text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
                      {item.date}
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold">{item.id}</div>
                        <div className="text-sm text-[#996936] dark:text-[#e1d0a7]">
                          {item.items} → {item.location}
                        </div>
                      </div>
                      <div className="font-bold text-[#b28341]">
                        ₱{item.fee}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profile Section */}
        {activeSection === "profile" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-[#67412c] rounded-xl shadow-lg overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#b28341] to-[#996936] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold mb-2 text-[#7a4e2e] dark:text-[#e1d0a7]">
                  Delivery Rider
                </h2>
                <p className="text-[#996936] dark:text-[#e1d0a7] mb-6">
                  deliveryrider@gmail.com
                </p>

                <div className="grid grid-cols-1 gap-4 mb-6">
                  <StatCard
                    icon={<Truck />}
                    number="156"
                    label="Total Deliveries"
                  />
                </div>

                <div className="space-y-3">
                  <button className="w-full bg-[#b28341] hover:bg-[#996936] text-white py-3 rounded-lg font-medium transition-colors">
                    Edit Profile
                  </button>
                  <button
                    onClick={() => alert("Signing out...")}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

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

export default DeliveryRiderDashboard;
