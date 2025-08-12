import { useState } from "react";
import type { Task, HistoryItem } from "../types/rider";

export const useRiderData = () => {
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

  const stats = {
    todayDeliveries: 12,
    todayEarnings: 2450,
    totalDeliveries: 156,
  };

  return {
    tasks,
    activeTask,
    history,
    stats,
  };
};
