import React, { useState } from "react";
import { Dumbbell, Plus, Trash2, ChevronDown, ChevronUp, Activity, X } from "lucide-react";
import { EmptyState, Modal } from "../components/ui";
import { today } from "../utils/storage";

const COMMON_EXERCISES = [
  "Bench Press","Squat","Deadlift","Overhead Press","Bent-over Row",
  "Pull-ups","Dips","Bicep Curl","Tricep Extension","Leg Press",
  "Lunges","Romanian Deadlift","Incline Press","Lateral Raise",
  "Face Pull","Cable Row","Leg Curl","Leg Extension","Calf Raise",
  "Hip Thrust","Plank","Push-ups","Ab Wheel","Russian Twist","Burpees",
];

// ======================================================================
// WORKOUT LOG VIEW
// ======================================================================
export function WorkoutLogView({ user, workoutLogs, setWorkoutLogs, loyaltyPoints, setLoyaltyPoints }) {
  const myLogs = workoutLogs
    .filter((l) => l.memberId === user.memberId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const totalSets = myLogs.reduce((s, l) => s + l.exercises.reduce((ss, e) => ss + e.sets.length, 0), 0);
  const totalExercises = myLogs.reduce((s, l) => s + l.exercises.length, 0);

  const handleSave = (log) => {
    setWorkoutLogs((ls) => [log, ...ls]);
    if (setLoyaltyPoints) {
      setLoyaltyPoints((lps) => {
        const entry = { id: `lph${Date.now()}`, date: today(), points: 2, reason: "Workout logged" };
        const existing = lps.find((l) => l.memberId === user.memberId);
        if (existing) return lps.map((l) => l.memberId === user.memberId ? { ...l, points: l.points + 2, history: [entry, ...l.history] } : l);
        return [...lps, { memberId: user.memberId, points: 2, history: [entry] }];
      });
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-3">
          <div className="bg-stone-900 rounded-xl border border-stone-700 p-4 text-center">
            <div className="font-display text-3xl font-semibold text-white">{myLogs.length}</div>
            <div className="text-xs font-mono text-stone-500 tracking-wider uppercase mt-0.5">Sessions</div>
          </div>
          <div className="bg-stone-900 rounded-xl border border-stone-700 p-4 text-center">
            <div className="font-display text-3xl font-semibold text-white">{totalExercises}</div>
            <div className="text-xs font-mono text-stone-500 tracking-wider uppercase mt-0.5">Exercises</div>
          </div>
          <div className="bg-stone-900 rounded-xl border border-stone-700 p-4 text-center">
            <div className="font-display text-3xl font-semibold text-white">{totalSets}</div>
            <div className="text-xs font-mono text-stone-500 tracking-wider uppercase mt-0.5">Total sets</div>
          </div>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition shrink-0">
          <Plus className="w-4 h-4" /> Log workout
        </button>
      </div>

      {myLogs.length === 0 ? (
        <div className="bg-stone-900 rounded-xl border border-stone-700 p-12 text-center">
          <Dumbbell className="w-10 h-10 mx-auto mb-3 text-stone-600" />
          <p className="font-medium text-stone-400">No workouts logged yet</p>
          <p className="text-sm text-stone-500 mt-1 mb-4">Start tracking your sessions to monitor progress and earn loyalty points.</p>
          <button onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition">
            Log first workout
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {myLogs.map((log) => {
            const isExpanded = expanded === log.id;
            const totalLogSets = log.exercises.reduce((s, e) => s + e.sets.length, 0);
            const dateObj = new Date(log.date + "T12:00:00");
            return (
              <div key={log.id} className="bg-stone-900 rounded-xl border border-stone-700 overflow-hidden">
                <button className="w-full flex items-center justify-between p-5 text-left hover:bg-stone-800 transition"
                  onClick={() => setExpanded(isExpanded ? null : log.id)}>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 bg-stone-800 border border-stone-700 rounded-xl flex flex-col items-center justify-center shrink-0">
                      <div className="text-[9px] font-mono text-stone-500 uppercase">{dateObj.toLocaleDateString("en-US", { month: "short" })}</div>
                      <div className="text-sm font-bold text-white leading-tight">{dateObj.getDate()}</div>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-stone-100">{log.exercises.length} exercise{log.exercises.length !== 1 ? "s" : ""} · {totalLogSets} sets</div>
                      <div className="text-xs text-stone-500 truncate">{log.exercises.map((e) => e.name).join(", ")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {log.notes && <span className="text-[10px] bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded-full font-mono hidden sm:inline">Note</span>}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-stone-800 pt-4 space-y-4">
                    {log.exercises.map((ex, ei) => (
                      <div key={ei}>
                        <div className="text-sm font-semibold mb-2 text-stone-300">{ex.name}</div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                          {ex.sets.map((set, si) => (
                            <div key={si} className="bg-stone-800 border border-stone-700 rounded-lg p-2 text-center">
                              <div className="text-[9px] font-mono text-stone-500 uppercase">Set {si + 1}</div>
                              <div className="text-sm font-semibold text-stone-100">{set.reps}</div>
                              <div className="text-[10px] text-stone-500">{set.weight > 0 ? `${set.weight}kg` : "BW"}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {log.notes && (
                      <div className="text-xs text-stone-400 bg-amber-950/20 border border-amber-900/50 rounded-lg px-3 py-2 italic">
                        "{log.notes}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && <WorkoutForm user={user} onSave={handleSave} onClose={() => setShowForm(false)} />}
    </div>
  );
}

function WorkoutForm({ user, onSave, onClose }) {
  const [date, setDate] = useState(today());
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState([{ name: "", sets: [{ reps: "", weight: "" }] }]);

  const addExercise = () => setExercises((ex) => [...ex, { name: "", sets: [{ reps: "", weight: "" }] }]);
  const removeExercise = (i) => setExercises((ex) => ex.filter((_, idx) => idx !== i));
  const updateName = (i, name) => setExercises((ex) => ex.map((e, idx) => idx === i ? { ...e, name } : e));
  const addSet = (ei) => setExercises((ex) => ex.map((e, idx) => idx === ei ? { ...e, sets: [...e.sets, { reps: "", weight: "" }] } : e));
  const removeSet = (ei, si) => setExercises((ex) => ex.map((e, idx) => idx === ei ? { ...e, sets: e.sets.filter((_, sidx) => sidx !== si) } : e));
  const updateSet = (ei, si, field, value) => setExercises((ex) => ex.map((e, idx) => idx === ei ? { ...e, sets: e.sets.map((s, sidx) => sidx === si ? { ...s, [field]: value } : s) } : e));

  const handleSave = () => {
    const cleaned = exercises
      .filter((e) => e.name.trim())
      .map((e) => ({ name: e.name.trim(), sets: e.sets.filter((s) => s.reps !== "").map((s) => ({ reps: parseInt(s.reps) || 0, weight: parseFloat(s.weight) || 0 })) }))
      .filter((e) => e.sets.length > 0);
    if (cleaned.length === 0) return;
    onSave({ id: `wl${Date.now()}`, memberId: user.memberId, date, exercises: cleaned, notes: notes.trim() });
  };

  return (
    <Modal
      title="Log Workout"
      subtitle={`${exercises.filter((e) => e.name).length} exercises`}
      onClose={onClose}
      footer={
        <button onClick={handleSave} className="w-full py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
          Save session · +2 pts
        </button>
      }
    >
      <div className="space-y-5 pb-1">
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500" />
        </div>
        <div className="space-y-4">
          {exercises.map((ex, ei) => (
            <div key={ei} className="bg-stone-800 rounded-xl p-4 space-y-3 border border-stone-700">
              <div className="flex items-center gap-2">
                <input list={`ex-list-${ei}`} value={ex.name} onChange={(e) => updateName(ei, e.target.value)}
                  placeholder="Exercise name" className="flex-1 min-w-0 px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-base sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
                <datalist id={`ex-list-${ei}`}>{COMMON_EXERCISES.map((e) => <option key={e} value={e} />)}</datalist>
                {exercises.length > 1 && (
                  <button onClick={() => removeExercise(ei)} className="p-2 text-stone-500 hover:text-rose-400 transition shrink-0"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
              <div className="space-y-2">
                {ex.sets.map((set, si) => (
                  <div key={si} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-stone-500 w-7 shrink-0">S{si + 1}</span>
                    <input type="number" value={set.reps} onChange={(e) => updateSet(ei, si, "reps", e.target.value)}
                      placeholder="Reps" className="w-16 sm:w-20 px-2 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-base sm:text-sm text-center text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
                    <input type="number" value={set.weight} onChange={(e) => updateSet(ei, si, "weight", e.target.value)}
                      placeholder="kg" className="w-16 sm:w-20 px-2 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-base sm:text-sm text-center text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
                    <span className="text-xs text-stone-500">kg</span>
                    {ex.sets.length > 1 && (
                      <button onClick={() => removeSet(ei, si)} className="text-stone-600 hover:text-rose-400 transition ml-auto shrink-0"><X className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => addSet(ei)} className="text-xs text-stone-500 hover:text-stone-300 font-medium flex items-center gap-1 transition">
                <Plus className="w-3 h-3" /> Add set
              </button>
            </div>
          ))}
        </div>
        <button onClick={addExercise} className="w-full py-2.5 border-2 border-dashed border-stone-700 rounded-xl text-sm text-stone-500 hover:border-stone-500 hover:text-stone-300 transition flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add exercise
        </button>
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="How did it go? Any PRs?"
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500 resize-none" rows={2} />
        </div>
      </div>
    </Modal>
  );
}

// ======================================================================
// BODY METRICS VIEW
// ======================================================================
export function BodyMetricsView({ user, bodyMetrics, setBodyMetrics }) {
  const myMetrics = bodyMetrics
    .filter((m) => m.memberId === user.memberId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const [showForm, setShowForm] = useState(false);
  const latest = myMetrics[myMetrics.length - 1];
  const prev = myMetrics[myMetrics.length - 2];

  const diff = (field) => {
    if (!latest || !prev || latest[field] == null || prev[field] == null) return null;
    return parseFloat((latest[field] - prev[field]).toFixed(1));
  };

  const DiffBadge = ({ field, lowerIsBetter = false }) => {
    const d = diff(field);
    if (d === null || d === 0) return null;
    const good = lowerIsBetter ? d < 0 : d > 0;
    return (
      <span className={`text-xs font-mono ml-1 ${good ? "text-red-400" : "text-rose-400"}`}>
        {d > 0 ? "+" : ""}{d}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-400">Track your body composition over time.</p>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
          <Plus className="w-4 h-4" /> Log metrics
        </button>
      </div>

      {!latest ? (
        <div className="bg-stone-900 rounded-xl border border-stone-700 p-12 text-center">
          <Activity className="w-10 h-10 mx-auto mb-3 text-stone-600" />
          <p className="font-medium text-stone-400">No metrics logged yet</p>
          <p className="text-sm text-stone-500 mt-1 mb-4">Start tracking your body composition today.</p>
          <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition">
            Log first entry
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: "Weight", field: "weight", unit: "kg", lower: true },
              { label: "Body Fat", field: "bodyFat", unit: "%", lower: true },
              { label: "Chest", field: "chest", unit: "cm", lower: false },
              { label: "Waist", field: "waist", unit: "cm", lower: true },
              { label: "Arms", field: "arms", unit: "cm", lower: false },
            ].map(({ label, field, unit, lower }) => (
              <div key={field} className="bg-stone-900 rounded-xl border border-stone-700 p-4">
                <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">{label}</div>
                <div className="font-display text-2xl font-semibold mt-1 text-white">
                  {latest[field] ?? "—"}
                  <span className="text-sm font-normal text-stone-500 ml-0.5">{unit}</span>
                </div>
                <DiffBadge field={field} lowerIsBetter={lower} />
              </div>
            ))}
          </div>

          {myMetrics.length > 1 && (
            <div className="bg-stone-900 rounded-xl border border-stone-700 p-5">
              <h3 className="font-display text-lg font-semibold mb-2 text-white">Weight trend</h3>
              <WeightSparkline metrics={myMetrics} />
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-stone-500 font-mono tracking-wider uppercase text-left">
                      <th className="pb-2">Date</th>
                      <th className="pb-2 text-right">Weight</th>
                      <th className="pb-2 text-right">Body Fat</th>
                      <th className="pb-2 text-right">Waist</th>
                      <th className="pb-2 text-right hidden sm:table-cell">Arms</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...myMetrics].reverse().map((m) => (
                      <tr key={m.id} className="border-t border-stone-800">
                        <td className="py-2 text-stone-300">{new Date(m.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                        <td className="py-2 text-right font-mono text-stone-200">{m.weight}kg</td>
                        <td className="py-2 text-right font-mono text-stone-400">{m.bodyFat != null ? `${m.bodyFat}%` : "—"}</td>
                        <td className="py-2 text-right font-mono text-stone-400">{m.waist != null ? `${m.waist}cm` : "—"}</td>
                        <td className="py-2 text-right font-mono text-stone-400 hidden sm:table-cell">{m.arms != null ? `${m.arms}cm` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {showForm && (
        <MetricsForm
          user={user}
          onSave={(entry) => { setBodyMetrics((m) => [...m, entry]); setShowForm(false); }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function WeightSparkline({ metrics }) {
  const weights = metrics.map((m) => m.weight).filter(Boolean);
  if (weights.length < 2) return null;
  const min = Math.min(...weights) - 1;
  const max = Math.max(...weights) + 1;
  const W = 400, H = 80;
  const xOf = (i) => (i / (metrics.length - 1)) * W;
  const yOf = (v) => H - ((v - min) / (max - min || 1)) * H;
  const points = metrics.map((m, i) => `${xOf(i)},${yOf(m.weight)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16" preserveAspectRatio="none">
      <polyline fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" points={points} />
      {metrics.map((m, i) => (
        <circle key={i} cx={xOf(i)} cy={yOf(m.weight)} r="3.5" fill="#ef4444" />
      ))}
    </svg>
  );
}

function MetricsForm({ user, onSave, onClose }) {
  const [form, setForm] = useState({ date: today(), weight: "", bodyFat: "", chest: "", waist: "", arms: "", notes: "" });
  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSave = () => {
    if (!form.weight) return;
    onSave({
      id: `bm${Date.now()}`, memberId: user.memberId,
      date: form.date,
      weight: parseFloat(form.weight) || 0,
      bodyFat: form.bodyFat ? parseFloat(form.bodyFat) : null,
      chest: form.chest ? parseFloat(form.chest) : null,
      waist: form.waist ? parseFloat(form.waist) : null,
      arms: form.arms ? parseFloat(form.arms) : null,
      notes: form.notes.trim(),
    });
  };

  return (
    <Modal title="Log Body Metrics" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Date</label>
          <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)}
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Weight (kg)*", field: "weight" },
            { label: "Body Fat (%)", field: "bodyFat" },
            { label: "Chest (cm)", field: "chest" },
            { label: "Waist (cm)", field: "waist" },
            { label: "Arms (cm)", field: "arms" },
          ].map(({ label, field }) => (
            <div key={field}>
              <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">{label}</label>
              <input type="number" step="0.1" value={form[field]} onChange={(e) => set(field, e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
            </div>
          ))}
        </div>
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Notes</label>
          <input type="text" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="How are you feeling?"
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
        </div>
        <button onClick={handleSave} className="w-full py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
          Save metrics
        </button>
      </div>
    </Modal>
  );
}
