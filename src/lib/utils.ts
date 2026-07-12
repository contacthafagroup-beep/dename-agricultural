import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatWeight(weight: number, unit = "MT"): string {
  return `${weight.toLocaleString()} ${unit}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    limited: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    sold_out: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    pending_review: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    quotation_sent: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    quotation_accepted: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
    awaiting_payment: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    payment_submitted: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
    payment_verified: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    preparing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    packaging: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    dispatched: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };
  return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    available: "Available",
    limited: "Limited Stock",
    sold_out: "Sold Out",
    pending_review: "Pending Review",
    quotation_sent: "Quotation Sent",
    quotation_accepted: "Quotation Accepted",
    awaiting_payment: "Awaiting Payment",
    payment_submitted: "Payment Submitted",
    payment_verified: "Payment Verified",
    preparing: "Preparing Order",
    packaging: "Packaging",
    dispatched: "Dispatched",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
}

export function generateOrderNumber(): string {
  const prefix = "DGS";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function generateQuotationNumber(): string {
  const prefix = "QT";
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${prefix}-${year}-${random}`;
}

export function generateInvoiceNumber(): string {
  const prefix = "INV";
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${prefix}-${year}-${random}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
