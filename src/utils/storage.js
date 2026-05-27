// localStorage-based persistence (replaces the artifact's window.storage)
const PREFIX = "ironside:";

export const loadData = (key, fallback) => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const saveData = (key, value) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error("save failed", e);
  }
};

export const clearData = (key) => {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {}
};

// ---------- Tailwind helpers ----------
export const planBadge = (plan) => ({
  Basic: "bg-stone-100 text-stone-700",
  Standard: "bg-sky-100 text-sky-800",
  Premium: "bg-amber-100 text-amber-800",
}[plan] || "bg-stone-100 text-stone-700");

// ---------- Date helpers ----------
export const today = () => new Date().toISOString().slice(0, 10);
export const nowTime = () => new Date().toTimeString().slice(0, 5);
