import React, { useRef, useState, useEffect } from "react";
import { Truck, Camera } from "lucide-react";
import TaskCard from "../shared/TaskCard";
import FileUploadArea from "../shared/FileUploadArea";
import type { Task, DeliveryState, UploadedFile } from "../types/rider";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Haversine distance calculation
const toRad = (x: number) => (x * Math.PI) / 180;

const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
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

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<string>("-");

  // Get current location for distance calculation
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCurrentLocation(location);
          
          // Calculate distance if we have both locations
          if (activeTask.latitude && activeTask.longitude) {
            const dist = haversineKm(
              location.lat,
              location.lng,
              activeTask.latitude,
              activeTask.longitude
            );
            setDistance(`${dist.toFixed(1)} km`);
          }
        },
        (err) => {
          console.error("Error getting location:", err);
          setDistance("-");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    getLocation();
    // Update distance periodically (every 30 seconds)
    const interval = setInterval(getLocation, 30000);
    return () => clearInterval(interval);
  }, [activeTask.latitude, activeTask.longitude]);

  const hasPin =
    typeof activeTask.latitude === "number" &&
    typeof activeTask.longitude === "number" &&
    Math.abs(activeTask.latitude) > 0 &&
    Math.abs(activeTask.longitude) > 0;

  const openInGoogleMaps = () => {
    if (hasPin) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${activeTask.latitude},${activeTask.longitude}`,
        "_blank"
      );
    } else {
      const destination = encodeURIComponent(activeTask.address);
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
        "_blank"
      );
    }
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
          <TaskCard 
            task={{
              ...activeTask,
              distance: distance
            }} 
            showActions={false} 
          />

          {/* Map */}
          <div className="mb-4 rounded-lg overflow-hidden border border-[#e1d0a7] dark:border-[#7a4e2e] z-5">
            {hasPin ? (
              <MapContainer
                className="z-5"
                center={[activeTask.latitude!, activeTask.longitude!]}
                zoom={15}
                style={{ height: 200, width: "100%" }}
                scrollWheelZoom={false}
                dragging={false}
                doubleClickZoom={false}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[activeTask.latitude!, activeTask.longitude!]}
                  icon={defaultIcon}
                  draggable={false}
                />
              </MapContainer>
            ) : (
              <div className="bg-[#e1d0a7] dark:bg-[#7a4e2e] h-32 sm:h-48 flex items-center justify-center">
                <span className="text-[#996936] dark:text-[#e1d0a7]">
                  No map location
                </span>
              </div>
            )}
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

      {/* Pickup Upload Section (only when rider has marked as picked up, before submit) */}
      {currentDeliveryState === "picked-up" && (
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
