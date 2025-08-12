import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface DeliveryAddress {
  name: string;
  phone: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

// Additionally create an explicit default icon for safety across bundlers
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface DeliveryAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: DeliveryAddress;
  onSave: (address: DeliveryAddress) => void;
}

const DeliveryAddressModal: React.FC<DeliveryAddressModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  onSave,
}) => {
  const [formData, setFormData] = useState<DeliveryAddress>(currentAddress);

  // Update form when currentAddress changes
  useEffect(() => {
    setFormData(currentAddress);
  }, [currentAddress]);

  // Handle form input changes
  const handleInputChange = (field: keyof DeliveryAddress, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMapClick = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData((prev) => ({ ...prev, latitude, longitude }));
      },
      (err) => {
        console.error(err);
        toast.error("Unable to retrieve your location");
      }
    );
  };

  // Handle save
  const handleSave = () => {
    onSave(formData);
    toast.success("Delivery address updated successfully");
    onClose();
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData(currentAddress); // Reset to original values
    onClose();
  };

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const defaultCenter: [number, number] = [14.599512, 120.984222]; // Manila
  const hasPin =
    typeof formData.latitude === "number" &&
    typeof formData.longitude === "number";
  const center: [number, number] = hasPin
    ? [formData.latitude as number, formData.longitude as number]
    : defaultCenter;

  const MapClickHandler: React.FC<{
    onPick: (lat: number, lng: number) => void;
  }> = ({ onPick }) => {
    useMapEvents({
      click: (e) => onPick(e.latlng.lat, e.latlng.lng),
    });
    return null;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#67412c] rounded-xl border border-[#e1d0a7] dark:border-[#7a4e2e] shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e1d0a7] dark:border-[#7a4e2e]">
          <h2 className="text-xl font-bold text-[#7a4e2e] dark:text-[#e1d0a7] flex items-center gap-2">
            <svg
              className="w-6 h-6 text-[#b28341]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            Edit Delivery Address
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-[#f9f6ed] dark:hover:bg-[#59382a] rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-[#996936] dark:text-[#d0b274]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-4 py-3 bg-[#f9f6ed] dark:bg-[#59382a] border border-[#e1d0a7] dark:border-[#7a4e2e] rounded-lg text-[#59382a] dark:text-[#f9f6ed] placeholder-[#996936] dark:placeholder-[#d0b274] focus:outline-none focus:ring-2 focus:ring-[#b28341] focus:border-transparent transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full px-4 py-3 bg-[#f9f6ed] dark:bg-[#59382a] border border-[#e1d0a7] dark:border-[#7a4e2e] rounded-lg text-[#59382a] dark:text-[#f9f6ed] placeholder-[#996936] dark:placeholder-[#d0b274] focus:outline-none focus:ring-2 focus:ring-[#b28341] focus:border-transparent transition-colors"
              placeholder="(+63) 9123456789"
            />
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7] mb-2">
              Complete Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-[#f9f6ed] dark:bg-[#59382a] border border-[#e1d0a7] dark:border-[#7a4e2e] rounded-lg text-[#59382a] dark:text-[#f9f6ed] placeholder-[#996936] dark:placeholder-[#d0b274] focus:outline-none focus:ring-2 focus:ring-[#b28341] focus:border-transparent transition-colors resize-none"
              placeholder="Street, Barangay, City, Province, Postal Code"
            />
          </div>

          {/* Map Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-[#7a4e2e] dark:text-[#e1d0a7]">
                Pin Delivery Location
              </label>
              <button
                type="button"
                className="text-xs px-3 py-1 rounded-md bg-[#b28341] text-white hover:bg-[#996936]"
                onClick={handleUseMyLocation}
              >
                Use my location
              </button>
            </div>
            <div className="rounded-lg overflow-hidden border border-[#e1d0a7] dark:border-[#7a4e2e]">
              <MapContainer
                center={center}
                zoom={13}
                style={{ height: 300, width: "100%" }}
                scrollWheelZoom
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onPick={handleMapClick} />
                {hasPin && (
                  <Marker
                    position={[
                      formData.latitude as number,
                      formData.longitude as number,
                    ]}
                    icon={defaultIcon}
                    draggable
                    eventHandlers={{
                      dragend: (e) => {
                        const m = e.target as L.Marker;
                        const { lat, lng } = m.getLatLng();
                        handleMapClick(lat, lng);
                      },
                    }}
                  />
                )}
              </MapContainer>
            </div>
            <div className="mt-2 text-xs text-[#996936] dark:text-[#d0b274]">
              {hasPin ? (
                <span>
                  Selected: {formData.latitude?.toFixed(6)},{" "}
                  {formData.longitude?.toFixed(6)}
                </span>
              ) : (
                <span>Tap on the map to select your location.</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 bg-[#f9f6ed] dark:bg-[#59382a] border-t border-[#e1d0a7] dark:border-[#7a4e2e]">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 px-4 bg-white dark:bg-[#67412c] border border-[#e1d0a7] dark:border-[#7a4e2e] text-[#7a4e2e] dark:text-[#e1d0a7] font-medium rounded-lg hover:bg-[#f9f6ed] dark:hover:bg-[#59382a] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              !formData.name.trim() ||
              !formData.phone.trim() ||
              !formData.address.trim()
            }
            className="flex-1 py-3 px-4 bg-[#b28341] hover:bg-[#996936] disabled:bg-[#d0b274] disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddressModal;
