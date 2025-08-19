export interface Task {
  dbId?: string;
  id: string;
  items: string;
  amount: number;
  distance: string;
  fee: number;
  address: string;
  customer: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  status: 'pending' | 'accepted' | 'picked-up' | 'delivered' | 'in_transit' | 'pickup_completed';
}

export interface RiderStats {
  todayDeliveries: number;
  todayEarnings: number;
  totalDeliveries: number;
  totalEarnings: number;
  lifetimeEarnings?: number; // From backend
  recentActivity: HistoryItem[];
}

export interface HistoryItem {
  id: string;
  date: string;
  items: string;
  location: string;
  fee: number;
}

export interface UploadedFile {
  file: File;
  preview: string;
  type: "pickup" | "delivery";
}

export type DeliveryState = "accepted" | "picked-up" | "ready-to-deliver";

export type ActiveSection =
  | "dashboard"
  | "tasks"
  | "active"
  | "history"
  | "profile";
