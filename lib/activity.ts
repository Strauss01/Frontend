export interface ActivityEntry {
  id: string;
  type: "upload" | "analysis" | "login" | "logout";
  message: string;
  timestamp: string;
}

const STORAGE_KEY = "statura:activity";

export function logActivity(entry: Omit<ActivityEntry, "id" | "timestamp">) {
  if (typeof window === "undefined") return;
  const existing: ActivityEntry[] = JSON.parse(
    localStorage.getItem(STORAGE_KEY) ?? "[]"
  );
  const newEntry: ActivityEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  const updated = [newEntry, ...existing].slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getActivity(): ActivityEntry[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
}
