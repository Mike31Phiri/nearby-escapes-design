export type TransactionStatus = "paid" | "pending" | "failed" | "refunded";
export type TransactionType = "booking" | "adjustment" | "refund" | "payout";

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  description: string;
  guestName?: string;
  amount: number;
  status: TransactionStatus;
}

export interface MonthlyRevenue {
  month: string;
  earnings: number;
}

export interface FinancesSummary {
  totalEarnedYTD: number;
  expectedPayouts: number;
  platformFeesYTD: number;
  monthlyData: MonthlyRevenue[];
  recentTransactions: Transaction[];
}

export const mockFinances: FinancesSummary = {
  totalEarnedYTD: 24500.0,
  expectedPayouts: 3200.0,
  platformFeesYTD: 1225.0, // Assuming a flat 5% host fee for demonstration
  monthlyData: [
    { month: "Jan", earnings: 2100 },
    { month: "Feb", earnings: 1800 },
    { month: "Mar", earnings: 2500 },
    { month: "Apr", earnings: 3200 },
    { month: "May", earnings: 4500 },
    { month: "Jun", earnings: 5100 },
  ],
  recentTransactions: [
    {
      id: "TRX-1092",
      date: "2026-06-21",
      type: "booking",
      description: "Payout for booking #BK-902",
      guestName: "Alice Walker",
      amount: 450.0,
      status: "paid",
    },
    {
      id: "TRX-1093",
      date: "2026-06-25",
      type: "booking",
      description: "Upcoming payout #BK-915",
      guestName: "Marcus Thorne",
      amount: 820.0,
      status: "pending",
    },
    {
      id: "TRX-1094",
      date: "2026-06-28",
      type: "booking",
      description: "Upcoming payout #BK-918",
      guestName: "Emma Lewis",
      amount: 1100.0,
      status: "pending",
    },
    {
      id: "TRX-1088",
      date: "2026-06-15",
      type: "refund",
      description: "Cancellation refund #BK-880",
      guestName: "David Kim",
      amount: -150.0,
      status: "refunded",
    },
    {
      id: "TRX-1085",
      date: "2026-06-10",
      type: "booking",
      description: "Payout for booking #BK-875",
      guestName: "Sarah Jenkins",
      amount: 600.0,
      status: "paid",
    },
    {
      id: "TRX-1084",
      date: "2026-06-08",
      type: "adjustment",
      description: "Resolution center adjustment",
      guestName: "Tom Hardy",
      amount: 50.0,
      status: "paid",
    },
    {
      id: "TRX-1070",
      date: "2026-05-28",
      type: "payout",
      description: "Bank transfer (Ending in 4092)",
      amount: -2500.0,
      status: "paid",
    },
  ],
};
