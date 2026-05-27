import React, { useState, useMemo } from "react";
import {
  Users, CalendarDays, UserCheck, Plus, Search, Edit2, Trash2, Clock,
  DollarSign, Activity, Flame, CheckCircle2, AlertCircle, User, Mail, Phone,
  ChevronRight, AlertTriangle, Receipt, Calendar, Award, X, QrCode,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import { StatCard, Field, Modal, EmptyState } from "../components/ui";
import { planBadge, today } from "../utils/storage";
import { PLAN_PRICES } from "../data/seed";
import { CheckInPoster } from "../components/CheckInPoster";

// ---------- Dashboard ----------
export function Dashboard({ stats, members, classes, payments, onMemberClick, onNavigate, user }) {
  const isAdmin = user.role === "admin";
  const topClasses = [...classes].sort((a, b) => b.booked / b.capacity - a.booked / a.capacity).slice(0, 4);
  const recentMembers = [...members].sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate)).slice(0, 5);

  return (
    <div className="space-y-6 lg:space-y-8">
      {(stats.overdueCount > 0 || stats.expiringSoon > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 fade-up">
          {stats.overdueCount > 0 && (
            <button onClick={() => onNavigate("payments")} className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-left hover:border-rose-400 transition">
              <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center shrink-0"><AlertTriangle className="w-5 h-5 text-rose-700" /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{stats.overdueCount} overdue payment{stats.overdueCount > 1 ? "s" : ""}</div>
                <div className="text-xs text-rose-700">Tap to review</div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-700" />
            </button>
          )}
          {stats.expiringSoon > 0 && (
            <button onClick={() => onNavigate("members")} className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-left hover:border-amber-400 transition">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0"><Calendar className="w-5 h-5 text-amber-700" /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{stats.expiringSoon} expiring soon</div>
                <div className="text-xs text-amber-700">Within 14 days</div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-700" />
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard className="fade-up stagger-1" label="Active members" value={stats.active} icon={Users} accent="bg-red-100 text-red-900" trend="+12%" trendUp />
        {isAdmin && <StatCard className="fade-up stagger-2" label="April revenue" value={`₦${(stats.revenue / 1000).toFixed(0)}K`} icon={DollarSign} accent="bg-amber-100 text-amber-900" trend="+8%" trendUp />}
        <StatCard className="fade-up stagger-3" label="Today's check-ins" value={stats.todayCheckIns} icon={Activity} accent="bg-sky-100 text-sky-900" />
        <StatCard className="fade-up stagger-4" label="Class utilization" value={`${Math.round(stats.classUtil * 100)}%`} icon={Flame} accent="bg-rose-100 text-rose-900" trend="-3%" />
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-stone-900 text-white p-6 sm:p-8 fade-up">
        <div className="absolute inset-0 noise-bg opacity-30 pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-red-500/20 blur-3xl" />
        <div className="relative z-10 max-w-xl">
          <div className="text-xs font-mono tracking-widest text-red-400 uppercase mb-3">This week</div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-3">Momentum is building.</h2>
          <p className="text-stone-300 text-base sm:text-lg">
            {stats.active} active members training hard. {Math.round(stats.classUtil * 100)}% of class slots filling up.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl border border-stone-200 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl font-semibold">Most booked classes</h3>
            <span className="text-[10px] sm:text-xs font-mono text-stone-500 tracking-wider">THIS WEEK</span>
          </div>
          <div className="space-y-3">
            {topClasses.map((c) => {
              const pct = Math.round((c.booked / c.capacity) * 100);
              return (
                <div key={c.id} className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 rounded-lg bg-stone-100 flex flex-col items-center justify-center shrink-0">
                    <div className="text-[10px] font-mono text-stone-500">{c.day.toUpperCase()}</div>
                    <div className="text-xs font-semibold">{c.time}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <div className="font-medium truncate">{c.name}</div>
                      <div className="text-xs text-stone-500 shrink-0">{c.booked}/{c.capacity}</div>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${pct >= 90 ? "bg-rose-500" : pct >= 60 ? "bg-red-500" : "bg-sky-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-5 sm:p-6">
          <h3 className="font-display text-xl font-semibold mb-5">Newest members</h3>
          <div className="space-y-3">
            {recentMembers.map((m) => (
              <button key={m.id} onClick={() => onMemberClick(m)} className="w-full flex items-center gap-3 hover:bg-stone-50 -mx-2 px-2 py-1 rounded-lg transition text-left">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center font-semibold text-stone-700 text-sm shrink-0">{m.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.name}</div>
                  <div className="text-xs text-stone-500">Joined {new Date(m.joinDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </div>
                <span className={`text-[10px] font-mono tracking-wider px-2 py-1 rounded-full ${planBadge(m.plan)} shrink-0`}>{m.plan.toUpperCase()}</span>
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-1 min-w-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900" />
          </div>
          <div className="flex gap-1 bg-stone-100 p-1 rounded-lg">
            {["all", "active", "expired"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md capitalize transition ${filter === f ? "bg-white shadow-sm" : "text-stone-600"}`}>{f}</button>
            ))}
          </div>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition shrink-0">
          <Plus className="w-4 h-4" /> Add member
        </button>
      </div>

      <div className="hidden md:block bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="scroll-x">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-left text-xs font-mono tracking-wider text-stone-500 uppercase border-b border-stone-200">
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
                <tr key={m.id} onClick={() => onMemberClick(m)} className="border-b border-stone-100 last:border-0 hover:bg-stone-50 transition cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center text-sm font-semibold text-stone-700">{m.name[0]}</div>
                      <div>
                        <div className="font-medium text-sm">{m.name}</div>
                        <div className="text-xs text-stone-500">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className={`text-[10px] font-mono tracking-wider px-2 py-1 rounded-full ${planBadge(m.plan)}`}>{m.plan.toUpperCase()}</span></td>
                  <td className="px-6 py-4 text-sm font-mono">{m.checkIns}</td>
                  <td className="px-6 py-4 text-sm text-stone-600">{m.lastVisit ? new Date(m.lastVisit).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${m.status === "active" ? "text-red-700" : "text-rose-700"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${m.status === "active" ? "bg-red-500" : "bg-rose-500"}`} />
                      {m.status === "active" ? "Active" : "Expired"}
                    </span>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => { setEditing(m); setShowModal(true); }} className="p-2 hover:bg-stone-100 rounded-md transition" title="Edit">
                        <Edit2 className="w-4 h-4 text-stone-600" />
                      </button>
                      {canDelete && (
                        <button onClick={() => handleDelete(m.id)} className="p-2 hover:bg-rose-100 rounded-md transition" title="Delete">
                          <Trash2 className="w-4 h-4 text-rose-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-stone-500"><AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-50" />No members match your search.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map((m) => (
          <div key={m.id} onClick={() => onMemberClick(m)} className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center font-semibold text-stone-700 shrink-0">{m.name[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-sm">{m.name}</div>
                  <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full ${planBadge(m.plan)} shrink-0`}>{m.plan.toUpperCase()}</span>
                </div>
                <div className="text-xs text-stone-500 truncate">{m.email}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="text-stone-600"><span className="font-mono font-semibold">{m.checkIns}</span> visits</span>
                <span className={`inline-flex items-center gap-1 ${m.status === "active" ? "text-red-700" : "text-rose-700"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${m.status === "active" ? "bg-red-500" : "bg-rose-500"}`} />{m.status}
                </span>
              </div>
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => { setEditing(m); setShowModal(true); }} className="p-2 hover:bg-stone-100 rounded-md"><Edit2 className="w-4 h-4 text-stone-600" /></button>
              </div>
            </div>
          </div>
        ))}
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
        <button onClick={onClose} className="flex-1 py-2.5 border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50">Cancel</button>
        <button onClick={submit} className="flex-1 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800">{member ? "Save changes" : "Add member"}</button>
      </>}>
      <div className="space-y-4">
        <Field icon={User} label="Full name" value={form.name} onChange={(v) => update("name", v)} />
        <Field icon={Mail} label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} />
        <Field icon={Phone} label="Phone" value={form.phone} onChange={(v) => update("phone", v)} />
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-500 uppercase mb-1.5 block">Plan</label>
          <div className="grid grid-cols-3 gap-2">
            {["Basic", "Standard", "Premium"].map((p) => (
              <button key={p} onClick={() => update("plan", p)}
                className={`py-2.5 rounded-lg text-sm font-medium border transition ${form.plan === p ? "bg-stone-900 text-white border-stone-900" : "bg-white border-stone-200 hover:border-stone-400"}`}>{p}</button>
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
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex justify-end" onClick={onClose}>
      <div className="bg-white w-full max-w-lg h-full overflow-y-auto slide-in" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-32 bg-gradient-to-br from-red-200 via-amber-200 to-rose-200">
          <div className="absolute inset-0 noise-bg opacity-40" />
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-lg backdrop-blur"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 -mt-12 relative pb-8">
          <div className="w-20 h-20 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-display text-3xl font-semibold border-4 border-white mb-4">{member.name[0]}</div>
          <h2 className="font-display text-2xl font-semibold">{member.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-mono tracking-wider px-2 py-1 rounded-full ${planBadge(member.plan)}`}>{member.plan.toUpperCase()}</span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${member.status === "active" ? "text-red-700" : "text-rose-700"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${member.status === "active" ? "bg-red-500" : "bg-rose-500"}`} />
              {member.status === "active" ? "Active" : "Expired"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="text-sm flex items-center gap-2 text-stone-600 min-w-0"><Mail className="w-4 h-4 shrink-0" /><span className="truncate">{member.email}</span></div>
            <div className="text-sm flex items-center gap-2 text-stone-600"><Phone className="w-4 h-4 shrink-0" /><span className="truncate">{member.phone}</span></div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-stone-50 rounded-lg p-3">
              <div className="text-[10px] font-mono text-stone-500 tracking-wider uppercase">Visits</div>
              <div className="font-display text-2xl font-semibold">{member.checkIns}</div>
            </div>
            <div className="bg-stone-50 rounded-lg p-3">
              <div className="text-[10px] font-mono text-stone-500 tracking-wider uppercase">Paid</div>
              <div className="font-display text-2xl font-semibold">₦{(totalPaid / 1000).toFixed(0)}K</div>
            </div>
            <div className="bg-stone-50 rounded-lg p-3">
              <div className="text-[10px] font-mono text-stone-500 tracking-wider uppercase">Expires</div>
              <div className={`font-display text-2xl font-semibold ${daysToExpiry < 14 && daysToExpiry >= 0 ? "text-amber-700" : daysToExpiry < 0 ? "text-rose-700" : ""}`}>
                {daysToExpiry >= 0 ? `${daysToExpiry}d` : "—"}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-display text-lg font-semibold mb-3">Payment history</h3>
            {payments.length === 0 ? <EmptyState title="No payments yet" /> : (
              <div className="space-y-2">
                {payments.slice(0, 6).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${p.status === "paid" ? "bg-red-100" : p.status === "overdue" ? "bg-rose-100" : "bg-amber-100"}`}>
                      <Receipt className={`w-4 h-4 ${p.status === "paid" ? "text-red-700" : p.status === "overdue" ? "text-rose-700" : "text-amber-700"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">₦{p.amount.toLocaleString()}</div>
                      <div className="text-xs text-stone-500">{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {p.method}</div>
                    </div>
                    <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded-full ${p.status === "paid" ? "bg-red-100 text-red-800" : p.status === "overdue" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="font-display text-lg font-semibold mb-3">Recent visits</h3>
            {checkIns.length === 0 ? <EmptyState title="No visits logged yet" /> : (
              <div className="space-y-1">
                {checkIns.slice(0, 8).map((ci) => (
                  <div key={ci.id} className="flex items-center gap-3 py-2">
                    <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-red-700" /></div>
                    <div className="flex-1 text-sm">{new Date(ci.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
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
      <div key={c.id} className="group relative p-3 bg-white border border-stone-100 rounded-lg hover:border-stone-300 transition">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-mono font-semibold">{c.time}</span>
          {canEdit && (
            <button onClick={() => handleDelete(c.id)} className="opacity-0 group-hover:opacity-100 transition">
              <Trash2 className="w-3 h-3 text-stone-400 hover:text-rose-600" />
            </button>
          )}
        </div>
        <div className="font-medium text-sm leading-tight mb-0.5">{c.name}</div>
        <div className="text-xs text-stone-500 mb-2 truncate">{c.trainer}</div>
        <div className="flex items-center gap-1.5">
          <div className="flex-1 h-1 bg-stone-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${pct >= 90 ? "bg-rose-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[10px] font-mono text-stone-500">{c.booked}/{c.capacity}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {canEdit && (
        <div className="flex justify-end">
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition">
            <Plus className="w-4 h-4" /> Add class
          </button>
        </div>
      )}

      <div className="hidden lg:grid grid-cols-7 gap-3">
        {days.map((day) => {
          const dayClasses = classes.filter((c) => c.day === day).sort((a, b) => a.time.localeCompare(b.time));
          return (
            <div key={day} className="bg-white rounded-xl border border-stone-200 p-3 min-h-[200px]">
              <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-3 px-1">{day}</div>
              <div className="space-y-2">
                {dayClasses.map(renderCard)}
                {dayClasses.length === 0 && <div className="text-xs text-stone-400 text-center py-6">No classes</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="lg:hidden space-y-4">
        {days.map((day) => {
          const dayClasses = classes.filter((c) => c.day === day).sort((a, b) => a.time.localeCompare(b.time));
          if (dayClasses.length === 0) return null;
          return (
            <div key={day}>
              <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-2 px-1">{day} · <span className="text-stone-400">{dayClasses.length} class{dayClasses.length !== 1 ? "es" : ""}</span></div>
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

  return (
    <Modal title="New class" onClose={onClose} footer={<>
      <button onClick={onClose} className="flex-1 py-2.5 border border-stone-200 rounded-lg text-sm font-medium">Cancel</button>
      <button onClick={submit} className="flex-1 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium">Add class</button>
    </>}>
      <div className="space-y-4">
        <Field label="Class name" value={form.name} onChange={(v) => update("name", v)} />
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-500 uppercase mb-1.5 block">Trainer</label>
          <select value={form.trainer} onChange={(e) => update("trainer", e.target.value)} className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm">
            {trainers.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-500 uppercase mb-1.5 block">Day</label>
            <select value={form.day} onChange={(e) => update("day", e.target.value)} className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-500 uppercase mb-1.5 block">Time</label>
            <input type="time" value={form.time} onChange={(e) => update("time", e.target.value)} className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-500 uppercase mb-1.5 block">Cap.</label>
            <input type="number" min="1" value={form.capacity} onChange={(e) => update("capacity", e.target.value)} className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm" />
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
        <div key={t.id} className={`bg-white rounded-xl border border-stone-200 overflow-hidden fade-up stagger-${(i % 4) + 1}`}>
          <div className="h-24 bg-gradient-to-br from-red-200 via-amber-200 to-rose-200 relative">
            <div className="absolute inset-0 noise-bg opacity-40" />
          </div>
          <div className="p-5 -mt-10 relative">
            <div className="w-16 h-16 rounded-xl bg-stone-900 text-white flex items-center justify-center font-display text-2xl font-semibold border-4 border-white mb-3">
              {t.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <h3 className="font-display text-xl font-semibold">{t.name}</h3>
            <p className="text-sm text-stone-500 mb-4">{t.specialty}</p>
            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <div>
                <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Clients</div>
                <div className="font-semibold text-lg">{t.clients}</div>
              </div>
              <div>
                <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Rating</div>
                <div className="font-semibold text-lg flex items-center gap-1">{t.rating}<span className="text-amber-500">★</span></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Check-ins ----------
// Members self-check-in by scanning the gym's QR poster with their phones.
// Staff manage the poster + see the activity log here.
export function CheckInsView({ checkIns }) {
  const [showPoster, setShowPoster] = useState(false);

  const grouped = checkIns.reduce((acc, ci) => { (acc[ci.date] = acc[ci.date] || []).push(ci); return acc; }, {});
  const todayCount = (grouped[today()] || []).length;

  return (
    <div className="space-y-6">
      {/* Single primary action: the gym's check-in poster */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 noise-bg opacity-20 pointer-events-none" />
        <div className="absolute -right-12 -top-12 w-60 h-60 rounded-full bg-red-500/20 blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-14 h-14 bg-lime-400 rounded-xl flex items-center justify-center shrink-0">
            <QrCode className="w-7 h-7 text-stone-900" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-mono tracking-widest text-red-400 uppercase mb-1">FRONT DESK QR</div>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold leading-tight">Check-in poster</h3>
            <p className="text-sm text-stone-300 mt-1 max-w-md">
              Members scan this from their phone to check themselves in. Print it and display it at the entrance, or show it on a tablet.
            </p>
          </div>
          <button onClick={() => setShowPoster(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-lime-400 text-stone-900 rounded-lg text-sm font-semibold hover:bg-lime-300 transition flex items-center justify-center gap-2 shrink-0">
            <QrCode className="w-4 h-4" /> Show / print
          </button>
        </div>
      </div>

      {/* Activity log */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-stone-400" />
            <h3 className="font-display text-xl font-semibold">Recent activity</h3>
          </div>
          <span className="text-xs font-mono tracking-wider text-stone-500">
            {todayCount} TODAY
          </span>
        </div>

        {Object.keys(grouped).length === 0 ? (
          <EmptyState icon={UserCheck} title="No check-ins yet" subtitle="Members will appear here as they scan in." />
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([date, entries]) => (
              <div key={date}>
                <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-3">
                  {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  <span className="ml-2 text-stone-400">· {entries.length} visit{entries.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="space-y-1">
                  {entries.map((ci) => (
                    <div key={ci.id} className="flex items-center gap-3 py-2 px-3 hover:bg-stone-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-red-700" />
                      </div>
                      <div className="flex-1"><div className="text-sm font-medium">{ci.memberName}</div></div>
                      <span className="text-[10px] font-mono tracking-wider text-stone-500 uppercase">QR</span>
                      <div className="text-sm font-mono text-stone-500">{ci.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Poster modal */}
      {showPoster && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto print:bg-white print:p-0 print:static" onClick={() => setShowPoster(false)}>
          <div onClick={(e) => e.stopPropagation()} className="my-auto print:my-0">
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Collected", val: totals.paid, dot: "bg-red-500", count: payments.filter((p) => p.status === "paid").length, sub: "payments" },
          { label: "Pending", val: totals.pending, dot: "bg-amber-500", count: payments.filter((p) => p.status === "pending").length, sub: "pending" },
          { label: "Overdue", val: totals.overdue, dot: "bg-rose-500", count: payments.filter((p) => p.status === "overdue").length, sub: "overdue" },
        ].map((c, i) => (
          <div key={c.label} className={`bg-white rounded-xl border border-stone-200 p-5 fade-up stagger-${i + 1}`}>
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-stone-500 uppercase mb-2">
              <span className={`w-2 h-2 rounded-full ${c.dot}`} /> {c.label}
            </div>
            <div className={`font-display text-3xl font-semibold ${c.label === "Overdue" ? "text-rose-700" : ""}`}>₦{(c.val / 1000).toFixed(0)}K</div>
            <div className="text-xs text-stone-500 mt-1">{c.count} {c.sub}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-stone-100 p-1 rounded-lg w-fit">
        {["all", "paid", "pending", "overdue"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition ${filter === f ? "bg-white shadow-sm" : "text-stone-600"}`}>{f}</button>
        ))}
      </div>

      <div className="hidden md:block bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="scroll-x">
          <table className="w-full min-w-[700px]">
            <thead><tr className="text-left text-xs font-mono tracking-wider text-stone-500 uppercase border-b border-stone-200">
              <th className="px-6 py-3 font-medium">Member</th><th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Date</th><th className="px-6 py-3 font-medium">Method</th>
              <th className="px-6 py-3 font-medium">Status</th><th className="px-6 py-3 font-medium text-right">Action</th>
            </tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                  <td className="px-6 py-4 text-sm font-medium">{p.memberName}</td>
                  <td className="px-6 py-4 text-sm font-mono">₦{p.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-stone-600">{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                  <td className="px-6 py-4 text-sm text-stone-600">{p.method}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded-full ${p.status === "paid" ? "bg-red-100 text-red-800" : p.status === "overdue" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {p.status !== "paid" && canMarkPaid && <button onClick={() => markPaid(p.id)} className="text-xs font-medium text-stone-900 hover:underline">Mark paid</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-2">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-sm font-medium">{p.memberName}</div>
                <div className="text-xs text-stone-500">{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {p.method}</div>
              </div>
              <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded-full ${p.status === "paid" ? "bg-red-100 text-red-800" : p.status === "overdue" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>{p.status}</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="font-display text-xl font-semibold">₦{p.amount.toLocaleString()}</div>
              {p.status !== "paid" && canMarkPaid && <button onClick={() => markPaid(p.id)} className="text-xs font-medium text-stone-900 underline">Mark paid</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-stone-200 p-4 fade-up stagger-1">
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Total revenue</div>
          <div className="font-display text-2xl font-semibold mt-1">₦{(totalRevenue / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 fade-up stagger-2">
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Avg / member</div>
          <div className="font-display text-2xl font-semibold mt-1">₦{(avgRevPerMember / 1000).toFixed(1)}K</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 fade-up stagger-3">
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Total members</div>
          <div className="font-display text-2xl font-semibold mt-1">{members.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4 fade-up stagger-4">
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Classes / wk</div>
          <div className="font-display text-2xl font-semibold mt-1">{classes.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold">Revenue trend</h3>
        <p className="text-xs text-stone-500 mt-1 mb-5">Last 6 months</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueByMonth}>
              <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
              <XAxis dataKey="month" stroke="#a8a29e" style={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis stroke="#a8a29e" style={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: "#1c1917", border: "none", borderRadius: 8, color: "white", fontSize: 12 }} formatter={(v) => [`₦${v.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6">
          <h3 className="font-display text-xl font-semibold mb-1">Plan mix</h3>
          <p className="text-xs text-stone-500 mb-5">Active members by plan</p>
          <div className="flex items-center gap-6">
            <div className="w-40 h-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={planDist} dataKey="value" innerRadius={45} outerRadius={75} paddingAngle={3}>
                    {planDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1c1917", border: "none", borderRadius: 8, color: "white", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {planDist.map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ background: p.color }} />
                  <span className="text-sm flex-1">{p.name}</span>
                  <span className="text-sm font-mono font-semibold">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6">
          <h3 className="font-display text-xl font-semibold mb-1">Top classes</h3>
          <p className="text-xs text-stone-500 mb-5">Booking utilization</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classUtil} layout="vertical" margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" horizontal={false} />
                <XAxis type="number" stroke="#a8a29e" style={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" stroke="#a8a29e" style={{ fontSize: 11 }} width={100} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1c1917", border: "none", borderRadius: 8, color: "white", fontSize: 12 }} formatter={(v) => [`${v}%`, "Utilization"]} />
                <Bar dataKey="util" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold mb-1">Peak hours</h3>
        <p className="text-xs text-stone-500 mb-5">Class attendance by time</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peakHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
              <XAxis dataKey="hour" stroke="#a8a29e" style={{ fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} interval={1} />
              <YAxis stroke="#a8a29e" style={{ fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1c1917", border: "none", borderRadius: 8, color: "white", fontSize: 12 }} />
              <Bar dataKey="visits" fill="#1c1917" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
