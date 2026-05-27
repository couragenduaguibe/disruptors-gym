// localStorage-based persistence (replaces the artifact's window.storage)
const PREFIX = "disruptors:";

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
  Basic:    "bg-stone-700 text-stone-200",
  Standard: "bg-sky-900/60 text-sky-300",
  Premium:  "bg-amber-900/50 text-amber-300",
}[plan] || "bg-stone-700 text-stone-200");

// ---------- Date helpers ----------
export const today = () => new Date().toISOString().slice(0, 10);
export const nowTime = () => new Date().toTimeString().slice(0, 5);
