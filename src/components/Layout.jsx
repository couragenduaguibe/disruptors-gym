import React, { useState, useRef, useEffect } from "react";
import {
  Dumbbell, Users, CalendarDays, UserCheck, TrendingUp, X, Menu,
  Award, BarChart3, CreditCard, LogOut, ShoppingCart, Megaphone, DoorOpen,
  Send, QrCode, ShoppingBag, MessageSquare, Bell, Package, Layers,
} from "lucide-react";
import { ROLES } from "../data/roles";
import { NAV_BY_ROLE } from "../data/seed";

const NAV_ITEMS = {
  dashboard: { label: "Overview", icon: TrendingUp },
  members: { label: "Members", icon: Users },
  classes: { label: "Classes", icon: CalendarDays },
  trainers: { label: "Trainers", icon: Award },
  checkins: { label: "Check-ins", icon: UserCheck },
  payments: { label: "Payments", icon: CreditCard },
  analytics: { label: "Analytics", icon: BarChart3 },
  pos: { label: "Point of Sale", icon: ShoppingCart },
  leads: { label: "Leads", icon: Megaphone },
  access: { label: "Access Control", icon: DoorOpen },
  messages: { label: "Broadcasts", icon: Send },
  "member-stocks": { label: "Member Stocks", icon: Package },
  chat: { label: "Messages", icon: MessageSquare },
  "trainer-home": { label: "Today", icon: TrendingUp },
  "my-classes": { label: "My Classes", icon: CalendarDays },
  "my-clients": { label: "My Clients", icon: Users },
  "member-home": { label: "Home", icon: TrendingUp },
  "my-qr": { label: "My QR Code", icon: QrCode },
  "book-classes": { label: "Book Classes", icon: CalendarDays },
  "my-history": { label: "My Visits", icon: UserCheck },
  "my-payments": { label: "Payments", icon: CreditCard },
  "my-shop": { label: "Shop", icon: ShoppingBag },
  "my-stock": { label: "My Stock", icon: Layers },
};

export function Sidebar({ view, setView, isOpen, onClose, user, onLogout }) {
  const items = NAV_BY_ROLE[user.role].map((id) => ({ id, ...NAV_ITEMS[id] }));
  const role = ROLES[user.role];
  const RoleIcon = role.icon;

  return (
    <aside className={`
      fixed lg:sticky top-0 left-0 h-screen w-64 bg-stone-900 text-stone-100 flex flex-col z-50
      transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
    `}>
      <div className="p-6 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display text-xl font-semibold">Disruptors</div>
            <div className="text-xs text-stone-400 font-mono tracking-wider">GYM OS</div>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 text-stone-400">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map((it) => {
          const Icon = it.icon;
          const active = view === it.id;
          return (
            <button key={it.id} onClick={() => setView(it.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                active ? "bg-red-500 text-white" : "text-stone-300 hover:bg-stone-800 hover:text-white"
              }`}>
              <Icon className="w-4 h-4" />
              {it.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-stone-800">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-amber-400 flex items-center justify-center font-semibold text-white">
            {user.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user.name}</div>
            <div className="text-xs text-stone-400 truncate flex items-center gap-1">
              <RoleIcon className="w-3 h-3" />{role.label}
            </div>
          </div>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-400 hover:text-white hover:bg-stone-800 rounded-md transition">
          <LogOut className="w-3.5 h-3.5" />Sign out
        </button>
      </div>
    </aside>
  );
}

export function Header({ view, onMenuClick, user, notifications, setNotifications }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const bellRef = useRef(null);

  const myNotifs = (notifications || [])
    .filter((n) => n.userId === user.username)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const unreadCount = myNotifs.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((ns) => ns.map((n) => n.userId === user.username ? { ...n, read: true } : n));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (bellRef.current && !bellRef.current.contains(e.target)) setShowNotifs(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const notifIcon = { message: "💬", class: "🏋️", payment: "💳", order: "📦" };

  const titles = {
    dashboard: "Overview", members: "Members", classes: "Class Schedule",
    trainers: "Trainers", checkins: "Check-in Log", payments: "Payments & Billing",
    analytics: "Analytics", pos: "Point of Sale", leads: "Sales Pipeline",
    access: "Access Control", messages: "Broadcasts", chat: "Messages",
    "member-stocks": "Member Stocks",
    "trainer-home": `Welcome, ${user.name.split(" ")[0]}`,
    "my-classes": "My Classes", "my-clients": "My Clients",
    "member-home": `Hi, ${user.name.split(" ")[0]}`,
    "my-qr": "My QR Code", "book-classes": "Book a Class",
    "my-history": "Visit History", "my-payments": "My Payments",
    "my-shop": "Gym Shop", "my-stock": "My Stock",
  };

  const now = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-2 border-b border-stone-200 bg-white/60 backdrop-blur sticky top-0 z-30">
      <div className="flex items-center justify-between max-w-7xl gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 hover:bg-stone-100 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] sm:text-xs font-mono text-stone-500 tracking-widest uppercase mb-0.5 sm:mb-1 truncate">{now}</div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold truncate">{titles[view]}</h1>
        </div>

        {/* Notification bell */}
        <div className="relative shrink-0" ref={bellRef}>
          <button onClick={() => setShowNotifs((v) => !v)}
            className="relative p-2 hover:bg-stone-100 rounded-lg transition">
            <Bell className="w-5 h-5 text-stone-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-stone-200 shadow-lg z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200">
                <div className="font-semibold text-sm">Notifications</div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-red-500 hover:text-red-700 font-medium">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {myNotifs.length === 0 ? (
                  <div className="p-6 text-center text-stone-400 text-sm">No notifications</div>
                ) : (
                  myNotifs.slice(0, 10).map((n) => (
                    <div key={n.id}
                      className={`px-4 py-3 border-b border-stone-100 last:border-0 ${!n.read ? "bg-red-50" : ""}`}>
                      <div className="flex gap-3">
                        <span className="text-lg shrink-0">{notifIcon[n.type] || "🔔"}</span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm truncate ${!n.read ? "font-semibold" : "font-medium"}`}>{n.title}</div>
                          <div className="text-xs text-stone-500 mt-0.5 line-clamp-2">{n.body}</div>
                          <div className="text-[10px] font-mono text-stone-400 mt-1">
                            {new Date(n.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                        {!n.read && <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0" />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
