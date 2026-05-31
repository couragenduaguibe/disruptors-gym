import React, { useState, useMemo } from "react";
import {
  Users, CalendarDays, UserCheck, Plus, Minus, Search, Edit2, Trash2, Clock,
  DollarSign, Activity, Flame, CheckCircle2, AlertCircle, User, Mail, Phone,
  ChevronRight, AlertTriangle, Receipt, Calendar, Award, X, QrCode, Package, Layers,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import { StatCard, Field, Modal, EmptyState } from "../components/ui";
import { planBadge, today } from "../utils/storage";
import { PLAN_PRICES, seedShopProducts } from "../data/seed";
import { CheckInPoster } from "../components/CheckInPoster";

// ---------- Dashboard ----------
export function Dashboard({ stats, members, classes, payments, onMemberClick, onNavigate, user }) {
  const isAdmin = user.role === "admin";
  const topClasses = [...classes].sort((a, b) => b.booked / b.capacity - a.booked / a.capacity).slice(0, 4);
  const recentMembers = [...members].sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate)).slice(0, 5);

  return (
    <div className="space-y-5 lg:space-y-6">
      {(stats.overdueCount > 0 || stats.expiringSoon > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 fade-up">
          {stats.overdueCount > 0 && (
            <button onClick={() => onNavigate("payments")} className="flex items-center gap-3 p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-left hover:border-rose-600 transition">
              <div className="w-10 h-10 rounded-lg bg-rose-900/50 flex items-center justify-center shrink-0"><AlertTriangle className="w-5 h-5 text-rose-400" /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-rose-300">{stats.overdueCount} overdue payment{stats.overdueCount > 1 ? "s" : ""}</div>
                <div className="text-xs text-rose-500">Tap to review</div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-500" />
            </button>
          )}
          {stats.expiringSoon > 0 && (
            <button onClick={() => onNavigate("members")} className="flex items-center gap-3 p-4 bg-amber-950/30 border border-amber-800 rounded-xl text-left hover:border-amber-600 transition">
              <div className="w-10 h-10 rounded-lg bg-amber-900/40 flex items-center justify-center shrink-0"><Calendar className="w-5 h-5 text-amber-400" /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-amber-300">{stats.expiringSoon} expiring soon</div>
                <div className="text-xs text-amber-500">Within 14 days</div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-500" />
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard className="fade-up stagger-1" label="Active members" value={stats.active} icon={Users} accent="bg-red-500/20 text-red-400" trend="+12%" trendUp />
        {isAdmin && <StatCard className="fade-up stagger-2" label="Revenue" value={`₦${(stats.revenue / 1000).toFixed(0)}K`} icon={DollarSign} accent="bg-amber-500/20 text-amber-400" trend="+8%" trendUp />}
        <StatCard className="fade-up stagger-3" label="Today's check-ins" value={stats.todayCheckIns} icon={Activity} accent="bg-sky-500/20 text-sky-400" />
        <StatCard className="fade-up stagger-4" label="Class utilization" value={`${Math.round(stats.classUtil * 100)}%`} icon={Flame} accent="bg-rose-500/20 text-rose-400" trend="-3%" />
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-stone-900 text-white p-5 sm:p-7 fade-up border border-stone-800">
        <div className="absolute inset-0 noise-bg opacity-20 pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-red-600/15 blur-3xl" />
        <div className="relative z-10 max-w-xl">
          <div className="text-xs font-mono tracking-widest text-red-500 uppercase mb-2">This week</div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold leading-tight mb-2">Momentum is building.</h2>
          <p className="text-stone-400 text-sm sm:text-base">
            {stats.active} active members training hard. {Math.round(stats.classUtil * 100)}% of class slots filling up.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-stone-900 rounded-xl border border-stone-700 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-white">Most booked classes</h3>
            <span className="text-[10px] font-mono text-stone-500 tracking-wider">THIS WEEK</span>
          </div>
          <div className="space-y-3">
            {topClasses.map((c) => {
              const pct = Math.round((c.booked / c.capacity) * 100);
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-stone-800 flex flex-col items-center justify-center shrink-0">
                    <div className="text-[9px] font-mono text-stone-500">{c.day.toUpperCase()}</div>
                    <div className="text-xs font-semibold text-white">{c.time}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <div className="font-medium text-sm text-stone-200 truncate">{c.name}</div>
                      <div className="text-xs text-stone-500 shrink-0">{c.booked}/{c.capacity}</div>
                    </div>
                    <div className="h-1.5 bg-stone-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${pct >= 90 ? "bg-rose-500" : pct >= 60 ? "bg-red-500" : "bg-sky-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 bg-stone-900 rounded-xl border border-stone-700 p-4 sm:p-5">
          <h3 className="font-display text-lg font-semibold text-white mb-4">Newest members</h3>
          <div className="space-y-2">
            {recentMembers.map((m) => (
              <button key={m.id} onClick={() => onMemberClick(m)} className="w-full flex items-center gap-3 hover:bg-stone-800 -mx-2 px-2 py-1.5 rounded-lg transition text-left">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-700 to-stone-600 flex items-center justify-center font-semibold text-stone-200 text-sm shrink-0">{m.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-stone-200 truncate">{m.name}</div>
                  <div className="text-xs text-stone-500">Joined {new Date(m.joinDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </div>
                <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full ${planBadge(m.plan)} shrink-0`}>{m.plan.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Members ----------
export function MembersView({ members, setMembers, onMemberClick, user }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const canDelete = user.role === "admin";

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || m.status === filter;
    return matchSearch && matchFilter;
  });

  const handleSave = (data) => {
    if (editing) setMembers(members.map((m) => (m.id === editing.id ? { ...m, ...data } : m)));
    else {
      const exp = new Date(); exp.setMonth(exp.getMonth() + 1);
      const id = `m${Date.now()}`;
      setMembers([...members, {
        id, ...data, joinDate: today(), expiryDate: exp.toISOString().slice(0, 10),
        status: "active", checkIns: 0, lastVisit: null, trainerId: null,
      }]);
    }
    setShowModal(false); setEditing(null);
  };

  const handleDelete = (id) => { if (confirm("Remove this member?")) setMembers(members.filter((m) => m.id !== id)); };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-1 min-w-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email"
              className="w-full pl-10 pr-4 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-base sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
          </div>
          <div className="flex gap-1 bg-stone-800 p-1 rounded-lg">
            {["all", "active", "expired"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md capitalize transition ${filter === f ? "bg-stone-950 text-white shadow-sm" : "text-stone-400 hover:text-white"}`}>{f}</button>
            ))}
          </div>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition shrink-0">
          <Plus className="w-4 h-4" /> Add member
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-stone-900 rounded-xl border border-stone-700 overflow-hidden">
        <div className="scroll-x">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-left text-[10px] font-mono tracking-wider text-stone-500 uppercase border-b border-stone-700">
                <th className="px-6 py-3 font-medium">Member</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Visits</th>
                <th className="px-6 py-3 font-medium">Last visit</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} onClick={() => onMemberClick(m)} className="border-b border-stone-800 last:border-0 hover:bg-stone-800 transition cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-stone-700 to-stone-600 flex items-center justify-center text-sm font-semibold text-stone-200">{m.name[0]}</div>
                      <div>
                        <div className="font-medium text-sm text-stone-200">{m.name}</div>
                        <div className="text-xs text-stone-500">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className={`text-[10px] font-mono tracking-wider px-2 py-1 rounded-full ${planBadge(m.plan)}`}>{m.plan.toUpperCase()}</span></td>
                  <td className="px-6 py-4 text-sm font-mono text-stone-300">{m.checkIns}</td>
                  <td className="px-6 py-4 text-sm text-stone-400">{m.lastVisit ? new Date(m.lastVisit).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${m.status === "active" ? "text-red-400" : "text-rose-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${m.status === "active" ? "bg-red-500" : "bg-rose-500"}`} />
                      {m.status === "active" ? "Active" : "Expired"}
                    </span>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => { setEditing(m); setShowModal(true); }} className="p-2 hover:bg-stone-700 rounded-md transition" title="Edit">
                        <Edit2 className="w-4 h-4 text-stone-400" />
                      </button>
                      {canDelete && (
                        <button onClick={() => handleDelete(m.id)} className="p-2 hover:bg-rose-900/40 rounded-md transition" title="Delete">
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-stone-500">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-40" />No members match your search.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((m) => (
          <div key={m.id} onClick={() => onMemberClick(m)} className="bg-stone-900 rounded-xl border border-stone-700 p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-700 to-stone-600 flex items-center justify-center font-semibold text-stone-200 shrink-0">{m.name[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-sm text-stone-200">{m.name}</div>
                  <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full ${planBadge(m.plan)} shrink-0`}>{m.plan.toUpperCase()}</span>
                </div>
                <div className="text-xs text-stone-500 truncate">{m.email}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="text-stone-400"><span className="font-mono font-semibold text-stone-200">{m.checkIns}</span> visits</span>
                <span className={`inline-flex items-center gap-1 ${m.status === "active" ? "text-red-400" : "text-rose-400"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${m.status === "active" ? "bg-red-500" : "bg-rose-500"}`} />{m.status}
                </span>
              </div>
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => { setEditing(m); setShowModal(true); }} className="p-2 hover:bg-stone-700 rounded-md transition">
                  <Edit2 className="w-4 h-4 text-stone-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-stone-900 rounded-xl border border-stone-700 p-10 text-center text-stone-500 text-sm">No members found.</div>
        )}
      </div>

      {showModal && <MemberModal member={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} />}
    </div>
  );
}

function MemberModal({ member, onSave, onClose }) {
  const [form, setForm] = useState(member || { name: "", email: "", phone: "", plan: "Standard" });
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.name || !form.email) return alert("Name and email are required");
    onSave(form);
  };
  return (
    <Modal title={member ? "Edit member" : "New member"} subtitle={member ? "Update details" : "Add someone new"} onClose={onClose}
      footer={<>
        <button onClick={onClose} className="flex-1 py-2.5 border border-stone-700 rounded-lg text-sm font-medium text-stone-300 hover:bg-stone-800 transition">Cancel</button>
        <button onClick={submit} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">{member ? "Save changes" : "Add member"}</button>
      </>}>
      <div className="space-y-4">
        <Field icon={User} label="Full name" value={form.name} onChange={(v) => update("name", v)} />
        <Field icon={Mail} label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} />
        <Field icon={Phone} label="Phone" value={form.phone} onChange={(v) => update("phone", v)} />
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Plan</label>
          <div className="grid grid-cols-3 gap-2">
            {["Basic", "Standard", "Premium"].map((p) => (
              <button key={p} onClick={() => update("plan", p)}
                className={`py-2.5 rounded-lg text-sm font-medium border transition ${form.plan === p ? "bg-red-600 text-white border-red-600" : "bg-stone-800 border-stone-700 text-stone-300 hover:border-stone-500"}`}>{p}</button>
            ))}
          </div>
          <div className="text-xs text-stone-500 mt-2 font-mono">₦{PLAN_PRICES[form.plan].toLocaleString()}/mo</div>
        </div>
      </div>
    </Modal>
  );
}

// ---------- Member Detail Drawer ----------
export function MemberDetail({ member, payments, checkIns, onClose }) {
  const totalPaid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const daysToExpiry = Math.ceil((new Date(member.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end" onClick={onClose}>
      <div className="bg-stone-950 w-full max-w-lg h-full overflow-y-auto slide-in border-l border-stone-800" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-28 bg-gradient-to-br from-red-900 via-stone-800 to-rose-900">
          <div className="absolute inset-0 noise-bg opacity-30" />
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-stone-900/80 hover:bg-stone-900 rounded-lg backdrop-blur transition"><X className="w-5 h-5 text-stone-300" /></button>
        </div>
        <div className="px-6 -mt-10 relative pb-8">
          <div className="w-18 h-18 w-[4.5rem] h-[4.5rem] rounded-2xl bg-stone-900 text-white flex items-center justify-center font-display text-3xl font-semibold border-4 border-stone-950 mb-4">{member.name[0]}</div>
          <h2 className="font-display text-2xl font-semibold text-white">{member.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-mono tracking-wider px-2 py-1 rounded-full ${planBadge(member.plan)}`}>{member.plan.toUpperCase()}</span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${member.status === "active" ? "text-red-400" : "text-rose-400"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${member.status === "active" ? "bg-red-500" : "bg-rose-500"}`} />
              {member.status === "active" ? "Active" : "Expired"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="text-sm flex items-center gap-2 text-stone-400 min-w-0"><Mail className="w-4 h-4 shrink-0 text-stone-600" /><span className="truncate">{member.email}</span></div>
            <div className="text-sm flex items-center gap-2 text-stone-400"><Phone className="w-4 h-4 shrink-0 text-stone-600" /><span className="truncate">{member.phone}</span></div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: "Visits", val: member.checkIns },
              { label: "Paid", val: `₦${(totalPaid / 1000).toFixed(0)}K` },
              { label: "Expires", val: daysToExpiry >= 0 ? `${daysToExpiry}d` : "—", warn: daysToExpiry < 14 && daysToExpiry >= 0, expired: daysToExpiry < 0 },
            ].map((s) => (
              <div key={s.label} className="bg-stone-900 border border-stone-800 rounded-xl p-3">
                <div className="text-[10px] font-mono text-stone-500 tracking-wider uppercase">{s.label}</div>
                <div className={`font-display text-2xl font-semibold ${s.warn ? "text-amber-400" : s.expired ? "text-rose-400" : "text-white"}`}>{s.val}</div>
              </div>
            ))}
          </div>

          <div className="mt-7">
            <h3 className="font-display text-lg font-semibold text-white mb-3">Payment history</h3>
            {payments.length === 0 ? <EmptyState title="No payments yet" /> : (
              <div className="space-y-2">
                {payments.slice(0, 6).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-stone-900 border border-stone-800 rounded-xl">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${p.status === "paid" ? "bg-red-900/40" : p.status === "overdue" ? "bg-rose-900/40" : "bg-amber-900/40"}`}>
                      <Receipt className={`w-4 h-4 ${p.status === "paid" ? "text-red-400" : p.status === "overdue" ? "text-rose-400" : "text-amber-400"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-stone-200">₦{p.amount.toLocaleString()}</div>
                      <div className="text-xs text-stone-500">{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {p.method}</div>
                    </div>
                    <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded-full ${p.status === "paid" ? "bg-red-900/50 text-red-300" : p.status === "overdue" ? "bg-rose-900/40 text-rose-300" : "bg-amber-900/40 text-amber-300"}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-7">
            <h3 className="font-display text-lg font-semibold text-white mb-3">Recent visits</h3>
            {checkIns.length === 0 ? <EmptyState title="No visits logged yet" /> : (
              <div className="space-y-1">
                {checkIns.slice(0, 8).map((ci) => (
                  <div key={ci.id} className="flex items-center gap-3 py-2">
                    <div className="w-7 h-7 rounded-full bg-red-900/40 flex items-center justify-center shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-red-400" /></div>
                    <div className="flex-1 text-sm text-stone-300">{new Date(ci.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
                    <div className="text-sm font-mono text-stone-500">{ci.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Classes ----------
export function ClassesView({ classes, setClasses, trainers, user }) {
  const [showModal, setShowModal] = useState(false);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const canEdit = user.role === "admin";

  const handleAdd = (data) => {
    const trainer = trainers.find((t) => t.name === data.trainer);
    setClasses([...classes, { id: `c${Date.now()}`, ...data, trainerId: trainer?.id || null, booked: 0, bookedMemberIds: [] }]);
    setShowModal(false);
  };
  const handleDelete = (id) => { if (confirm("Delete this class?")) setClasses(classes.filter((c) => c.id !== id)); };

  const renderCard = (c) => {
    const pct = Math.round((c.booked / c.capacity) * 100);
    return (
      <div key={c.id} className="group relative p-3 bg-stone-800 border border-stone-700 rounded-lg hover:border-stone-500 transition">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-mono font-semibold text-stone-300">{c.time}</span>
          {canEdit && (
            <button onClick={() => handleDelete(c.id)} className="opacity-0 group-hover:opacity-100 transition">
              <Trash2 className="w-3 h-3 text-stone-500 hover:text-rose-400" />
            </button>
          )}
        </div>
        <div className="font-medium text-sm text-white leading-tight mb-0.5">{c.name}</div>
        <div className="text-xs text-stone-500 mb-2 truncate">{c.trainer}</div>
        <div className="flex items-center gap-1.5">
          <div className="flex-1 h-1 bg-stone-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${pct >= 90 ? "bg-rose-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[10px] font-mono text-stone-500">{c.booked}/{c.capacity}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {canEdit && (
        <div className="flex justify-end">
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">
            <Plus className="w-4 h-4" /> Add class
          </button>
        </div>
      )}

      {/* Desktop 7-col grid */}
      <div className="hidden lg:grid grid-cols-7 gap-3">
        {days.map((day) => {
          const dayClasses = classes.filter((c) => c.day === day).sort((a, b) => a.time.localeCompare(b.time));
          return (
            <div key={day} className="bg-stone-900 rounded-xl border border-stone-700 p-3 min-h-[180px]">
              <div className="text-[10px] font-mono tracking-widest text-stone-500 uppercase mb-3 px-1">{day}</div>
              <div className="space-y-2">
                {dayClasses.map(renderCard)}
                {dayClasses.length === 0 && <div className="text-xs text-stone-600 text-center py-6">No classes</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile list */}
      <div className="lg:hidden space-y-4">
        {days.map((day) => {
          const dayClasses = classes.filter((c) => c.day === day).sort((a, b) => a.time.localeCompare(b.time));
          if (dayClasses.length === 0) return null;
          return (
            <div key={day}>
              <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-2 px-1">
                {day} · <span className="text-stone-600">{dayClasses.length} class{dayClasses.length !== 1 ? "es" : ""}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{dayClasses.map(renderCard)}</div>
            </div>
          );
        })}
      </div>

      {showModal && <ClassModal trainers={trainers} onSave={handleAdd} onClose={() => setShowModal(false)} />}
    </div>
  );
}

function ClassModal({ trainers, onSave, onClose }) {
  const [form, setForm] = useState({ name: "", trainer: trainers[0]?.name || "", day: "Mon", time: "08:00", capacity: 15 });
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = () => { if (!form.name) return alert("Class name required"); onSave({ ...form, capacity: Number(form.capacity) }); };
  const inputCls = "w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-base sm:text-sm text-white focus:outline-none focus:border-red-500";

  return (
    <Modal title="New class" onClose={onClose} footer={<>
      <button onClick={onClose} className="flex-1 py-2.5 border border-stone-700 rounded-lg text-sm font-medium text-stone-300 hover:bg-stone-800 transition">Cancel</button>
      <button onClick={submit} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">Add class</button>
    </>}>
      <div className="space-y-4">
        <Field label="Class name" value={form.name} onChange={(v) => update("name", v)} />
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Trainer</label>
          <select value={form.trainer} onChange={(e) => update("trainer", e.target.value)} className={inputCls}>
            {trainers.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Day</label>
            <select value={form.day} onChange={(e) => update("day", e.target.value)} className={inputCls}>
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Time</label>
            <input type="time" value={form.time} onChange={(e) => update("time", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Cap.</label>
            <input type="number" min="1" value={form.capacity} onChange={(e) => update("capacity", e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ---------- Trainers ----------
export function TrainersView({ trainers }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {trainers.map((t, i) => (
        <div key={t.id} className={`bg-stone-900 rounded-xl border border-stone-700 overflow-hidden fade-up stagger-${(i % 4) + 1}`}>
          <div className="h-20 bg-gradient-to-br from-red-900 via-stone-800 to-rose-900 relative">
            <div className="absolute inset-0 noise-bg opacity-30" />
          </div>
          <div className="p-5 -mt-9 relative">
            <div className="w-14 h-14 rounded-xl bg-stone-800 text-white flex items-center justify-center font-display text-xl font-semibold border-4 border-stone-900 mb-3">
              {t.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <h3 className="font-display text-lg font-semibold text-white">{t.name}</h3>
            <p className="text-sm text-stone-400 mb-4">{t.specialty}</p>
            <div className="flex items-center justify-between pt-4 border-t border-stone-700">
              <div>
                <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Clients</div>
                <div className="font-semibold text-lg text-white">{t.clients}</div>
              </div>
              <div>
                <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Rating</div>
                <div className="font-semibold text-lg text-white flex items-center gap-1">{t.rating}<span className="text-amber-400">★</span></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Check-ins ----------
export function CheckInsView({ checkIns }) {
  const [showPoster, setShowPoster] = useState(false);
  const grouped = checkIns.reduce((acc, ci) => { (acc[ci.date] = acc[ci.date] || []).push(ci); return acc; }, {});
  const todayCount = (grouped[today()] || []).length;

  return (
    <div className="space-y-5">
      <div className="bg-stone-900 border border-stone-700 text-white rounded-2xl p-5 sm:p-7 relative overflow-hidden">
        <div className="absolute inset-0 noise-bg opacity-20 pointer-events-none" />
        <div className="absolute -right-12 -top-12 w-60 h-60 rounded-full bg-red-600/15 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shrink-0">
            <QrCode className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-mono tracking-widest text-red-400 uppercase mb-1">FRONT DESK QR</div>
            <h3 className="font-display text-xl sm:text-2xl font-semibold leading-tight text-white">Check-in poster</h3>
            <p className="text-sm text-stone-400 mt-1 max-w-md">
              Members scan this to check themselves in. Print it or show it on a tablet at the entrance.
            </p>
          </div>
          <button onClick={() => setShowPoster(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 shrink-0">
            <QrCode className="w-4 h-4" /> Show / print
          </button>
        </div>
      </div>

      <div className="bg-stone-900 rounded-xl border border-stone-700 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-stone-500" />
            <h3 className="font-display text-lg font-semibold text-white">Recent activity</h3>
          </div>
          <span className="text-xs font-mono tracking-wider text-stone-500">{todayCount} TODAY</span>
        </div>

        {Object.keys(grouped).length === 0 ? (
          <EmptyState icon={UserCheck} title="No check-ins yet" subtitle="Members will appear here as they scan in." />
        ) : (
          <div className="space-y-5">
            {Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([date, entries]) => (
              <div key={date}>
                <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-2">
                  {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  <span className="ml-2 text-stone-600">· {entries.length} visit{entries.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="space-y-1">
                  {entries.map((ci) => (
                    <div key={ci.id} className="flex items-center gap-3 py-2 px-3 hover:bg-stone-800 rounded-lg transition">
                      <div className="w-8 h-8 rounded-full bg-red-900/40 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="flex-1"><div className="text-sm font-medium text-stone-200">{ci.memberName}</div></div>
                      <span className="text-[10px] font-mono tracking-wider text-stone-600 uppercase">QR</span>
                      <div className="text-sm font-mono text-stone-500">{ci.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPoster && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:bg-white print:p-0 print:static" onClick={() => setShowPoster(false)}>
          <div onClick={(e) => e.stopPropagation()} className="my-auto w-full print:my-0">
            <CheckInPoster locationId="main" locationName="Main Entrance" />
            <div className="text-center mt-4 print:hidden">
              <button onClick={() => setShowPoster(false)} className="text-white text-xs underline">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Payments ----------
export function PaymentsView({ payments, setPayments, user }) {
  const [filter, setFilter] = useState("all");
  const canMarkPaid = user.role === "admin" || user.role === "receptionist";
  const filtered = payments.filter((p) => filter === "all" || p.status === filter).sort((a, b) => new Date(b.date) - new Date(a.date));

  const totals = useMemo(() => {
    const paid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
    const pending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
    const overdue = payments.filter((p) => p.status === "overdue").reduce((s, p) => s + p.amount, 0);
    return { paid, pending, overdue };
  }, [payments]);

  const markPaid = (id) => setPayments(payments.map((p) => p.id === id ? { ...p, status: "paid", method: p.method === "—" ? "Cash" : p.method } : p));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Collected", val: totals.paid, dot: "bg-red-500", count: payments.filter((p) => p.status === "paid").length, sub: "payments" },
          { label: "Pending", val: totals.pending, dot: "bg-amber-500", count: payments.filter((p) => p.status === "pending").length, sub: "pending" },
          { label: "Overdue", val: totals.overdue, dot: "bg-rose-500", count: payments.filter((p) => p.status === "overdue").length, sub: "overdue" },
        ].map((c, i) => (
          <div key={c.label} className={`bg-stone-900 rounded-xl border border-stone-700 p-4 sm:p-5 fade-up stagger-${i + 1}`}>
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-stone-500 uppercase mb-2">
              <span className={`w-2 h-2 rounded-full ${c.dot}`} /> {c.label}
            </div>
            <div className={`font-display text-3xl font-semibold ${c.label === "Overdue" ? "text-rose-400" : "text-white"}`}>₦{(c.val / 1000).toFixed(0)}K</div>
            <div className="text-xs text-stone-500 mt-1">{c.count} {c.sub}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-stone-800 p-1 rounded-lg w-fit">
        {["all", "paid", "pending", "overdue"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition ${filter === f ? "bg-stone-950 text-white shadow-sm" : "text-stone-400 hover:text-white"}`}>{f}</button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-stone-900 rounded-xl border border-stone-700 overflow-hidden">
        <div className="scroll-x">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-left text-[10px] font-mono tracking-wider text-stone-500 uppercase border-b border-stone-700">
                <th className="px-6 py-3 font-medium">Member</th><th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Date</th><th className="px-6 py-3 font-medium">Method</th>
                <th className="px-6 py-3 font-medium">Status</th><th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-stone-800 last:border-0 hover:bg-stone-800 transition">
                  <td className="px-6 py-4 text-sm font-medium text-stone-200">{p.memberName}</td>
                  <td className="px-6 py-4 text-sm font-mono text-stone-200">₦{p.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-stone-400">{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-6 py-4 text-sm text-stone-400">{p.method}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded-full ${p.status === "paid" ? "bg-red-900/50 text-red-300" : p.status === "overdue" ? "bg-rose-900/40 text-rose-300" : "bg-amber-900/40 text-amber-300"}`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {p.status !== "paid" && canMarkPaid && <button onClick={() => markPaid(p.id)} className="text-xs font-medium text-red-400 hover:text-red-300 transition">Mark paid</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {filtered.map((p) => (
          <div key={p.id} className="bg-stone-900 rounded-xl border border-stone-700 p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-sm font-medium text-stone-200">{p.memberName}</div>
                <div className="text-xs text-stone-500">{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {p.method}</div>
              </div>
              <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded-full shrink-0 ${p.status === "paid" ? "bg-red-900/50 text-red-300" : p.status === "overdue" ? "bg-rose-900/40 text-rose-300" : "bg-amber-900/40 text-amber-300"}`}>{p.status}</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="font-display text-xl font-semibold text-white">₦{p.amount.toLocaleString()}</div>
              {p.status !== "paid" && canMarkPaid && <button onClick={() => markPaid(p.id)} className="text-xs font-medium text-red-400 hover:text-red-300 transition">Mark paid</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Member Stocks (staff view) ----------
export function MemberStocksView({ members, memberStocks, setMemberStocks }) {
  const [search, setSearch] = useState("");
  const [addModal, setAddModal] = useState(null);

  const stockedMembers = memberStocks.filter((s) => s.items?.length > 0);
  const filtered = memberStocks
    .filter((s) => s.memberName.toLowerCase().includes(search.toLowerCase()))
    .filter((s) => s.items?.length > 0);

  const totalItems = memberStocks.reduce((sum, s) => sum + (s.items?.reduce((a, i) => a + i.qty, 0) || 0), 0);
  const lowStockCount = memberStocks.reduce((sum, s) =>
    sum + (s.items?.filter((i) => i.qty > 0 && i.qty <= 2).length || 0), 0
  );

  const adjustQty = (memberId, productId, delta) => {
    setMemberStocks((stocks) =>
      stocks.map((s) => {
        if (s.memberId !== memberId) return s;
        return { ...s, items: s.items.map((i) => i.productId === productId ? { ...i, qty: Math.max(0, i.qty + delta), lastUpdated: today() } : i) };
      })
    );
  };

  const addStock = (memberId, memberName, productId, productName, qty) => {
    setMemberStocks((stocks) => {
      const existing = stocks.find((s) => s.memberId === memberId);
      if (existing) {
        return stocks.map((s) => {
          if (s.memberId !== memberId) return s;
          const idx = s.items.findIndex((i) => i.productId === productId);
          if (idx >= 0) {
            const updated = [...s.items];
            updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty, lastUpdated: today() };
            return { ...s, items: updated };
          }
          return { ...s, items: [...s.items, { productId, name: productName, qty, lastUpdated: today() }] };
        });
      }
      return [...stocks, { memberId, memberName, items: [{ productId, name: productName, qty, lastUpdated: today() }] }];
    });
  };

  const allMembersWithStock = members.map((m) => {
    const stock = memberStocks.find((s) => s.memberId === m.id);
    return { ...m, hasStock: !!stock };
  });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-stone-900 rounded-xl border border-stone-700 p-4">
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Members with stock</div>
          <div className="font-display text-3xl font-semibold text-white mt-1">{stockedMembers.length}</div>
        </div>
        <div className="bg-stone-900 rounded-xl border border-stone-700 p-4">
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Total units</div>
          <div className="font-display text-3xl font-semibold text-white mt-1">{totalItems}</div>
        </div>
        <div className={`rounded-xl border p-4 ${lowStockCount > 0 ? "border-amber-800 bg-amber-950/30" : "bg-stone-900 border-stone-700"}`}>
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Running low</div>
          <div className={`font-display text-3xl font-semibold mt-1 ${lowStockCount > 0 ? "text-amber-400" : "text-white"}`}>{lowStockCount}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search member name"
            className="w-full pl-10 pr-4 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-base sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
        </div>
        <button onClick={() => setAddModal("picker")}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition shrink-0">
          <Plus className="w-4 h-4" /> Add stock
        </button>
      </div>

      <div className="bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs text-stone-400">
        Use <strong className="text-stone-200">+</strong> / <strong className="text-stone-200">−</strong> on any item to adjust a member's stock. Changes save instantly.
      </div>

      {filtered.length === 0 ? (
        <div className="bg-stone-900 rounded-xl border border-stone-700 p-10 text-center">
          <Layers className="w-10 h-10 mx-auto mb-3 text-stone-700" />
          <p className="font-medium text-stone-400">{search ? "No matching members" : "No member stock yet"}</p>
          <p className="text-sm text-stone-500 mt-1">Stock is added when members order daily essentials, or manually via Add Stock.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((stock) => {
            const member = members.find((m) => m.id === stock.memberId);
            const activeItems = stock.items.filter((i) => i.qty >= 0);
            return (
              <div key={stock.memberId} className="bg-stone-900 rounded-xl border border-stone-700 p-4 sm:p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-stone-700 to-stone-600 flex items-center justify-center font-semibold text-stone-200 shrink-0">
                    {stock.memberName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-stone-200">{stock.memberName}</div>
                    {member && <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full ${planBadge(member.plan)}`}>{member.plan.toUpperCase()}</span>}
                  </div>
                  <button onClick={() => setAddModal({ memberId: stock.memberId, memberName: stock.memberName })}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-700 rounded-lg text-xs font-medium text-stone-300 hover:border-red-500 hover:text-red-400 transition shrink-0">
                    <Plus className="w-3 h-3" /> Add item
                  </button>
                </div>

                {activeItems.length === 0 ? (
                  <p className="text-xs text-stone-600 text-center py-3">No items yet</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {activeItems.map((item) => {
                      const low = item.qty > 0 && item.qty <= 2;
                      return (
                        <div key={item.productId} className={`rounded-xl border p-3 ${low ? "border-amber-800 bg-amber-950/20" : item.qty === 0 ? "border-stone-800 bg-stone-800/50 opacity-60" : "border-stone-700 bg-stone-800"}`}>
                          <div className="text-xs font-medium text-stone-200 leading-tight mb-1 truncate">{item.name}</div>
                          {low && <div className="text-[10px] font-mono text-amber-400 mb-1">⚠ Low</div>}
                          {item.qty === 0 && <div className="text-[10px] font-mono text-rose-500 mb-1">Empty</div>}
                          <div className="flex items-center justify-between gap-1 mt-2">
                            <button onClick={() => adjustQty(stock.memberId, item.productId, -1)}
                              disabled={item.qty <= 0}
                              className="w-7 h-7 rounded-lg bg-stone-700 border border-stone-600 flex items-center justify-center hover:border-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition">
                              <Minus className="w-3 h-3 text-stone-300" />
                            </button>
                            <span className={`font-display text-xl font-semibold w-8 text-center ${low ? "text-amber-400" : "text-white"}`}>{item.qty}</span>
                            <button onClick={() => adjustQty(stock.memberId, item.productId, 1)}
                              className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {addModal === "picker" && (
        <Modal title="Add Stock" subtitle="Select a member to add stock to" onClose={() => setAddModal(null)}>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {allMembersWithStock.map((m) => (
              <button key={m.id} onClick={() => setAddModal({ memberId: m.id, memberName: m.name })}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-stone-700 hover:border-red-500 hover:bg-stone-800 transition text-left">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-700 to-stone-600 flex items-center justify-center font-semibold text-stone-200 text-sm shrink-0">{m.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-stone-200">{m.name}</div>
                  <div className="text-xs text-stone-500">{m.plan}</div>
                </div>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {addModal && addModal.memberId && (
        <AddStockModal
          memberName={addModal.memberName}
          onAdd={(productId, productName, qty) => { addStock(addModal.memberId, addModal.memberName, productId, productName, qty); setAddModal(null); }}
          onClose={() => setAddModal(null)}
        />
      )}
    </div>
  );
}

function AddStockModal({ memberName, onAdd, onClose }) {
  const essentials = seedShopProducts.filter((p) => p.category === "Daily Essentials");
  const [selectedId, setSelectedId] = useState(essentials[0]?.id || "");
  const [qty, setQty] = useState(1);
  const selected = essentials.find((p) => p.id === selectedId);

  return (
    <Modal title={`Add stock for ${memberName}`} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-2 block">Item</label>
          <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto">
            {essentials.map((p) => (
              <button key={p.id} onClick={() => setSelectedId(p.id)}
                className={`text-left p-3 rounded-xl border transition ${selectedId === p.id ? "border-red-500 bg-red-900/20" : "border-stone-700 bg-stone-800 hover:border-stone-500"}`}>
                <div className="text-sm font-medium text-stone-200">{p.name}</div>
                <div className="text-xs text-stone-500 mt-0.5">{p.description}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-2 block">Quantity to add</label>
          <div className="flex items-center gap-3">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center hover:border-red-500 text-stone-300 transition">
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-display text-3xl font-semibold text-white w-12 text-center">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)}
              className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button onClick={() => { if (!selected) return; onAdd(selected.id, selected.name, qty); }}
          className="w-full py-3 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition">
          Add {qty} × {selected?.name || "item"} to {memberName.split(" ")[0]}'s stock
        </button>
      </div>
    </Modal>
  );
}

// ---------- Analytics ----------
export function AnalyticsView({ members, payments, classes }) {
  const revenueByMonth = useMemo(() => {
    const months = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months[key] = { month: d.toLocaleDateString("en-US", { month: "short" }), revenue: 0 };
    }
    payments.filter((p) => p.status === "paid").forEach((p) => { const key = p.date.slice(0, 7); if (months[key]) months[key].revenue += p.amount; });
    return Object.values(months);
  }, [payments]);

  const planDist = useMemo(() => {
    const counts = { Basic: 0, Standard: 0, Premium: 0 };
    members.filter((m) => m.status === "active").forEach((m) => { counts[m.plan]++; });
    return [
      { name: "Premium", value: counts.Premium, color: "#f59e0b" },
      { name: "Standard", value: counts.Standard, color: "#0ea5e9" },
      { name: "Basic", value: counts.Basic, color: "#78716c" },
    ];
  }, [members]);

  const classUtil = useMemo(() => classes.map((c) => ({ name: c.name, util: Math.round((c.booked / c.capacity) * 100) })).sort((a, b) => b.util - a.util).slice(0, 6), [classes]);

  const peakHours = useMemo(() => {
    const hours = {};
    for (let h = 6; h <= 21; h++) hours[h] = 0;
    classes.forEach((c) => { const h = parseInt(c.time.split(":")[0]); if (hours[h] !== undefined) hours[h] += c.booked; });
    return Object.entries(hours).map(([h, v]) => ({ hour: `${h}:00`, visits: v }));
  }, [classes]);

  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const avgRevPerMember = members.filter((m) => m.status === "active").length > 0 ? Math.round(totalRevenue / members.filter((m) => m.status === "active").length) : 0;

  const cardCls = "bg-stone-900 rounded-xl border border-stone-700 p-4 sm:p-5";
  const gridStroke = "#3f3f46";
  const axisColor = "#71717a";
  const tooltipStyle = { background: "#0c0a09", border: "1px solid #3f3f46", borderRadius: 8, color: "white", fontSize: 12 };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total revenue", val: `₦${(totalRevenue/1000).toFixed(0)}K` },
          { label: "Avg / member", val: `₦${(avgRevPerMember/1000).toFixed(1)}K` },
          { label: "Total members", val: members.length },
          { label: "Classes / wk", val: classes.length },
        ].map((s, i) => (
          <div key={s.label} className={`${cardCls} fade-up stagger-${i + 1}`}>
            <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">{s.label}</div>
            <div className="font-display text-2xl font-semibold text-white mt-1">{s.val}</div>
          </div>
        ))}
      </div>

      <div className={cardCls}>
        <h3 className="font-display text-lg font-semibold text-white">Revenue trend</h3>
        <p className="text-xs text-stone-500 mt-1 mb-5">Last 6 months</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueByMonth}>
              <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="month" stroke={axisColor} style={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis stroke={axisColor} style={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`₦${v.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={cardCls}>
          <h3 className="font-display text-lg font-semibold text-white mb-1">Plan mix</h3>
          <p className="text-xs text-stone-500 mb-5">Active members by plan</p>
          <div className="flex items-center gap-5">
            <div className="w-36 h-36 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={planDist} dataKey="value" innerRadius={40} outerRadius={68} paddingAngle={3}>
                    {planDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {planDist.map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: p.color }} />
                  <span className="text-sm text-stone-300 flex-1">{p.name}</span>
                  <span className="text-sm font-mono font-semibold text-white">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={cardCls}>
          <h3 className="font-display text-lg font-semibold text-white mb-1">Top classes</h3>
          <p className="text-xs text-stone-500 mb-5">Booking utilization</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classUtil} layout="vertical" margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                <XAxis type="number" stroke={axisColor} style={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" stroke={axisColor} style={{ fontSize: 11 }} width={95} axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Utilization"]} />
                <Bar dataKey="util" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={cardCls}>
        <h3 className="font-display text-lg font-semibold text-white mb-1">Peak hours</h3>
        <p className="text-xs text-stone-500 mb-5">Class attendance by time</p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peakHours}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="hour" stroke={axisColor} style={{ fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} interval={1} tick={{ fill: "#71717a" }} />
              <YAxis stroke={axisColor} style={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tick={{ fill: "#71717a" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="visits" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
