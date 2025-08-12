import React, { useRef } from "react";
import { Truck, Camera, Navigation } from "lucide-react";
import TaskCard from "../shared/TaskCard";
import FileUploadArea from "../shared/FileUploadArea";
import type { Task, DeliveryState, UploadedFile } from "../types/rider";

interface ActiveDeliverySectionProps {
  activeTask: Task;
  currentDeliveryState: DeliveryState;
  setCurrentDeliveryState: (state: DeliveryState) => void;
  uploadedFiles: UploadedFile[];
  onFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "pickup" | "delivery"
  ) => void;
  onPickupSubmit: () => void;
  onDeliverySubmit: () => void;
}

const ActiveDeliverySection: React.FC<ActiveDeliverySectionProps> = ({
  activeTask,
  currentDeliveryState,
  setCurrentDeliveryState,
  uploadedFiles,
  onFileUpload,
  onPickupSubmit,
  onDeliverySubmit,
}) => {
  const pickupFileRef = useRef<HTMLInputElement>(null);
  const deliveryFileRef = useRef<HTMLInputElement>(null);

  const openInGoogleMaps = () => {
    const destination = encodeURIComponent(activeTask.address);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
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
          <div className="bg-[#e1d0a7] dark:bg-[#7a4e2e] h-32 sm:h-48 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <Navigation className="w-8 h-8 sm:w-12 sm:h-12 text-[#b28341] mx-auto mb-2" />
              <p className="text-sm sm:text-base text-[#996936] dark:text-[#e1d0a7]">
                Route map will be displayed here
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={openInGoogleMaps}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              Open in Google Maps
            </button>

            {currentDeliveryState === "accepted" && (
              <button
                onClick={() => setCurrentDeliveryState("picked-up")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
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
              onUpload={(e) => onFileUpload(e, "pickup")}
              title="Take a photo of the picked up items"
              description="Click to capture photo"
              uploadedFiles={uploadedFiles}
            />
            <button
              onClick={onPickupSubmit}
              disabled={!uploadedFiles.find((f) => f.type === "pickup")}
              className="w-full mt-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
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
              onUpload={(e) => onFileUpload(e, "delivery")}
              title="Take a photo with the customer"
              description="Include product and customer in photo"
              uploadedFiles={uploadedFiles}
            />
            <button
              onClick={onDeliverySubmit}
              disabled={!uploadedFiles.find((f) => f.type === "delivery")}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              Complete Delivery
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveDeliverySection;
