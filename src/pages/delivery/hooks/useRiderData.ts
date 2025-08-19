import { useState, useEffect, useCallback, useMemo } from "react";
import deliveryApi from "../../../services/deliveryApi";
import type { HistoryItem, Task, RiderStats } from "../types/rider";

interface Transaction {
  _id: string;
  transactionId: string;
  status: string;
  totalAmount: number;
  deliveryFee: number;
  shippingAddress: string;
  items: Array<{ name: string; quantity: number }>;
  updatedAt: string;
  statusHistory: Array<{ status: string; timestamp: string }>;
  customerId?: {
    firstName?: string;
    lastName?: string;
    contactNumber?: string;
  };
  deliveryInfo?: {
    latitude: number;
    longitude: number;
  };
}

interface UseRiderDataReturn {
  stats: RiderStats;
  history: HistoryItem[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  activeTask: Task | null;
}

export const useRiderData = (): UseRiderDataReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [stats, setStats] = useState<RiderStats>({
    todayDeliveries: 0,
    todayEarnings: 0,
    totalDeliveries: 0,
    totalEarnings: 0,
    recentActivity: [],
  });

  // Commented out as it's not currently used
  // const MOCK_HISTORY: HistoryItem[] = [];

  // Calculate history from transactions
  const { history } = useMemo(() => {
    const completedTransactions = transactions.filter(
      (t: Transaction) =>
        t.status === "completed" || t.status === "delivery_completed"
    );

    // Get the most recent status update for each transaction
    const getLatestStatus = (
      statusHistory: Array<{ status: string; timestamp: string }>
    ) => {
      if (!statusHistory || statusHistory.length === 0) return null;
      return [...statusHistory].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];
    };

    // Map transactions to history items
    const historyItems: HistoryItem[] = completedTransactions.map(
      (t: Transaction) => {
        const latestStatus = getLatestStatus(t.statusHistory);
        return {
          id: t.transactionId || t._id,
          date: latestStatus
            ? new Date(latestStatus.timestamp).toLocaleString()
            : "N/A",
          items: t.items
            .map(
              (it: { name: string; quantity: number }) =>
                `${it.quantity}x ${it.name}`
            )
            .join(", "),
          location: t.shippingAddress,
          fee: t.deliveryFee,
        };
      }
    );

    return {
      history: historyItems,
    };
  }, [transactions]);

  const fetchRiderData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch rider's tasks and stats in parallel
      const [tasksResponse, statsResponse] = await Promise.all([
        deliveryApi.getMyTasks(),
        deliveryApi.getRiderStats(),
      ]);

      // Get current transactions to ensure we have the latest data
      const currentTransactions: Transaction[] = transactions;

      // Process tasks
      if (tasksResponse.data?.data) {
        const newTransactions = Array.isArray(tasksResponse.data.data)
          ? tasksResponse.data.data
          : [];

        // Only update transactions if they've changed
        if (
          JSON.stringify(newTransactions) !==
          JSON.stringify(currentTransactions)
        ) {
          setTransactions(newTransactions);
        }

        // Process active task - check for any task that's not completed/cancelled
        const active = transactions.find((t: Transaction) =>
          !["completed", "cancelled", "delivery_completed"].includes(t.status)
        );

        console.log(
          "Active task statuses:",
          transactions.map((t: Transaction) => ({
            id: t.transactionId || t._id,
            status: t.status,
            isActive: ![
              "completed",
              "cancelled",
              "delivery_completed",
            ].includes(t.status),
          }))
        );

        if (active) {
          const taskData: Task = {
            dbId: active._id, // Ensure dbId is always set
            id: active.transactionId || active._id,
            items: active.items
              .map(
                (it: { name: string; quantity: number }) =>
                  `${it.quantity}x ${it.name}`
              )
              .join(", "),
            amount: active.totalAmount,
            distance: "N/A",
            fee: active.deliveryFee || 50,
            address: active.shippingAddress || "—",
            customer: active.customerId
              ? [
                  active.customerId.firstName,
                  active.customerId.lastName,
                ]
                  .filter(Boolean)
                  .join(" ") || "Customer"
              : "Customer",
            status: (() => {
              // Map backend status to frontend status
              const statusMap: Record<string, 'pending' | 'accepted' | 'picked-up' | 'delivered' | 'in_transit' | 'pickup_completed'> = {
                'in_transit': 'in_transit',
                'pickup_completed': 'pickup_completed',
                'picked-up': 'picked-up',
                'accepted': 'accepted',
                'completed': 'delivered',
                'pending': 'pending'
              };
              return statusMap[active.status] || 'pending';
            })(),
            ...(active.deliveryInfo
              ? {
                  latitude: active.deliveryInfo.latitude,
                  longitude: active.deliveryInfo.longitude,
                }
              : {}),
            // Include contact number if available
            ...(active.customerId?.contactNumber
              ? { phone: active.customerId.contactNumber }
              : {})
          };

          console.log("Setting active task:", taskData);
          setActiveTask(taskData);
        } else {
          setActiveTask(null);
        }
      }

      // Calculate today's date at midnight for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate today's deliveries and earnings from transactions
      const transactionsToUse: Transaction[] = Array.isArray(
        tasksResponse.data?.data
      )
        ? tasksResponse.data.data
        : currentTransactions;

      const todayTransactions = transactionsToUse.filter((t) => {
        if (!t.updatedAt) return false;
        const updatedAt = new Date(t.updatedAt);
        return (
          updatedAt >= today &&
          (t.status === "completed" || t.status === "delivery_completed")
        );
      });

      const todayDeliveries = todayTransactions.length;
      const todayEarnings = todayTransactions.reduce<number>(
        (sum, t) => sum + (t.deliveryFee || 0),
        0
      );

      // Process stats from backend
      if (statsResponse.data?.data) {
        const stats = statsResponse.data.data;
        setStats((prev) => ({
          ...prev,
          todayDeliveries,
          todayEarnings,
          totalDeliveries: stats.totalDeliveries || 0,
          totalEarnings: stats.lifetimeEarnings || 0,
          lifetimeEarnings: stats.lifetimeEarnings || 0,
          recentActivity: prev.recentActivity, // Preserve existing recent activity
        }));
      }
    } catch (e: unknown) {
      console.error("Error fetching rider data:", e);
      const errorMessage =
        e instanceof Error ? e : new Error("Failed to fetch rider data");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [transactions]);

  // Fetch data on component mount
  useEffect(() => {
    fetchRiderData();
  }, [fetchRiderData]);

  return useMemo(
    () => ({
      stats,
      history,
      isLoading,
      error,
      refresh: fetchRiderData,
      activeTask,
    }),
    [stats, history, isLoading, error, fetchRiderData, activeTask]
  );
};
