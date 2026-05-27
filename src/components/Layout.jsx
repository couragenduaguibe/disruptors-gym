import React, { useState, useRef, useEffect } from "react";
import {
  Dumbbell, Users, CalendarDays, UserCheck, TrendingUp, X, Menu,
  Award, BarChart3, CreditCard, LogOut, ShoppingCart, Megaphone, DoorOpen,
  Send, QrCode, ShoppingBag, MessageSquare, Bell, Package, Layers,
  Activity, Gift, Clock, Wrench, DollarSign, Video, Trophy,
} from "lucide-react";
import { ROLES } from "../data/roles";
import { NAV_BY_ROLE } from "../data/seed";

const NAV_ITEMS = {
  dashboard:       { label: "Overview",        icon: TrendingUp   },
  members:         { label: "Members",          icon: Users        },
  classes:         { label: "Classes",          icon: CalendarDays },
  trainers:        { label: "Trainers",         icon: Award        },
  checkins:        { label: "Check-ins",        icon: UserCheck    },
  payments:        { label: "Payments",         icon: CreditCard   },
  analytics:       { label: "Analytics",        icon: BarChart3    },
  pos:             { label: "Point of Sale",    icon: ShoppingCart },
  leads:           { label: "Leads",            icon: Megaphone    },
  access:          { label: "Access Control",   icon: DoorOpen     },
  messages:        { label: "Broadcasts",       icon: Send         },
  "member-stocks": { label: "Member Stocks",    icon: Package      },
  chat:            { label: "Messages",         icon: MessageSquare},
  "trainer-home":  { label: "Today",            icon: TrendingUp   },
  "my-classes":    { label: "My Classes",       icon: CalendarDays },
  "my-clients":    { label: "My Clients",       icon: Users        },
  "member-home":   { label: "Home",             icon: TrendingUp   },
  "my-qr":         { label: "My QR Code",       icon: QrCode       },
  "book-classes":  { label: "Book Classes",     icon: CalendarDays },
  "my-history":    { label: "My Visits",        icon: UserCheck    },
  "my-payments":   { label: "Payments",         icon: CreditCard   },
  "my-shop":       { label: "Shop",             icon: ShoppingBag  },
  "my-stock":      { label: "My Stock",         icon: Layers       },
  "my-workouts":   { label: "Workout Log",      icon: Dumbbell     },
  "my-metrics":    { label: "Body Metrics",     icon: Activity     },
  "my-rewards":    { label: "Rewards",          icon: Gift         },
  "my-referrals":  { label: "Referrals",        icon: Users        },
  challenges:      { label: "Challenges",       icon: Trophy       },
  shifts:          { label: "Staff Shifts",     icon: Clock        },
  equipment:       { label: "Equipment",        icon: Wrench       },
  expenses:        { label: "Expenses & P&L",   icon: DollarSign   },
  "video-library": { label: "Video Library",    icon: Video        },
};

export function Sidebar({ view, setView, isOpen, onClose, user, onLogout }) {
  const items = NAV_BY_ROLE[user.role].map((id) => ({ id, ...NAV_ITEMS[id] }));
  const role = ROLES[user.role];
  const RoleIcon = role.icon;

  return (
    <aside className={`
      fixed lg:sticky top-0 left-0 h-screen w-64 bg-stone-950 border-r border-stone-800 text-stone-100 flex flex-col z-50
      transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
    `}>
      <div className="p-5 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display text-xl font-semibold text-white">Disruptors</div>
            <div className="text-xs text-stone-500 font-mono tracking-wider">GYM OS</div>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 text-stone-500 hover:text-white transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {items.map((it) => {
          const Icon = it.icon;
          const active = view === it.id;
          return (
            <button key={it.id} onClick={() => setView(it.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-red-600 text-white"
                  : "text-stone-400 hover:bg-stone-800 hover:text-white"
              }`}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{it.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-stone-800">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center font-semibold text-white shrink-0">
            {user.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{user.name}</div>
            <div className="text-xs text-stone-500 truncate flex items-center gap-1">
              <RoleIcon className="w-3 h-3" />{role.label}
            </div>
          </div>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-500 hover:text-white hover:bg-stone-800 rounded-md transition">
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

  useEffect(() => {
    const handler = (e) => { if (bellRef.current && !bellRef.current.contains(e.target)) setShowNotifs(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const notifIcon = { message: "💬", class: "🏋️", payment: "💳", order: "📦" };

  const titles = {
    dashboard: "Overview", members: "Members", classes: "Class Schedule",
    trainers: "Trainers", checkins: "Check-in Log", payments: "Payments",
    analytics: "Analytics", pos: "Point of Sale", leads: "Sales Pipeline",
    access: "Access Control", messages: "Broadcasts", chat: "Messages",
    "member-stocks": "Member Stocks",
    "trainer-home": `Welcome, ${user.name.split(" ")[0]}`,
    "my-classes": "My Classes", "my-clients": "My Clients",
    "member-home": `Hi, ${user.name.split(" ")[0]}`,
    "my-qr": "My QR Code", "book-classes": "Book a Class",
    "my-history": "Visit History", "my-payments": "My Payments",
    "my-shop": "Gym Shop", "my-stock": "My Stock",
    "my-workouts": "Workout Log", "my-metrics": "Body Metrics",
    "my-rewards": "My Rewards", "my-referrals": "Referrals",
    challenges: "Challenges", shifts: "Staff Shifts",
    equipment: "Equipment", expenses: "Expenses & P&L",
    "video-library": "Video Library",
  };

  const now = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-4 pb-3 border-b border-stone-800 bg-stone-950/95 backdrop-blur sticky top-0 z-30">
      <div className="flex items-center justify-between max-w-7xl gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 -ml-1 hover:bg-stone-800 rounded-lg transition shrink-0">
          <Menu className="w-5 h-5 text-stone-300" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono text-stone-600 tracking-widest uppercase mb-0.5 truncate">{now}</div>
          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-white truncate leading-tight">
            {titles[view]}
          </h1>
        </div>

        {/* Notification bell */}
        <div className="relative shrink-0" ref={bellRef}>
          <button onClick={() => setShowNotifs((v) => !v)}
            className="relative p-2 hover:bg-stone-800 rounded-lg transition">
            <Bell className="w-5 h-5 text-stone-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-stone-900 border border-stone-700 rounded-xl shadow-xl shadow-black/50 z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-stone-700">
                <div className="font-semibold text-sm text-white">Notifications</div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-red-400 hover:text-red-300 font-medium transition">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {myNotifs.length === 0 ? (
                  <div className="p-6 text-center text-stone-500 text-sm">No notifications</div>
                ) : (
                  myNotifs.slice(0, 10).map((n) => (
                    <div key={n.id}
                      className={`px-4 py-3 border-b border-stone-800 last:border-0 ${!n.read ? "bg-red-950/30" : ""}`}>
                      <div className="flex gap-3">
                        <span className="text-lg shrink-0">{notifIcon[n.type] || "🔔"}</span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm truncate ${!n.read ? "font-semibold text-white" : "font-medium text-stone-300"}`}>
                            {n.title}
                          </div>
                          <div className="text-xs text-stone-500 mt-0.5 line-clamp-2">{n.body}</div>
                          <div className="text-[10px] font-mono text-stone-600 mt-1">
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
