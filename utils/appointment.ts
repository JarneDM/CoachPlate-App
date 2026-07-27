import type { Appointment } from "@/types/appointment";

export const STATUS_COLORS: Record<Appointment["status"], string> = {
  open: "#16a34a",
  scheduled: "#2563eb",
  completed: "#6b7280",
  canceled: "#ef4444",
  no_show: "#f59e0b",
};

export const STATUS_LABELS: Record<Appointment["status"], string> = {
  open: "Open",
  scheduled: "Scheduled",
  completed: "Completed",
  canceled: "Canceled",
  no_show: "No show",
};
