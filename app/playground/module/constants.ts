import {
  ArrowsUpFromLineIcon,
  ClockIcon,
  LucideIcon,
  PackageCheckIcon,
  PackageXIcon,
} from "lucide-react";

export type SaleStatus = (typeof saleStatuses)[number];

export const saleStatuses = [
  "pending",
  "processing",
  "completed",
  "refunded",
  "cancelled",
] as const;

export const saleStatusMeta: Record<
  SaleStatus,
  { label: string; color: string; icon: LucideIcon }
> = {
  pending: { label: "Pending", color: "#F59E0B", icon: ClockIcon },
  processing: {
    label: "On Process",
    color: "#3B82F6",
    icon: ArrowsUpFromLineIcon,
  },
  completed: { label: "Completed", color: "#10B981", icon: PackageCheckIcon },
  refunded: { label: "Refunded", color: "#8B5CF6", icon: PackageXIcon },
  cancelled: { label: "Cancelled", color: "#EF4444", icon: PackageXIcon },
};

export type Product = (typeof products)[number];

export const products = [
  "laptop",
  "monitor",
  "keyboard",
  "mouse",
  "headphones",
  "webcam",
  "desk",
  "chair",
] as const;

export const productMeta: Record<Product, { label: string; color: string }> = {
  laptop: { label: "Laptop", color: "#6366F1" },
  monitor: { label: "Monitor", color: "#06B6D4" },
  keyboard: { label: "Keyboard", color: "#8B5CF6" },
  mouse: { label: "Mouse", color: "#EC4899" },
  headphones: { label: "Headphones", color: "#F97316" },
  webcam: { label: "Webcam", color: "#14B8A6" },
  desk: { label: "Desk", color: "#A16207" },
  chair: { label: "Chair", color: "#64748B" },
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
