import { useState, useEffect, useCallback } from "react";
import deliveryApi from "../../../services/deliveryApi";
import type { Task, HistoryItem } from "../types/rider";

// Haversine helpers (KM)
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

// API response types
type RecentActivity = {
  transactionId?: string;
  _id?: string;
  updatedAt?: string;
};

type RiderStatsResponse = {
  ok: boolean;
  data: {
    totalDeliveries: number;
    todayDeliveries: number;
    totalEarnings: number;
    todayEarnings: number;
    recentActivity: RecentActivity[];
  };
};

type ApiTaskItem = { quantity?: number; name?: string };
type ApiCustomer = {
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
};
type ApiTask = {
  _id?: string;
  transactionId?: string;
  items?: ApiTaskItem[];
  totalAmount?: number;
  shippingAddress?: string;
  status?: string;
  deliveryFee?: number;
  customerId?: ApiCustomer;
  deliveryInfo?: { latitude?: number; longitude?: number };
};
type MyTasksResponse = { ok: boolean; data: ApiTask[] };

const MOCK_HISTORY: HistoryItem[] = [
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
];

export const useRiderData = () => {
  // State for dashboard stats (dynamic)
  const [stats, setStats] = useState({
    todayDeliveries: 0,
    todayEarnings: 0,
    totalDeliveries: 0,
  });

  // State for dashboard history (dynamic)
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // State for the rider's active task (dynamic)
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch rider stats from API
  const fetchRiderStats = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await deliveryApi.getRiderStats();
      const rs = data as RiderStatsResponse;
      if (rs?.ok) {
        setStats({
          todayDeliveries: rs.data.todayDeliveries,
          todayEarnings: rs.data.todayEarnings,
          totalDeliveries: rs.data.totalDeliveries,
        });
        const normalized: HistoryItem[] = (rs.data.recentActivity || []).map(
          (a: RecentActivity) => ({
            id: a.transactionId || a._id || "N/A",
            date: a.updatedAt ? new Date(a.updatedAt).toLocaleString() : "",
            items: "—",
            location: "—",
            fee: 50,
          })
        );
        setHistory(normalized);
      }
    } catch (e: unknown) {
      console.error("Error fetching rider stats:", e);
      const message =
        e instanceof Error ? e.message : "Failed to fetch rider stats";
      setError(message);
      // Fallback to mock data on error
      setStats({
        todayDeliveries: 12,
        todayEarnings: 2450,
        totalDeliveries: 156,
      });
      setHistory(MOCK_HISTORY);
    } finally {
      setLoading(false);
    }
  }, []);

  // Try to get browser geolocation (best-effort)
  const requestGeolocation = () =>
    new Promise<{ lat: number; lng: number } | null>((resolve) => {
      if (!("geolocation" in navigator)) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 7000 }
      );
    });

  // Fetch currently assigned task for the rider
  const fetchActiveTask = useCallback(async () => {
    try {
      const coords = await requestGeolocation();
      const { data } = await deliveryApi.getMyTasks();
      const resp = data as MyTasksResponse;
      const list: ApiTask[] = resp?.data || [];

      // Only consider an in_transit task as active
      const t: ApiTask | undefined = list.find(
        (x) => x.status === "in_transit"
      );

      if (!t) {
        setActiveTask(null);
        return;
      }

      let distanceStr = "—";
      const dropLat = t?.deliveryInfo?.latitude;
      const dropLng = t?.deliveryInfo?.longitude;
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

      const mapped: Task = {
        dbId: t._id,
        id: t.transactionId || t._id || "N/A",
        items: Array.isArray(t.items)
          ? t.items
              .map((it: ApiTaskItem) => `${it.quantity}x ${it.name}`)
              .join(", ")
          : "—",
        amount: t.totalAmount ?? 0,
        distance: distanceStr,
        fee: t.deliveryFee ?? 50,
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

      setActiveTask(mapped);
    } catch (e: unknown) {
      console.warn("Error fetching active task:", e);
      // Don't block dashboard on failure
      setActiveTask(null);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchRiderStats();
    fetchActiveTask();
  }, [fetchRiderStats, fetchActiveTask]);

  // Return both dynamic and mock data
  return {
    // Dashboard data (dynamic)
    stats,
    history,
    loading,
    error,
    refresh: fetchRiderStats,

    // Active task (dynamic)
    activeTask,

    // Helper to get mock history if needed
    getMockHistory: () => MOCK_HISTORY,

    // Allow consumers to refresh active task explicitly
    refreshActiveTask: fetchActiveTask,
  };
};
