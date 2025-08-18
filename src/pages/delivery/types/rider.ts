export interface Task {
  dbId?: string;
  id: string;
  items: string;
  amount: number;
  distance: string;
  fee: number;
  address: string;
  customer?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  status: "pending" | "accepted" | "picked-up" | "delivered";
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
