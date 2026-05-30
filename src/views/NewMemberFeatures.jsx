import React, { useState, useRef } from "react";
import {
  Camera, Trash2, ChevronLeft, ChevronRight, Share2, Download,
  Trophy, BookOpen, Plus, ChevronDown, ChevronUp,
} from "lucide-react";
import { EmptyState, Modal } from "../components/ui";
import { today } from "../utils/storage";

// ── Streak helper (exported for MemberHome + GrowthViews) ────────────────────
export const computeStreak = (checkIns, workoutLogs, memberId) => {
  const activeDates = new Set();
  checkIns.filter((c) => c.memberId === memberId && c.date).forEach((c) => activeDates.add(c.date));
  workoutLogs.filter((l) => l.memberId === memberId && l.date).forEach((l) => activeDates.add(l.date));
  if (activeDates.size === 0) return 0;
  const sorted = [...activeDates].sort().reverse();
  const todayStr = today();
  const yd = new Date(); yd.setDate(yd.getDate() - 1);
  const yStr = yd.toISOString().slice(0, 10);
  if (sorted[0] !== todayStr && sorted[0] !== yStr) return 0;
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.round((new Date(sorted[i - 1] + "T00:00:00") - new Date(sorted[i] + "T00:00:00")) / 86400000);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
};

// ── Badge definitions (exported for LoyaltyRewardsView) ──────────────────────
export const BADGE_DEFS = [
  { id: "first-checkin", label: "First Step",      emoji: "🏁", desc: "Complete your first gym check-in",  check: (s) => s.totalCheckIns >= 1   },
  { id: "checkin-10",    label: "Getting Started", emoji: "💪", desc: "10 gym check-ins",                  check: (s) => s.totalCheckIns >= 10  },
  { id: "checkin-25",    label: "Regular",         emoji: "⚡", desc: "25 gym check-ins",                  check: (s) => s.totalCheckIns >= 25  },
  { id: "checkin-50",    label: "Dedicated",       emoji: "🔥", desc: "50 gym check-ins",                  check: (s) => s.totalCheckIns >= 50  },
  { id: "checkin-100",   label: "Legend",          emoji: "💯", desc: "100 gym check-ins",                 check: (s) => s.totalCheckIns >= 100 },
  { id: "streak-7",      label: "Week Warrior",    emoji: "🗓️", desc: "7-day activity streak",            check: (s) => s.streak >= 7          },
  { id: "streak-30",     label: "Iron Will",       emoji: "🏆", desc: "30-day activity streak",            check: (s) => s.streak >= 30         },
  { id: "first-workout", label: "Log Master",      emoji: "📋", desc: "Log your first workout session",    check: (s) => s.totalWorkouts >= 1   },
  { id: "workout-10",    label: "Grinder",         emoji: "🦁", desc: "Log 10 workout sessions",           check: (s) => s.totalWorkouts >= 10  },
  { id: "first-class",   label: "Class Act",       emoji: "🥊", desc: "Book your first class",             check: (s) => s.totalClasses >= 1    },
  { id: "referred",      label: "Ambassador",      emoji: "🤝", desc: "Refer a friend to the gym",         check: (s) => s.referrals >= 1       },
];

// ── Workout suggestion helper (exported for MemberHome) ───────────────────────
const inferGroup = (name = "") => {
  const n = name.toLowerCase();
  if (/squat|leg press|lunge|hamstring|quad|glute|calf/.test(n)) return "Legs";
  if (/bench|chest|push.?up|fly|pec/.test(n)) return "Chest";
  if (/row|lat pull|pull.?up|back|deadlift|rdl/.test(n)) return "Back";
  if (/shoulder|overhead|ohp|delt|raise/.test(n)) return "Shoulders";
  if (/curl|tricep|bicep|dip/.test(n)) return "Arms";
  if (/crunch|plank|ab |core|sit.?up|oblique/.test(n)) return "Core";
  if (/run|treadmill|cycle|bike|cardio|jump|skip/.test(n)) return "Cardio";
  return null;
};

export const getWorkoutSuggestion = (workoutLogs, memberId) => {
  const myLogs = workoutLogs
    .filter((l) => l.memberId === memberId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  if (myLogs.length === 0) return { icon: "💡", msg: "Log your first workout to get personalised suggestions!" };
  const daysSince = Math.round((new Date() - new Date(myLogs[0].date + "T00:00:00")) / 86400000);
  if (daysSince >= 3) return { icon: "⚡", msg: `It's been ${daysSince} days since your last session. Time to get back in the gym!` };
  const recentGroups = new Set();
  myLogs.slice(0, 4).forEach((log) =>
    (log.exercises || []).forEach((ex) => { const g = inferGroup(ex.name); if (g) recentGroups.add(g); })
  );
  const untrained = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"].filter((g) => !recentGroups.has(g));
  if (untrained.length) return { icon: "🎯", msg: `You haven't trained ${untrained[0]} recently — perfect day for it!` };
  return { icon: "🔥", msg: "You're hitting every muscle group. Keep the momentum going!" };
};

// ============================================================================
// PROGRESS PHOTOS
// ============================================================================
export function ProgressPhotosView({ user, progressPhotos, setProgressPhotos }) {
  const fileRef = useRef(null);
  const [note, setNote] = useState("");
  const [showCompare, setShowCompare] = useState(false);

  const myPhotos = progressPhotos
    .filter((p) => p.memberId === user.memberId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 600;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        setProgressPhotos((ps) => [
          { id: `pp${Date.now()}`, memberId: user.memberId, date: today(), note: note.trim(), image: canvas.toDataURL("image/jpeg", 0.8) },
          ...ps,
        ]);
        setNote("");
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const oldest = myPhotos[myPhotos.length - 1];
  const newest = myPhotos[0];

  return (
    <div className="space-y-6 fade-up">
      {/* Upload */}
      <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 sm:p-6">
        <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-4">Add photo</div>
        <div className="space-y-3">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note (e.g. Week 4, after 5 kg cut)"
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-base sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full py-4 border-2 border-dashed border-stone-700 hover:border-red-600 text-stone-400 hover:text-red-400 rounded-xl transition flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Camera className="w-4 h-4" /> Upload progress photo
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
      </div>

      {/* Before / after toggle */}
      {myPhotos.length >= 2 && (
        <button
          onClick={() => setShowCompare((v) => !v)}
          className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl border border-stone-700 text-sm font-semibold transition flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /><ChevronRight className="w-4 h-4 -ml-2" />
          {showCompare ? "Hide comparison" : "Before & after comparison"}
        </button>
      )}

      {showCompare && oldest && newest && (
        <div className="bg-stone-900 border border-stone-700 rounded-2xl p-4">
          <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-3">Comparison</div>
          <div className="grid grid-cols-2 gap-3">
            {[{ label: "Before", p: oldest }, { label: "Now", p: newest }].map(({ label, p }) => (
              <div key={label}>
                <div className="text-xs font-mono text-stone-500 uppercase mb-1.5">
                  {label} · {new Date(p.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                </div>
                <img src={p.image} className="w-full rounded-xl object-cover aspect-square" alt={label} />
                {p.note && <div className="text-xs text-stone-400 mt-1 truncate">{p.note}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery */}
      <div>
        <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-3">
          Your photos ({myPhotos.length})
        </div>
        {myPhotos.length === 0 ? (
          <div className="bg-stone-900 border border-stone-700 rounded-2xl p-12 text-center">
            <Camera className="w-10 h-10 text-stone-700 mx-auto mb-3" />
            <div className="text-stone-400 text-sm font-medium">No photos yet</div>
            <div className="text-stone-500 text-xs mt-1">Upload your first photo to start tracking your transformation</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {myPhotos.map((p) => (
              <div key={p.id} className="relative group rounded-xl overflow-hidden bg-stone-800 border border-stone-700">
                <img src={p.image} className="w-full aspect-square object-cover" alt="Progress" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <div className="text-xs font-mono text-white/80">
                    {new Date(p.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  {p.note && <div className="text-xs text-white/60 truncate">{p.note}</div>}
                </div>
                <button
                  onClick={() => setProgressPhotos((ps) => ps.filter((x) => x.id !== p.id))}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// LEADERBOARD
// ============================================================================
export function LeaderboardView({ members, checkIns, loyaltyPoints, workoutLogs, user }) {
  const [tab, setTab] = useState("checkins");
  const month = today().slice(0, 7);

  const boards = {
    checkins: {
      label: "Check-ins", icon: "🏋️", sub: "This month",
      data: (() => {
        const c = {};
        checkIns.filter((x) => x.date?.startsWith(month)).forEach((x) => { c[x.memberId] = (c[x.memberId] || 0) + 1; });
        return members.filter((m) => c[m.id]).map((m) => ({ id: m.id, name: m.name, value: c[m.id], label: `${c[m.id]} visits` }))
          .sort((a, b) => b.value - a.value).slice(0, 10);
      })(),
    },
    points: {
      label: "Points", icon: "⭐", sub: "All-time",
      data: loyaltyPoints
        .map((l) => { const m = members.find((mb) => mb.id === l.memberId); return m ? { id: l.memberId, name: m.name, value: l.points, label: `${l.points.toLocaleString()} pts` } : null; })
        .filter(Boolean).sort((a, b) => b.value - a.value).slice(0, 10),
    },
    workouts: {
      label: "Workouts", icon: "💪", sub: "This month",
      data: (() => {
        const c = {};
        workoutLogs.filter((l) => l.date?.startsWith(month)).forEach((l) => { c[l.memberId] = (c[l.memberId] || 0) + 1; });
        return members.filter((m) => c[m.id]).map((m) => ({ id: m.id, name: m.name, value: c[m.id], label: `${c[m.id]} sessions` }))
          .sort((a, b) => b.value - a.value).slice(0, 10);
      })(),
    },
  };

  const board = boards[tab];
  const myId = user.memberId;
  const myRank = board.data.findIndex((e) => e.id === myId);
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-6 fade-up">
      {/* Tabs */}
      <div className="flex gap-1 bg-stone-900 border border-stone-700 rounded-xl p-1">
        {Object.entries(boards).map(([key, b]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1.5 ${tab === key ? "bg-red-600 text-white" : "text-stone-400 hover:text-white"}`}>
            <span>{b.icon}</span> {b.label}
          </button>
        ))}
      </div>

      {myRank >= 0 && (
        <div className="bg-red-950/30 border border-red-800 rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-red-300">Your rank</div>
          <div className="flex items-center gap-3">
            <div className="font-display text-2xl font-semibold text-white">#{myRank + 1}</div>
            <div className="text-sm text-stone-400">{board.data[myRank].label}</div>
          </div>
        </div>
      )}

      <div className="bg-stone-900 border border-stone-700 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between gap-2">
          <div className="font-display text-lg font-semibold text-white truncate">{board.label} Leaderboard</div>
          <div className="text-xs font-mono text-stone-500 shrink-0">{board.sub}</div>
        </div>
        {board.data.length === 0 ? (
          <div className="p-10 text-center">
            <Trophy className="w-10 h-10 text-stone-700 mx-auto mb-3" />
            <div className="text-stone-400 text-sm">No data yet — be the first on the board!</div>
          </div>
        ) : (
          <div className="divide-y divide-stone-800">
            {board.data.map((entry, i) => {
              const isMe = entry.id === myId;
              return (
                <div key={entry.id} className={`flex items-center gap-4 px-5 py-3.5 ${isMe ? "bg-red-950/20" : ""}`}>
                  <div className="w-8 text-center shrink-0">
                    {i < 3 ? <span className="text-xl">{medals[i]}</span> : <span className="text-sm font-mono text-stone-500">#{i + 1}</span>}
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-stone-700 to-stone-600 flex items-center justify-center font-semibold text-stone-200 text-sm shrink-0">
                    {entry.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold truncate ${isMe ? "text-red-300" : "text-stone-200"}`}>
                      {entry.name}
                      {isMe && <span className="ml-1.5 text-[10px] font-mono text-red-500 tracking-wider">YOU</span>}
                    </div>
                  </div>
                  <div className="text-sm font-mono font-bold text-stone-200 shrink-0">{entry.label}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// CLASS RATING PROMPT  (rendered inline in MemberHome)
// ============================================================================
export function ClassRatingPrompt({ classes, user, classRatings, setClassRatings }) {
  const unrated = classes.filter(
    (c) => (c.bookedMemberIds || []).includes(user.memberId) &&
    !classRatings.some((r) => r.classId === c.id && r.memberId === user.memberId)
  );
  const [idx, setIdx] = useState(0);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [dismissed, setDismissed] = useState([]);

  const visible = unrated.filter((c) => !dismissed.includes(c.id));
  if (visible.length === 0) return null;
  const cls = visible[idx % visible.length];

  const submit = () => {
    if (!rating) return;
    setClassRatings((rs) => [...rs, { id: `r${Date.now()}`, classId: cls.id, memberId: user.memberId, rating, date: today() }]);
    setRating(0);
    setIdx((i) => i + 1);
  };

  const dismiss = () => { setDismissed((d) => [...d, cls.id]); setRating(0); };

  const labels = ["", "Poor", "Fair", "Good", "Great", "Amazing!"];

  return (
    <div className="bg-stone-900 border border-amber-800/50 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-mono tracking-widest text-amber-400 uppercase">Rate a class</div>
        <button onClick={dismiss} className="text-xs text-stone-500 hover:text-stone-300 transition">Skip</button>
      </div>
      <div className="text-sm font-semibold text-stone-100 mb-0.5">{cls.name}</div>
      <div className="text-xs text-stone-500 mb-4">with {cls.trainer} · {cls.day} {cls.time}</div>
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} onClick={() => setRating(s)} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
            className="text-3xl leading-none transition-transform hover:scale-110 active:scale-95">
            <span className={(hovered || rating) >= s ? "text-amber-400" : "text-stone-700"}>★</span>
          </button>
        ))}
        {(hovered || rating) > 0 && (
          <span className="ml-2 text-xs text-stone-400">{labels[hovered || rating]}</span>
        )}
      </div>
      <button onClick={submit} disabled={!rating}
        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition disabled:opacity-40">
        Submit rating
      </button>
    </div>
  );
}

// ============================================================================
// MILESTONE SHARE CARD  (rendered inline in MemberHome)
// ============================================================================
export function MilestoneCard({ totalCheckIns, memberName, onDismiss }) {
  const canvasRef = useRef(null);
  const milestones = [10, 25, 50, 100, 200, 500];
  const milestone = milestones.find((m) => totalCheckIns === m);

  React.useEffect(() => {
    if (!milestone || !canvasRef.current) return;
    const cv = canvasRef.current;
    const ctx = cv.getContext("2d");
    cv.width = 600; cv.height = 600;
    const bg = ctx.createLinearGradient(0, 0, 600, 600);
    bg.addColorStop(0, "#1c1917"); bg.addColorStop(1, "#0c0a09");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 600, 600);
    ctx.beginPath(); ctx.arc(520, 80, 220, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(220,38,38,0.12)"; ctx.fill();
    ctx.font = "bold 15px monospace"; ctx.fillStyle = "#78716c";
    ctx.fillText("DISRUPTORS GYM", 50, 65);
    ctx.font = `bold ${milestone >= 100 ? 140 : 160}px sans-serif`; ctx.fillStyle = "#ef4444";
    ctx.fillText(milestone.toString(), 50, 280);
    ctx.font = "bold 34px sans-serif"; ctx.fillStyle = "#ffffff";
    ctx.fillText("CHECK-INS", 50, 330);
    ctx.font = "22px sans-serif"; ctx.fillStyle = "#a8a29e";
    ctx.fillText(memberName, 50, 385);
    ctx.font = "15px monospace"; ctx.fillStyle = "#57534e";
    ctx.fillText(new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), 50, 562);
  }, [milestone, memberName]);

  if (!milestone) return null;

  const download = () => {
    const link = document.createElement("a");
    link.download = `disruptors-${milestone}-checkins.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const share = async () => {
    if (!navigator.share) { download(); return; }
    try {
      const blob = await new Promise((res) => canvasRef.current.toBlob(res, "image/png"));
      await navigator.share({ title: `${milestone} Check-ins at Disruptors Gym!`, files: [new File([blob], "milestone.png", { type: "image/png" })] });
    } catch {}
  };

  return (
    <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-700 rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
      <div className="relative z-10">
        <div className="text-xs font-mono tracking-widest text-amber-400 uppercase mb-2">🏆 Milestone reached!</div>
        <div className="font-display text-2xl font-semibold text-white mb-1">{milestone} Check-ins</div>
        <div className="text-sm text-stone-400 mb-4">You've hit an incredible milestone. Share the achievement!</div>
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex gap-2">
          <button onClick={share} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button onClick={download} className="flex items-center gap-2 px-4 py-2.5 bg-stone-700 hover:bg-stone-600 text-white rounded-lg text-sm font-semibold transition">
            <Download className="w-4 h-4" /> Save image
          </button>
          <button onClick={onDismiss} className="ml-auto px-3 py-2.5 text-stone-500 hover:text-stone-300 text-sm transition">Dismiss</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// WORKOUT PLAN — MEMBER VIEW
// ============================================================================
export function WorkoutPlanView({ user, workoutPlans }) {
  const myPlan = workoutPlans.find((p) => p.memberId === user.memberId && p.active);
  const [openKey, setOpenKey] = useState(null);

  if (!myPlan) {
    return (
      <div className="fade-up">
        <div className="bg-stone-900 border border-stone-700 rounded-2xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-stone-700 mx-auto mb-4" />
          <div className="font-display text-xl font-semibold text-white mb-2">No plan assigned yet</div>
          <div className="text-sm text-stone-400 max-w-sm mx-auto">
            Your trainer will create a personalised plan for you. Check back after your next session!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-up">
      <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-700 rounded-2xl p-5 sm:p-6">
        <div className="text-xs font-mono tracking-widest text-red-400 uppercase mb-2">Your active plan</div>
        <div className="font-display text-2xl font-semibold text-white mb-1">{myPlan.name}</div>
        <div className="text-sm text-stone-400">Assigned by {myPlan.trainerName} · {myPlan.weeks.length} week{myPlan.weeks.length !== 1 ? "s" : ""}</div>
      </div>

      {myPlan.weeks.map((week) => (
        <div key={week.week} className="bg-stone-900 border border-stone-700 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-800">
            <div className="font-display text-lg font-semibold text-white">Week {week.week}</div>
          </div>
          <div className="divide-y divide-stone-800">
            {week.sessions.map((session, si) => {
              const key = `${week.week}-${si}`;
              const open = openKey === key;
              return (
                <div key={key}>
                  <button onClick={() => setOpenKey(open ? null : key)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-stone-800/50 transition text-left">
                    <div>
                      <div className="font-semibold text-stone-200 text-sm">{session.day}</div>
                      <div className="text-xs text-stone-500 mt-0.5">{session.focus} · {session.exercises.length} exercises</div>
                    </div>
                    {open ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
                  </button>
                  {open && (
                    <div className="px-5 pb-4 space-y-2">
                      {session.exercises.map((ex, ei) => (
                        <div key={ei} className="flex items-start gap-3 bg-stone-800 rounded-lg px-3 py-2.5">
                          <div className="w-7 h-7 rounded-full bg-red-900/40 flex items-center justify-center text-xs font-bold text-red-400 shrink-0 mt-0.5">
                            {ei + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-stone-200">{ex.name}</div>
                            <div className="text-xs text-stone-400 mt-0.5">{ex.sets} sets × {ex.reps}</div>
                            {ex.notes && <div className="text-xs text-stone-500 italic mt-0.5">"{ex.notes}"</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// ASSIGN PLANS — TRAINER VIEW
// ============================================================================
export function AssignPlanView({ user, members, workoutPlans, setWorkoutPlans }) {
  const myClients = members.filter((m) => m.trainerId === user.trainerId);
  const myPlans = workoutPlans.filter((p) => p.trainerId === user.trainerId);
  const [showForm, setShowForm] = useState(false);

  const toggleActive = (id) => setWorkoutPlans((ps) => ps.map((p) => p.id === id ? { ...p, active: !p.active } : p));
  const deletePlan = (id) => setWorkoutPlans((ps) => ps.filter((p) => p.id !== id));

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-start gap-3 justify-between">
        <p className="text-sm text-stone-400">Create personalised plans and assign them to your clients.</p>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition whitespace-nowrap shrink-0">
          <Plus className="w-4 h-4" /> New plan
        </button>
      </div>

      {myPlans.length === 0 ? (
        <EmptyState icon={BookOpen} title="No plans yet" subtitle="Create your first workout plan and assign it to a client." />
      ) : (
        <div className="space-y-4">
          {myPlans.map((plan) => {
            const member = members.find((m) => m.id === plan.memberId);
            return (
              <div key={plan.id} className="bg-stone-900 border border-stone-700 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="font-semibold text-stone-100">{plan.name}</div>
                    <div className="text-xs text-stone-500 mt-1">
                      {member?.name || "Unknown"} · {plan.weeks.length} week{plan.weeks.length !== 1 ? "s" : ""} ·{" "}
                      {plan.weeks.reduce((s, w) => s + w.sessions.length, 0)} sessions
                    </div>
                  </div>
                  <span className={`text-xs font-mono px-2.5 py-1 rounded-full shrink-0 border ${plan.active ? "bg-red-900/30 text-red-400 border-red-800" : "bg-stone-800 text-stone-500 border-stone-700"}`}>
                    {plan.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleActive(plan.id)}
                    className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg border border-stone-700 transition">
                    {plan.active ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => deletePlan(plan.id)}
                    className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-rose-900/30 text-stone-400 hover:text-rose-300 rounded-lg border border-stone-700 hover:border-rose-800 transition">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <PlanForm clients={myClients} trainer={user} onSave={(p) => { setWorkoutPlans((ps) => [...ps, p]); setShowForm(false); }} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

function PlanForm({ clients, trainer, onSave, onClose }) {
  const [name, setName] = useState("");
  const [memberId, setMemberId] = useState(clients[0]?.id || "");
  const [sessions, setSessions] = useState([
    { day: "Monday", focus: "", exercises: [{ name: "", sets: 3, reps: "10", notes: "" }] },
  ]);

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const addSession = () =>
    setSessions((ss) => [...ss, { day: "Monday", focus: "", exercises: [{ name: "", sets: 3, reps: "10", notes: "" }] }]);
  const removeSession = (i) => setSessions((ss) => ss.filter((_, j) => j !== i));
  const upd = (i, f, v) => setSessions((ss) => ss.map((s, j) => j !== i ? s : { ...s, [f]: v }));
  const updEx = (si, ei, f, v) => setSessions((ss) => ss.map((s, i) => i !== si ? s : { ...s, exercises: s.exercises.map((ex, j) => j !== ei ? ex : { ...ex, [f]: v }) }));
  const addEx = (si) => setSessions((ss) => ss.map((s, i) => i !== si ? s : { ...s, exercises: [...s.exercises, { name: "", sets: 3, reps: "10", notes: "" }] }));
  const removeEx = (si, ei) => setSessions((ss) => ss.map((s, i) => i !== si ? s : { ...s, exercises: s.exercises.filter((_, j) => j !== ei) }));

  const save = () => {
    if (!name.trim() || !memberId) return;
    const member = clients.find((c) => c.id === memberId);
    onSave({
      id: `wp${Date.now()}`,
      trainerId: trainer.trainerId,
      trainerName: trainer.name,
      memberId,
      memberName: member?.name || "",
      name: name.trim(),
      createdDate: today(),
      active: true,
      weeks: [{ week: 1, sessions }],
    });
  };

  return (
    <Modal title="Create Workout Plan" maxWidth="max-w-2xl" onClose={onClose}
      footer={
        <button onClick={save} className="w-full py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
          Save & assign plan
        </button>
      }
    >
      <div className="space-y-5 pb-2">
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Plan name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. 4-Week Strength Foundation"
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-base sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Assign to</label>
          <select value={memberId} onChange={(e) => setMemberId(e.target.value)}
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500">
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {clients.length === 0 && <p className="text-xs text-rose-400 mt-1">No clients assigned to you yet.</p>}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono tracking-wider text-stone-400 uppercase">Sessions (Week 1)</div>
            <button onClick={addSession} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition">
              <Plus className="w-3 h-3" /> Add session
            </button>
          </div>
          {sessions.map((session, si) => (
            <div key={si} className="border border-stone-700 rounded-xl p-4 space-y-3 bg-stone-800/30">
              <div className="flex items-center gap-2">
                <select value={session.day} onChange={(e) => upd(si, "day", e.target.value)}
                  className="px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500">
                  {DAYS.map((d) => <option key={d}>{d}</option>)}
                </select>
                <input value={session.focus} onChange={(e) => upd(si, "focus", e.target.value)} placeholder="Focus (e.g. Upper Push)"
                  className="flex-1 min-w-0 px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-base sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
                {sessions.length > 1 && (
                  <button onClick={() => removeSession(si)} className="p-2 text-stone-500 hover:text-rose-400 transition shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {session.exercises.map((ex, ei) => (
                  <div key={ei} className="flex gap-2 items-center">
                    <input value={ex.name} onChange={(e) => updEx(si, ei, "name", e.target.value)} placeholder="Exercise name"
                      className="flex-1 min-w-0 px-2.5 py-2 bg-stone-900 border border-stone-700 rounded-lg text-base sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
                    <input value={ex.sets} onChange={(e) => updEx(si, ei, "sets", e.target.value)} placeholder="Sets"
                      className="w-14 px-2 py-2 bg-stone-900 border border-stone-700 rounded-lg text-base sm:text-sm text-white focus:outline-none focus:border-red-500 text-center" />
                    <input value={ex.reps} onChange={(e) => updEx(si, ei, "reps", e.target.value)} placeholder="Reps"
                      className="w-16 px-2 py-2 bg-stone-900 border border-stone-700 rounded-lg text-base sm:text-sm text-white focus:outline-none focus:border-red-500 text-center" />
                    {session.exercises.length > 1 && (
                      <button onClick={() => removeEx(si, ei)} className="p-1.5 text-stone-500 hover:text-rose-400 transition shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => addEx(si)} className="text-xs text-stone-500 hover:text-red-400 flex items-center gap-1 transition mt-1">
                  <Plus className="w-3 h-3" /> Add exercise
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
