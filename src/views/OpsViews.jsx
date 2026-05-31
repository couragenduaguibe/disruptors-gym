import React, { useState } from "react";
import { Clock, Plus, Edit2, Trash2, Wrench, AlertTriangle, DollarSign, TrendingUp, TrendingDown, Play, Video } from "lucide-react";
import { EmptyState, Modal } from "../components/ui";
import { today } from "../utils/storage";
import { DEMO_ACCOUNTS } from "../data/seed";

const STAFF_ACCOUNTS = DEMO_ACCOUNTS.filter((a) => a.role !== "member");

// ======================================================================
// STAFF SHIFT SCHEDULER
// ======================================================================
export function StaffShiftsView({ user, shifts, setShifts }) {
  const [showForm, setShowForm] = useState(false);
  const [editShift, setEditShift] = useState(null);
  const canEdit = user.role === "admin";

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  const deleteShift = (id) => setShifts((s) => s.filter((sh) => sh.id !== id));

  const upcomingCount = shifts.filter((s) => s.date >= today()).length;
  const staffCount = new Set(shifts.map((s) => s.staffId)).size;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-3">
          <div className="bg-stone-900 rounded-xl border border-stone-700 p-4 text-center">
            <div className="font-display text-3xl font-semibold text-white">{upcomingCount}</div>
            <div className="text-xs font-mono text-stone-500 tracking-wider uppercase mt-0.5">Upcoming shifts</div>
          </div>
          <div className="bg-stone-900 rounded-xl border border-stone-700 p-4 text-center">
            <div className="font-display text-3xl font-semibold text-white">{staffCount}</div>
            <div className="text-xs font-mono text-stone-500 tracking-wider uppercase mt-0.5">Staff on roster</div>
          </div>
        </div>
        {canEdit && (
          <button onClick={() => { setEditShift(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
            <Plus className="w-4 h-4" /> Add shift
          </button>
        )}
      </div>

      <div className="space-y-4">
        {days.map((date) => {
          const dayShifts = shifts.filter((s) => s.date === date).sort((a, b) => a.startTime.localeCompare(b.startTime));
          const isToday = date === today();
          const label = isToday ? "Today" : new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
          return (
            <div key={date} className={`bg-stone-900 rounded-xl border p-5 ${isToday ? "border-red-700" : "border-stone-700"}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-xs font-mono tracking-widest text-stone-500 uppercase">{label}</div>
                {isToday && <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-mono font-semibold">TODAY</span>}
              </div>
              {dayShifts.length === 0 ? (
                <p className="text-sm text-stone-500 text-center py-4">No shifts scheduled</p>
              ) : (
                <div className="space-y-2">
                  {dayShifts.map((sh) => (
                    <div key={sh.id} className="flex items-center gap-3 p-3 bg-stone-800 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-700 to-stone-600 flex items-center justify-center font-semibold text-stone-200 shrink-0 text-sm">
                        {sh.staffName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-stone-200">{sh.staffName}</div>
                        <div className="text-xs text-stone-500"><span className="capitalize">{sh.role}</span> · {sh.location}</div>
                      </div>
                      <div className="text-xs font-mono text-stone-300 font-semibold shrink-0">{sh.startTime} – {sh.endTime}</div>
                      {canEdit && (
                        <div className="flex gap-0.5 shrink-0">
                          <button onClick={() => { setEditShift(sh); setShowForm(true); }} className="p-1.5 text-stone-500 hover:text-stone-200 rounded transition">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteShift(sh.id)} className="p-1.5 text-stone-500 hover:text-rose-400 rounded transition">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showForm && (
        <ShiftForm
          shift={editShift}
          onSave={(sh) => {
            setShifts((ss) => editShift ? ss.map((s) => s.id === sh.id ? sh : s) : [...ss, { ...sh, id: `sh${Date.now()}` }]);
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function ShiftForm({ shift, onSave, onClose }) {
  const [form, setForm] = useState(shift || {
    staffId: STAFF_ACCOUNTS[0].username, staffName: STAFF_ACCOUNTS[0].name,
    role: STAFF_ACCOUNTS[0].role, date: today(), startTime: "08:00", endTime: "16:00",
    location: "Main Floor", notes: "",
  });
  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));
  const handleStaff = (username) => {
    const acc = STAFF_ACCOUNTS.find((a) => a.username === username);
    setForm((f) => ({ ...f, staffId: acc.username, staffName: acc.name, role: acc.role }));
  };

  return (
    <Modal title={shift ? "Edit Shift" : "Add Shift"} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Staff member</label>
          <select value={form.staffId} onChange={(e) => handleStaff(e.target.value)}
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500">
            {STAFF_ACCOUNTS.map((a) => <option key={a.username} value={a.username}>{a.name} ({a.role})</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Date</label>
          <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)}
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Start</label>
            <input type="time" value={form.startTime} onChange={(e) => set("startTime", e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">End</label>
            <input type="time" value={form.endTime} onChange={(e) => set("endTime", e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500" />
          </div>
        </div>
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Location</label>
          <select value={form.location} onChange={(e) => set("location", e.target.value)}
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500">
            {["Main Floor", "Reception", "Cardio Zone", "Weight Room", "Studio"].map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <button onClick={() => onSave(form)} className="w-full py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
          {shift ? "Update shift" : "Add shift"}
        </button>
      </div>
    </Modal>
  );
}

// ======================================================================
// EQUIPMENT MAINTENANCE
// ======================================================================
const STATUS = {
  operational: { label: "Operational", badge: "bg-red-900/40 text-red-300 border-red-800", icon: "text-red-400", bg: "bg-red-900/30" },
  maintenance: { label: "In Maintenance", badge: "bg-amber-900/40 text-amber-300 border-amber-800", icon: "text-amber-400", bg: "bg-amber-900/30" },
  "out-of-service": { label: "Out of Service", badge: "bg-rose-900/40 text-rose-300 border-rose-800", icon: "text-rose-400", bg: "bg-rose-900/30" },
};
const EQ_CATEGORIES = ["Cardio", "Free Weights", "Machines", "Studio", "Other"];

export function EquipmentView({ user, equipment, setEquipment }) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const canEdit = user.role === "admin" || user.role === "receptionist";

  const operational = equipment.filter((e) => e.status === "operational").length;
  const maintenance = equipment.filter((e) => e.status === "maintenance").length;
  const outOfService = equipment.filter((e) => e.status === "out-of-service").length;
  const needsAttention = maintenance + outOfService;

  const grouped = EQ_CATEGORIES.reduce((acc, cat) => {
    const items = equipment.filter((e) => e.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-stone-900 rounded-xl border border-stone-700 p-4 text-center">
          <div className="font-display text-3xl font-semibold text-red-400">{operational}</div>
          <div className="text-[10px] font-mono text-stone-500 uppercase mt-0.5 leading-tight">Operational</div>
        </div>
        <div className={`rounded-xl border p-4 text-center ${maintenance > 0 ? "bg-amber-950/20 border-amber-800" : "bg-stone-900 border-stone-700"}`}>
          <div className={`font-display text-3xl font-semibold ${maintenance > 0 ? "text-amber-400" : "text-stone-400"}`}>{maintenance}</div>
          <div className="text-[10px] font-mono text-stone-500 uppercase mt-0.5 leading-tight">Maintenance</div>
        </div>
        <div className={`rounded-xl border p-4 text-center ${outOfService > 0 ? "bg-rose-950/20 border-rose-800" : "bg-stone-900 border-stone-700"}`}>
          <div className={`font-display text-3xl font-semibold ${outOfService > 0 ? "text-rose-400" : "text-stone-400"}`}>{outOfService}</div>
          <div className="text-[10px] font-mono text-stone-500 uppercase mt-0.5 leading-tight">Out of svc</div>
        </div>
      </div>

      {needsAttention > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-950/30 border border-amber-800 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-300">
            <strong>{needsAttention} item{needsAttention !== 1 ? "s" : ""}</strong> need{needsAttention === 1 ? "s" : ""} attention. Update status once resolved.
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold text-white">Equipment ({equipment.length} items)</h3>
        {canEdit && (
          <button onClick={() => { setEditItem(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
            <Plus className="w-4 h-4" /> Add
          </button>
        )}
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-2 px-1">{cat} · {items.length}</div>
          <div className="space-y-2">
            {items.map((eq) => {
              const cfg = STATUS[eq.status] || STATUS.operational;
              const overdue = eq.nextService && eq.nextService <= today();
              return (
                <div key={eq.id} className={`bg-stone-900 rounded-xl border p-4 ${eq.status !== "operational" ? "border-amber-800/50" : "border-stone-700"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                      <Wrench className={`w-4 h-4 ${cfg.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="font-medium text-sm text-stone-100">{eq.name}</div>
                        <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full border ${cfg.badge}`}>{cfg.label}</span>
                        {overdue && <span className="text-[10px] bg-amber-900/50 text-amber-300 px-2 py-0.5 rounded-full font-mono">Service overdue</span>}
                      </div>
                      {eq.notes && <div className="text-xs text-stone-500 mt-0.5">{eq.notes}</div>}
                      <div className="text-[10px] font-mono text-stone-500 mt-0.5">Next service: {eq.nextService || "—"}</div>
                    </div>
                    {canEdit && (
                      <div className="flex items-center gap-1 shrink-0">
                        <select value={eq.status} onChange={(e) => setEquipment((es) => es.map((x) => x.id === eq.id ? { ...x, status: e.target.value } : x))}
                          className="text-xs border border-stone-700 rounded-lg px-2 py-1.5 bg-stone-800 text-stone-300 focus:outline-none hidden sm:block">
                          <option value="operational">Operational</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="out-of-service">Out of service</option>
                        </select>
                        <button onClick={() => { setEditItem(eq); setShowForm(true); }} className="p-1.5 text-stone-500 hover:text-stone-200 rounded transition">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {showForm && (
        <EquipmentForm
          item={editItem}
          onSave={(eq) => {
            setEquipment((es) => editItem ? es.map((e) => e.id === eq.id ? eq : e) : [...es, { ...eq, id: `eq${Date.now()}` }]);
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function EquipmentForm({ item, onSave, onClose }) {
  const [form, setForm] = useState(item || { name: "", category: "Cardio", status: "operational", purchaseDate: today(), lastService: today(), nextService: "", notes: "" });
  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  return (
    <Modal title={item ? "Edit Equipment" : "Add Equipment"} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Name</label>
          <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Treadmill #4"
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500">
              {EQ_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Status</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500">
              <option value="operational">Operational</option>
              <option value="maintenance">Maintenance</option>
              <option value="out-of-service">Out of service</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Last service</label>
            <input type="date" value={form.lastService} onChange={(e) => set("lastService", e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Next service</label>
            <input type="date" value={form.nextService} onChange={(e) => set("nextService", e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500" />
          </div>
        </div>
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Notes</label>
          <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Maintenance notes..."
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500 resize-none" rows={2} />
        </div>
        <button onClick={() => { if (!form.name) return; onSave(form); }} className="w-full py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
          {item ? "Update equipment" : "Add equipment"}
        </button>
      </div>
    </Modal>
  );
}

// ======================================================================
// EXPENSES & P&L
// ======================================================================
const EXP_CATEGORIES = ["Rent", "Utilities", "Staff Wages", "Equipment", "Marketing", "Supplies", "Insurance", "Other"];
const CAT_COLORS = {
  Rent: "bg-red-900/40 text-red-300",
  Utilities: "bg-sky-900/40 text-sky-300",
  "Staff Wages": "bg-violet-900/40 text-violet-300",
  Equipment: "bg-amber-900/40 text-amber-300",
  Marketing: "bg-pink-900/40 text-pink-300",
  Supplies: "bg-stone-700 text-stone-300",
  Insurance: "bg-teal-900/40 text-teal-300",
  Other: "bg-stone-700 text-stone-400",
};

export function ExpensesView({ user, expenses, setExpenses, payments }) {
  const [showForm, setShowForm] = useState(false);
  const [filterMonth, setFilterMonth] = useState(today().slice(0, 7));
  const canEdit = user.role === "admin";

  const monthExpenses = expenses.filter((e) => e.date.startsWith(filterMonth));
  const totalExpenses = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const revenue = payments.filter((p) => p.status === "paid" && p.date.startsWith(filterMonth)).reduce((s, p) => s + p.amount, 0);
  const profit = revenue - totalExpenses;

  const byCategory = EXP_CATEGORIES.reduce((acc, cat) => {
    const amt = monthExpenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0);
    if (amt > 0) acc[cat] = amt;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}
          className="px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500" />
        {canEdit && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition ml-auto">
            <Plus className="w-4 h-4" /> Add expense
          </button>
        )}
      </div>

      {/* P&L summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-stone-900 rounded-xl border border-stone-700 p-3">
          <div className="flex items-center gap-1 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <div className="text-[10px] font-mono text-stone-500 uppercase">Revenue</div>
          </div>
          <div className="font-display text-xl font-semibold text-white">₦{(revenue / 1000).toFixed(0)}K</div>
        </div>
        <div className={`rounded-xl border p-3 ${totalExpenses > 0 ? "bg-rose-950/20 border-rose-800" : "bg-stone-900 border-stone-700"}`}>
          <div className="flex items-center gap-1 mb-2">
            <TrendingDown className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <div className="text-[10px] font-mono text-stone-500 uppercase">Expenses</div>
          </div>
          <div className="font-display text-xl font-semibold text-rose-400">₦{(totalExpenses / 1000).toFixed(0)}K</div>
        </div>
        <div className={`rounded-xl border p-3 ${profit >= 0 ? "bg-red-950/20 border-red-800" : "bg-rose-950/20 border-rose-800"}`}>
          <div className="flex items-center gap-1 mb-2">
            <DollarSign className={`w-3.5 h-3.5 shrink-0 ${profit >= 0 ? "text-red-400" : "text-rose-400"}`} />
            <div className="text-[10px] font-mono text-stone-500 uppercase whitespace-nowrap">Net P&L</div>
          </div>
          <div className={`font-display text-xl font-semibold ${profit >= 0 ? "text-red-400" : "text-rose-400"}`}>
            {profit >= 0 ? "+" : ""}₦{(Math.abs(profit) / 1000).toFixed(0)}K
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      {Object.keys(byCategory).length > 0 && (
        <div className="bg-stone-900 rounded-xl border border-stone-700 p-5">
          <h3 className="font-display text-lg font-semibold mb-4 text-white">Breakdown by category</h3>
          <div className="space-y-3">
            {Object.entries(byCategory).sort(([, a], [, b]) => b - a).map(([cat, amt]) => {
              const pct = Math.round((amt / totalExpenses) * 100);
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${CAT_COLORS[cat]}`}>{cat}</span>
                    <span className="font-mono font-semibold text-stone-200">₦{amt.toLocaleString()} <span className="text-stone-500 font-normal text-xs">({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-stone-700 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expense list */}
      <div className="bg-stone-900 rounded-xl border border-stone-700 p-5">
        <h3 className="font-display text-lg font-semibold mb-4 text-white">Expense log</h3>
        {monthExpenses.length === 0 ? (
          <EmptyState icon={DollarSign} title="No expenses this month" subtitle="Add expenses to track your real profitability." />
        ) : (
          <div className="space-y-2">
            {[...monthExpenses].sort((a, b) => new Date(b.date) - new Date(a.date)).map((ex) => (
              <div key={ex.id} className="flex items-center gap-3 p-3 bg-stone-800 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${CAT_COLORS[ex.category]}`}>{ex.category}</span>
                    {ex.recurring && <span className="text-[10px] bg-stone-700 text-stone-400 px-2 py-0.5 rounded-full font-mono">Recurring</span>}
                  </div>
                  <div className="text-sm font-medium text-stone-200">{ex.description}</div>
                  <div className="text-[10px] font-mono text-stone-500">{new Date(ex.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </div>
                <div className="font-mono font-semibold text-rose-400 shrink-0">₦{ex.amount.toLocaleString()}</div>
                {canEdit && (
                  <button onClick={() => setExpenses((es) => es.filter((e) => e.id !== ex.id))} className="p-1.5 text-stone-600 hover:text-rose-400 transition shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ExpenseForm
          onSave={(ex) => { setExpenses((es) => [...es, { ...ex, id: `ex${Date.now()}` }]); setShowForm(false); }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function ExpenseForm({ onSave, onClose }) {
  const [form, setForm] = useState({ category: "Rent", amount: "", date: today(), description: "", recurring: false });
  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  return (
    <Modal title="Add Expense" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Category</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)}
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500">
            {EXP_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Amount (₦)</label>
          <input type="number" value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder="0"
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Description</label>
          <input type="text" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What was this for?"
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Date</label>
          <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)}
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.recurring} onChange={(e) => set("recurring", e.target.checked)} className="rounded accent-red-500" />
          <span className="text-sm text-stone-300">Recurring monthly expense</span>
        </label>
        <button onClick={() => { if (!form.amount || !form.description) return; onSave({ ...form, amount: parseFloat(form.amount) }); }}
          className="w-full py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
          Add expense
        </button>
      </div>
    </Modal>
  );
}

// ======================================================================
// VIDEO LIBRARY
// ======================================================================
const VID_CATEGORIES = ["All", "Technique", "Workout", "Recovery", "Nutrition"];
const EMOJIS = ["💪", "🏋️", "🧘", "🔥", "🎯", "⚡", "🏃", "🤸"];

export function VideoLibraryView({ user, videos, setVideos }) {
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [playing, setPlaying] = useState(null);
  const isTrainer = user.role === "trainer";

  const filtered = filter === "All" ? videos : videos.filter((v) => v.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {VID_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === cat ? "bg-red-600 text-white" : "bg-stone-800 border border-stone-700 text-stone-300 hover:border-stone-500"}`}>
              {cat}
            </button>
          ))}
        </div>
        {isTrainer && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition ml-auto">
            <Plus className="w-4 h-4" /> Upload video
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Video} title="No videos" subtitle={isTrainer ? "Upload your first workout video!" : "No videos in this category yet."} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((v) => (
            <div key={v.id} className="bg-stone-900 rounded-xl border border-stone-700 overflow-hidden hover:border-stone-500 transition group cursor-pointer" onClick={() => setPlaying(v)}>
              <div className="h-36 bg-gradient-to-br from-stone-800 to-stone-950 flex items-center justify-center relative">
                <span className="text-5xl">{v.emoji}</span>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40 rounded-t-xl">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 rounded px-1.5 py-0.5 text-[10px] font-mono text-white">{v.duration}</div>
                <div className="absolute top-2 left-2 bg-red-600/90 rounded-md px-2 py-0.5 text-[10px] font-mono text-white uppercase tracking-wider">{v.category}</div>
              </div>
              <div className="p-4">
                <div className="font-semibold text-sm leading-tight mb-1 text-stone-100">{v.title}</div>
                <div className="text-xs text-stone-500 mb-2">by {v.trainerName}</div>
                <div className="text-xs text-stone-500 line-clamp-2">{v.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {playing && (
        <Modal title={playing.title} subtitle={`${playing.duration} · ${playing.category} · ${playing.trainerName}`} onClose={() => setPlaying(null)}>
          <div className="space-y-4">
            <div className="h-52 bg-gradient-to-br from-stone-800 to-stone-950 rounded-xl flex flex-col items-center justify-center gap-3">
              <span className="text-6xl">{playing.emoji}</span>
              <div className="text-white/50 text-xs font-mono">Video preview · {playing.duration}</div>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">{playing.description}</p>
            <div className="text-xs text-stone-500 font-mono">
              Uploaded {new Date(playing.uploadDate + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
          </div>
        </Modal>
      )}

      {showForm && (
        <VideoUploadForm
          user={user}
          onSave={(v) => { setVideos((vs) => [{ ...v, id: `vid${Date.now()}`, uploadDate: today() }, ...vs]); setShowForm(false); }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function VideoUploadForm({ user, onSave, onClose }) {
  const [form, setForm] = useState({ title: "", category: "Technique", duration: "", emoji: "💪", description: "", trainerName: user.name, trainerId: user.trainerId || user.username });
  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  return (
    <Modal title="Upload Video" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Title</label>
          <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. 30-min Full Body Burn"
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500">
              {["Technique", "Workout", "Recovery", "Nutrition"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Duration</label>
            <input type="text" value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="e.g. 15:30"
              className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
          </div>
        </div>
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Thumbnail emoji</label>
          <div className="flex gap-2 flex-wrap">
            {EMOJIS.map((e) => (
              <button key={e} onClick={() => set("emoji", e)}
                className={`w-10 h-10 text-2xl rounded-lg border transition ${form.emoji === e ? "border-red-500 bg-stone-700 scale-110" : "border-stone-700 bg-stone-800 hover:border-stone-500"}`}>
                {e}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Description</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What will members learn or do?"
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500 resize-none" rows={2} />
        </div>
        <button onClick={() => { if (!form.title) return; onSave(form); }}
          className="w-full py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
          Upload video
        </button>
      </div>
    </Modal>
  );
}
