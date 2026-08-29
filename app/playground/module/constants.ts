export type SaleStatus = (typeof saleStatuses)[number];

export const saleStatuses = [
  "Pending",
  "Processing",
  "Completed",
  "Refunded",
  "Cancelled",
] as const;

export const saleStatusMeta: Record<SaleStatus, { color: string }> = {
  Pending: { color: "#F59E0B" },
  Processing: { color: "#3B82F6" },
  Completed: { color: "#10B981" },
  Refunded: { color: "#8B5CF6" },
  Cancelled: { color: "#EF4444" },
};

export type Product = (typeof products)[number];

export const products = [
  "Laptop",
  "Monitor",
  "Keyboard",
  "Mouse",
  "Headphones",
  "Webcam",
  "Desk",
  "Chair",
] as const;

export const productMeta: Record<Product, { color: string }> = {
  Laptop: { color: "#6366F1" },
  Monitor: { color: "#06B6D4" },
  Keyboard: { color: "#8B5CF6" },
  Mouse: { color: "#EC4899" },
  Headphones: { color: "#F97316" },
  Webcam: { color: "#14B8A6" },
  Desk: { color: "#A16207" },
  Chair: { color: "#64748B" },
};

export type Sale = {
  id: string;
  customerName: string;
  customerEmail: string;
  salesRep: string | null;
  notes: string;
  amount: number;
  isPaid: boolean;
  purchasedAt: Date;
  status: SaleStatus;
  products: Product[];
  shippingAddress: {
    city: string;
    country: string;
  };
  deliveryPeriod: {
    from: Date;
    to: Date;
  };
  availableDates: Date[];
  preferredTime: string;
  deliveryTimes: string[];
};
