import React, { useState, useMemo } from "react";
import {
  Megaphone, Plus, Phone, Mail, MessageSquare, ChevronRight, X, User,
  DoorOpen, Shield, AlertTriangle, CheckCircle2, Send, Clock,
  Edit2, Trash2, Calendar, Activity, Users, TrendingUp,
} from "lucide-react";
import { Modal, Field, TextArea, EmptyState, StatCard } from "../components/ui";
import { LEAD_STAGES, PLAN_PRICES } from "../data/seed";
import { today, nowTime } from "../utils/storage";

// ========================================================================
// LEADS (Sales Pipeline) — Kanban-style board
// ========================================================================
export function LeadsView({ leads, setLeads, members, setMembers }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [dragging, setDragging] = useState(null);

  const grouped = useMemo(() => {
    const g = {};
    LEAD_STAGES.forEach((s) => { g[s.id] = leads.filter((l) => l.stage === s.id); });
    return g;
  }, [leads]);

  const totalActive = leads.filter((l) => !["won", "lost"].includes(l.stage)).length;
  const conversionRate = leads.length > 0 ? Math.round((leads.filter((l) => l.stage === "won").length / leads.length) * 100) : 0;
  const hotLeads = leads.filter((l) => ["tour-booked", "trial"].includes(l.stage)).length;

  const handleSave = (data) => {
    if (editing) setLeads(leads.map((l) => l.id === editing.id ? { ...l, ...data, lastContact: today() } : l));
    else setLeads([...leads, { id: `l${Date.now()}`, ...data, stage: "new", createdAt: today(), lastContact: today() }]);
    setShowModal(false); setEditing(null);
  };

  const handleDelete = (id) => { if (confirm("Delete this lead?")) setLeads(leads.filter((l) => l.id !== id)); };

  const moveStage = (leadId, newStage) => {
    setLeads(leads.map((l) => l.id === leadId ? { ...l, stage: newStage, lastContact: today() } : l));
  };

  const convertToMember = (lead) => {
    if (!confirm(`Convert ${lead.name} into a member with ${lead.interest} plan?`)) return;
    const exp = new Date(); exp.setMonth(exp.getMonth() + 1);
    const id = `m${Date.now()}`;
    setMembers([...members, {
      id, name: lead.name, email: lead.email, phone: lead.phone,
      plan: lead.interest, joinDate: today(), expiryDate: exp.toISOString().slice(0, 10),
      status: "active", checkIns: 0, lastVisit: null, trainerId: null,
    }]);
    setLeads(leads.map((l) => l.id === lead.id ? { ...l, stage: "won", lastContact: today() } : l));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Active leads" value={totalActive} icon={Megaphone} accent="bg-sky-500/20 text-sky-400" />
        <StatCard label="Hot leads" value={hotLeads} icon={Activity} accent="bg-amber-500/20 text-amber-400" />
        <StatCard label="Conversion rate" value={`${conversionRate}%`} icon={TrendingUp} accent="bg-red-500/20 text-red-400" />
        <StatCard label="Total in pipeline" value={leads.length} icon={Users} accent="bg-stone-700 text-stone-400" />
      </div>

      <div className="flex justify-end">
        <button onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">
          <Plus className="w-4 h-4" /> Add lead
        </button>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {LEAD_STAGES.map((stage) => (
          <div key={stage.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { if (dragging) { moveStage(dragging, stage.id); setDragging(null); } }}
            className="bg-stone-800 rounded-xl p-2 min-h-[300px]"
          >
            <div className="flex items-center justify-between px-2 py-2 mb-2">
              <div className={`text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded-full border ${stage.color}`}>
                {stage.label}
              </div>
              <span className="text-xs font-mono text-stone-500">{grouped[stage.id].length}</span>
            </div>

            <div className="space-y-2">
              {grouped[stage.id].map((lead) => (
                <div key={lead.id}
                  draggable
                  onDragStart={() => setDragging(lead.id)}
                  onDragEnd={() => setDragging(null)}
                  onClick={() => { setEditing(lead); setShowModal(true); }}
                  className="bg-stone-900 rounded-lg p-3 border border-stone-700 cursor-pointer hover:border-red-600 transition">
                  <div className="font-medium text-sm mb-1 truncate text-stone-100">{lead.name}</div>
                  <div className="text-[10px] font-mono text-stone-500 tracking-wider uppercase mb-2">{lead.source}</div>
                  <div className="text-[10px] text-stone-400 mb-2 line-clamp-2">{lead.notes}</div>
                  <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono">
                    <span>{lead.interest}</span>
                    <span>{new Date(lead.lastContact).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                  {stage.id === "trial" && (
                    <button onClick={(e) => { e.stopPropagation(); convertToMember(lead); }}
                      className="mt-2 w-full py-1.5 bg-red-600 text-white text-[10px] font-semibold rounded hover:bg-red-700 transition">
                      Convert to member
                    </button>
                  )}
                </div>
              ))}
              {grouped[stage.id].length === 0 && (
                <div className="text-xs text-stone-600 text-center py-6">Drop here</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <LeadModal lead={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} onDelete={editing ? () => { handleDelete(editing.id); setShowModal(false); setEditing(null); } : null} />
      )}
    </div>
  );
}

function LeadModal({ lead, onSave, onClose, onDelete }) {
  const [form, setForm] = useState(lead || { name: "", email: "", phone: "", source: "Walk-in", interest: "Standard", notes: "", assignedTo: "" });
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = () => { if (!form.name) return alert("Name required"); onSave(form); };

  return (
    <Modal title={lead ? "Edit lead" : "New lead"} onClose={onClose}
      footer={<>
        {onDelete && <button onClick={onDelete} className="px-3 py-2.5 border border-rose-800 text-rose-400 rounded-lg text-sm font-medium hover:bg-rose-950/40 transition">Delete</button>}
        <button onClick={onClose} className="flex-1 py-2.5 border border-stone-700 text-stone-300 rounded-lg text-sm font-medium hover:bg-stone-800 transition">Cancel</button>
        <button onClick={submit} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">Save</button>
      </>}>
      <div className="space-y-4">
        <Field icon={User} label="Full name" value={form.name} onChange={(v) => update("name", v)} />
        <div className="grid grid-cols-2 gap-3">
          <Field icon={Mail} label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} />
          <Field icon={Phone} label="Phone" value={form.phone} onChange={(v) => update("phone", v)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Source</label>
            <select value={form.source} onChange={(e) => update("source", e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-base sm:text-sm text-white focus:outline-none focus:border-red-500">
              {["Walk-in", "Instagram", "Facebook", "Referral", "Website", "Google Ads", "Other"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Interested in</label>
            <select value={form.interest} onChange={(e) => update("interest", e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-base sm:text-sm text-white focus:outline-none focus:border-red-500">
              {["Basic", "Standard", "Premium"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <TextArea label="Notes" value={form.notes} onChange={(v) => update("notes", v)} rows={3} placeholder="Anything worth remembering..." />
        <Field label="Assigned to" value={form.assignedTo} onChange={(v) => update("assignedTo", v)} placeholder="Staff member name" />
      </div>
    </Modal>
  );
}

// ========================================================================
// ACCESS CONTROL — 24/7 door management with logs
// ========================================================================
export function AccessControlView({ accessLogs, setAccessLogs, members }) {
  const [doors, setDoors] = useState([
    { id: "main", name: "Main Entrance", status: "online", lastActivity: "1m ago", schedule: "24/7 access" },
    { id: "studio", name: "Studio Door", status: "online", lastActivity: "12m ago", schedule: "Class hours only" },
    { id: "side", name: "Side Door", status: "online", lastActivity: "8m ago", schedule: "Staff only" },
  ]);

  const todayLogs = accessLogs.filter((a) => a.date === today());
  const granted = accessLogs.filter((a) => a.granted).length;
  const denied = accessLogs.filter((a) => !a.granted).length;

  const lockDoor = (id) => setDoors(doors.map((d) => d.id === id ? { ...d, status: d.status === "locked" ? "online" : "locked" } : d));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Today's entries" value={todayLogs.filter((a) => a.granted).length} icon={DoorOpen} accent="bg-red-500/20 text-red-400" />
        <StatCard label="Active doors" value={doors.filter((d) => d.status === "online").length} icon={Shield} accent="bg-sky-500/20 text-sky-400" />
        <StatCard label="Denied attempts" value={denied} icon={AlertTriangle} accent="bg-rose-500/20 text-rose-400" />
        <StatCard label="Total grants" value={granted} icon={CheckCircle2} accent="bg-amber-500/20 text-amber-400" />
      </div>

      <div>
        <h3 className="font-display text-xl font-semibold mb-4 text-white">Doors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doors.map((d) => (
            <div key={d.id} className="bg-stone-900 rounded-xl border border-stone-700 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${d.status === "online" ? "bg-red-900/40" : "bg-rose-900/40"}`}>
                  <DoorOpen className={`w-5 h-5 ${d.status === "online" ? "text-red-400" : "text-rose-400"}`} />
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${d.status === "online" ? "text-red-400" : "text-rose-400"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${d.status === "online" ? "bg-red-500 animate-pulse" : "bg-rose-500"}`} />
                  {d.status === "online" ? "Online" : "Locked"}
                </span>
              </div>
              <div className="font-semibold mb-1 text-stone-100">{d.name}</div>
              <div className="text-xs text-stone-500 mb-3">{d.schedule}</div>
              <div className="text-xs font-mono text-stone-600 mb-4">Last activity: {d.lastActivity}</div>
              <button onClick={() => lockDoor(d.id)} className="w-full py-2 text-xs font-medium border border-stone-700 text-stone-300 rounded-lg hover:border-red-600 hover:text-red-400 transition">
                {d.status === "online" ? "Lock door" : "Unlock door"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-stone-900 rounded-xl border border-stone-700 p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold mb-4 text-white">Access log</h3>
        {accessLogs.length === 0 ? (
          <EmptyState icon={Clock} title="No access events yet" subtitle="Door activity will appear here in real time." />
        ) : (
          <div className="space-y-1">
            {accessLogs.slice(0, 20).map((log) => (
              <div key={log.id} className={`flex items-center gap-3 py-2.5 px-3 rounded-lg ${log.granted ? "hover:bg-stone-800" : "bg-rose-950/20 hover:bg-rose-950/30"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.granted ? "bg-red-900/40" : "bg-rose-900/40"}`}>
                  {log.granted ? <CheckCircle2 className="w-4 h-4 text-red-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-stone-200">{log.memberName}</div>
                  <div className="text-xs text-stone-500">
                    {log.door}{!log.granted && log.reason && <span className="text-rose-400"> · {log.reason}</span>}
                  </div>
                </div>
                <div className="text-xs font-mono text-stone-500 text-right">
                  <div>{log.time}</div>
                  <div className="text-stone-600">{new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================================================
// MESSAGES — Automated communications, templates, manual broadcasts
// ========================================================================
export function MessagesView({ messages, setMessages, templates, setTemplates, members }) {
  const [tab, setTab] = useState("messages");

  const sentToday = messages.filter((m) => m.date === today() && m.status === "sent").length;
  const scheduled = messages.filter((m) => m.status === "scheduled").length;
  const activeTemplates = templates.filter((t) => t.active).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Sent today" value={sentToday} icon={Send} accent="bg-red-500/20 text-red-400" />
        <StatCard label="Scheduled" value={scheduled} icon={Clock} accent="bg-amber-500/20 text-amber-400" />
        <StatCard label="Active templates" value={activeTemplates} icon={MessageSquare} accent="bg-sky-500/20 text-sky-400" />
        <StatCard label="Total sent" value={messages.filter((m) => m.status === "sent").length} icon={CheckCircle2} accent="bg-stone-700 text-stone-400" />
      </div>

      <div className="flex gap-1 bg-stone-800 p-1 rounded-lg w-fit">
        {[
          { id: "messages", label: "Activity" },
          { id: "templates", label: "Automations" },
          { id: "compose", label: "Compose" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition ${tab === t.id ? "bg-stone-950 text-white shadow-sm" : "text-stone-400 hover:text-stone-200"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "messages" && <MessagesList messages={messages} />}
      {tab === "templates" && <TemplatesList templates={templates} setTemplates={setTemplates} />}
      {tab === "compose" && <ComposeView messages={messages} setMessages={setMessages} members={members} onSent={() => setTab("messages")} />}
    </div>
  );
}

function MessagesList({ messages }) {
  const grouped = messages.reduce((acc, m) => { (acc[m.date] = acc[m.date] || []).push(m); return acc; }, {});

  return (
    <div className="bg-stone-900 rounded-xl border border-stone-700 p-5 sm:p-6">
      {Object.keys(grouped).length === 0 ? (
        <EmptyState icon={Send} title="No messages yet" />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([date, msgs]) => (
            <div key={date}>
              <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-3">
                {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </div>
              <div className="space-y-2">
                {msgs.map((m) => (
                  <div key={m.id} className="flex items-start gap-3 p-3 bg-stone-800 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.status === "sent" ? "bg-red-900/40" : "bg-amber-900/40"}`}>
                      {m.channel === "Email" ? <Mail className="w-4 h-4 text-stone-400" /> : <MessageSquare className="w-4 h-4 text-stone-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                        <div className="text-sm font-medium text-stone-200">{m.recipient}</div>
                        <span className="text-[10px] font-mono tracking-wider uppercase text-stone-500">{m.channel}</span>
                        {m.template && <span className="text-[10px] font-mono tracking-wider uppercase bg-stone-700 text-stone-300 px-2 py-0.5 rounded-full">{m.template}</span>}
                        <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full ${m.status === "sent" ? "bg-red-900/40 text-red-300" : "bg-amber-900/40 text-amber-300"}`}>{m.status}</span>
                      </div>
                      <div className="text-xs text-stone-400 line-clamp-2">{m.content}</div>
                    </div>
                    <div className="text-xs font-mono text-stone-500 shrink-0">{m.time}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TemplatesList({ templates, setTemplates }) {
  const toggle = (id) => setTemplates(templates.map((t) => t.id === id ? { ...t, active: !t.active } : t));

  return (
    <div className="space-y-3">
      <div className="bg-stone-800 border border-stone-700 rounded-xl p-4">
        <p className="text-sm text-stone-300">
          Automated messages send based on triggers. Use <span className="font-mono text-xs bg-stone-900 px-1.5 py-0.5 rounded text-stone-300">{`{{name}}`}</span>, <span className="font-mono text-xs bg-stone-900 px-1.5 py-0.5 rounded text-stone-300">{`{{plan}}`}</span> etc. to personalize.
        </p>
      </div>
      {templates.map((t) => (
        <div key={t.id} className="bg-stone-900 rounded-xl border border-stone-700 p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <div className="font-semibold text-stone-100">{t.name}</div>
                <span className="text-[10px] font-mono tracking-wider uppercase bg-stone-700 text-stone-300 px-2 py-0.5 rounded-full">{t.channel}</span>
              </div>
              <div className="text-xs text-stone-500">Trigger: {t.trigger}</div>
            </div>
            <button onClick={() => toggle(t.id)}
              className={`relative w-11 h-6 rounded-full transition shrink-0 ${t.active ? "bg-red-600" : "bg-stone-700"}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition ${t.active ? "left-5" : "left-0.5"}`} />
            </button>
          </div>
          <div className="text-sm text-stone-400 bg-stone-800 p-3 rounded-lg font-mono text-xs border border-stone-700">{t.body}</div>
        </div>
      ))}
    </div>
  );
}

function ComposeView({ messages, setMessages, members, onSent }) {
  const [audience, setAudience] = useState("all");
  const [channel, setChannel] = useState("SMS");
  const [content, setContent] = useState("");

  const audienceLabel = {
    all: "All members",
    active: "Active members only",
    premium: "All Premium members",
    expiring: "Expiring soon (14 days)",
  };

  const recipients = useMemo(() => {
    switch (audience) {
      case "active": return members.filter((m) => m.status === "active");
      case "premium": return members.filter((m) => m.plan === "Premium" && m.status === "active");
      case "expiring": return members.filter((m) => {
        if (m.status !== "active") return false;
        const days = (new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
        return days >= 0 && days <= 14;
      });
      default: return members;
    }
  }, [audience, members]);

  const send = () => {
    if (!content.trim()) return alert("Write a message first.");
    setMessages([{
      id: `msg${Date.now()}`,
      type: "manual",
      template: null,
      recipient: `${audienceLabel[audience]} (${recipients.length})`,
      channel,
      status: "sent",
      date: today(),
      time: nowTime(),
      content: content.trim(),
    }, ...messages]);
    setContent("");
    onSent();
  };

  return (
    <div className="bg-stone-900 rounded-xl border border-stone-700 p-5 sm:p-6 max-w-2xl">
      <h3 className="font-display text-xl font-semibold mb-5 text-white">New broadcast</h3>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Audience</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(audienceLabel).map(([key, label]) => (
              <button key={key} onClick={() => setAudience(key)}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium border text-left transition ${audience === key ? "bg-red-600 text-white border-red-600" : "bg-stone-800 border-stone-700 text-stone-300 hover:border-stone-500"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="text-xs text-stone-500 mt-2 font-mono">{recipients.length} recipient{recipients.length !== 1 ? "s" : ""}</div>
        </div>

        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Channel</label>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setChannel("SMS")} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition ${channel === "SMS" ? "bg-red-600 text-white border-red-600" : "bg-stone-800 border-stone-700 text-stone-300 hover:border-stone-500"}`}>
              <MessageSquare className="w-4 h-4" /> SMS
            </button>
            <button onClick={() => setChannel("Email")} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition ${channel === "Email" ? "bg-red-600 text-white border-red-600" : "bg-stone-800 border-stone-700 text-stone-300 hover:border-stone-500"}`}>
              <Mail className="w-4 h-4" /> Email
            </button>
          </div>
        </div>

        <TextArea label="Message" value={content} onChange={setContent} rows={5} placeholder="Hi {{name}}, ..." />

        <button onClick={send} className="w-full py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2">
          <Send className="w-4 h-4" /> Send to {recipients.length}
        </button>
      </div>
    </div>
  );
}
