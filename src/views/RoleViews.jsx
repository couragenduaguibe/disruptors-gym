import React, { useState } from "react";
import {
  Users, CalendarDays, Activity, Flame, CheckCircle2, AlertTriangle,
  Calendar, Award, UserCheck, QrCode, Camera, ShoppingBag, ShoppingCart,
  Plus, Minus, Trash2, PackageCheck, CreditCard, DollarSign, Truck, Store,
  Layers, RefreshCw, Bell, UserPlus, UserMinus, X,
} from "lucide-react";
import { StatCard, EmptyState, Modal } from "../components/ui";
import { planBadge, today, nowTime } from "../utils/storage";
import { PLAN_PRICES, seedShopProducts } from "../data/seed";
import { MemberQRScanner } from "../components/QRScanner";
import { computeStreak, getWorkoutSuggestion, ClassRatingPrompt, MilestoneCard } from "./NewMemberFeatures";

// ========================================================================
// TRAINER VIEWS
// ========================================================================
export function TrainerHome({ user, classes, members }) {
  const myClasses = classes.filter((c) => c.trainerId === user.trainerId);
  const myClients = members.filter((m) => m.trainerId === user.trainerId);
  const totalBooked = myClasses.reduce((s, c) => s + c.booked, 0);
  const totalCapacity = myClasses.reduce((s, c) => s + c.capacity, 0);
  const todayDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
  const todaysClasses = myClasses.filter((c) => c.day === todayDay).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard className="fade-up stagger-1" label="Active clients" value={myClients.length} icon={Users} accent="bg-red-500/20 text-red-400" />
        <StatCard className="fade-up stagger-2" label="Weekly classes" value={myClasses.length} icon={CalendarDays} accent="bg-sky-500/20 text-sky-400" />
        <StatCard className="fade-up stagger-3" label="Total bookings" value={totalBooked} icon={Activity} accent="bg-amber-500/20 text-amber-400" />
        <StatCard className="fade-up stagger-4" label="Capacity used" value={`${Math.round((totalBooked / Math.max(1, totalCapacity)) * 100)}%`} icon={Flame} accent="bg-rose-500/20 text-rose-400" />
      </div>

      {todaysClasses.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-amber-400" />
            <div className="text-sm font-semibold text-amber-300">Today's classes — {todaysClasses.length} session{todaysClasses.length > 1 ? "s" : ""}</div>
          </div>
          <div className="space-y-2">
            {todaysClasses.map((c) => (
              <div key={c.id} className="flex items-center justify-between bg-stone-800 rounded-lg px-3 py-2 border border-amber-900/50">
                <div>
                  <div className="text-sm font-medium text-stone-200">{c.name}</div>
                  <div className="text-xs text-stone-400">{c.booked}/{c.capacity} members booked</div>
                </div>
                <div className="text-sm font-mono font-semibold text-amber-400">{c.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative overflow-hidden rounded-2xl bg-stone-900 text-white p-6 sm:p-8 fade-up">
        <div className="absolute inset-0 noise-bg opacity-30 pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="relative z-10 max-w-xl">
          <div className="text-xs font-mono tracking-widest text-amber-400 uppercase mb-3">This week</div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-3">
            You have {myClasses.length} class{myClasses.length !== 1 ? "es" : ""} to lead.
          </h2>
          <p className="text-stone-300 text-base">
            {myClients.length} clients in your care. Lead them well.
          </p>
        </div>
      </div>

      <div className="bg-stone-900 rounded-xl border border-stone-700 p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold mb-5 text-white">This week's schedule</h3>
        {myClasses.length === 0 ? <EmptyState icon={CalendarDays} title="No classes scheduled" /> : (
          <div className="space-y-3">
            {myClasses.sort((a, b) => {
              const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
              return days.indexOf(a.day) - days.indexOf(b.day) || a.time.localeCompare(b.time);
            }).map((c) => {
              const pct = Math.round((c.booked / c.capacity) * 100);
              return (
                <div key={c.id} className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 rounded-lg bg-stone-800 flex flex-col items-center justify-center shrink-0">
                    <div className="text-[10px] font-mono text-stone-500">{c.day.toUpperCase()}</div>
                    <div className="text-xs font-semibold text-stone-200">{c.time}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <div className="font-medium text-stone-200 truncate">{c.name}</div>
                      <div className="text-xs text-stone-500 shrink-0">{c.booked}/{c.capacity}</div>
                    </div>
                    <div className="h-1.5 bg-stone-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${pct >= 90 ? "bg-rose-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function TrainerClasses({ user, classes, members }) {
  const myClasses = classes.filter((c) => c.trainerId === user.trainerId);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-4">
      {days.map((day) => {
        const dayClasses = myClasses.filter((c) => c.day === day).sort((a, b) => a.time.localeCompare(b.time));
        if (dayClasses.length === 0) return null;
        return (
          <div key={day} className="bg-stone-900 rounded-xl border border-stone-700 p-5">
            <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-4">
              {day} · <span className="text-stone-500">{dayClasses.length} class{dayClasses.length !== 1 ? "es" : ""}</span>
            </div>
            <div className="space-y-4">
              {dayClasses.map((c) => {
                const attendees = (c.bookedMemberIds || []).map((id) => members.find((m) => m.id === id)).filter(Boolean);
                const pct = Math.round((c.booked / c.capacity) * 100);
                return (
                  <div key={c.id} className="border border-stone-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-stone-100">{c.name}</div>
                        <div className="text-xs text-stone-500 font-mono mt-0.5">{c.time}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono text-stone-500">{c.booked}/{c.capacity}</div>
                        <div className="w-20 h-1 bg-stone-700 rounded-full mt-1 overflow-hidden">
                          <div className={`h-full rounded-full ${pct >= 90 ? "bg-rose-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                    {attendees.length > 0 && (
                      <div className="pt-3 border-t border-stone-700">
                        <div className="text-[10px] font-mono tracking-wider text-stone-500 uppercase mb-2">Booked attendees</div>
                        <div className="flex flex-wrap gap-1.5">
                          {attendees.map((a) => (
                            <span key={a.id} className="inline-flex items-center gap-1.5 text-xs bg-stone-800 text-stone-300 px-2 py-1 rounded-full">
                              <span className="w-5 h-5 rounded-full bg-stone-700 flex items-center justify-center text-[10px] font-semibold text-stone-200">{a.name[0]}</span>
                              {a.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {myClasses.length === 0 && <EmptyState icon={CalendarDays} title="No classes assigned yet" />}
    </div>
  );
}

export function TrainerClients({ user, members, onMemberClick }) {
  const myClients = members.filter((m) => m.trainerId === user.trainerId);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {myClients.map((m, i) => (
        <button key={m.id} onClick={() => onMemberClick(m)}
          className={`bg-stone-900 rounded-xl border border-stone-700 p-5 text-left hover:border-red-600 transition fade-up stagger-${(i % 4) + 1}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-stone-700 to-stone-600 flex items-center justify-center font-semibold text-stone-200">{m.name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-stone-100 truncate">{m.name}</div>
              <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full ${planBadge(m.plan)}`}>{m.plan.toUpperCase()}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="font-mono text-stone-500 tracking-wider uppercase">Visits</div>
              <div className="font-semibold text-base mt-0.5 text-stone-200">{m.checkIns}</div>
            </div>
            <div>
              <div className="font-mono text-stone-500 tracking-wider uppercase">Status</div>
              <div className={`font-semibold text-base mt-0.5 ${m.status === "active" ? "text-red-400" : "text-rose-400"}`}>
                {m.status === "active" ? "Active" : "Expired"}
              </div>
            </div>
          </div>
        </button>
      ))}
      {myClients.length === 0 && (
        <div className="col-span-full"><EmptyState icon={Users} title="No clients assigned yet" /></div>
      )}
    </div>
  );
}

// ========================================================================
// MEMBER VIEWS
// ========================================================================
export function MemberHome({ user, members, setMembers, classes, payments, checkIns, setCheckIns, onNavigate, workoutLogs = [], classRatings = [], setClassRatings = () => {}, loyaltyPoints, setLoyaltyPoints }) {
  const me = members.find((m) => m.id === user.memberId);
  const [milestoneDismissed, setMilestoneDismissed] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [checkInFeedback, setCheckInFeedback] = useState(null);
  if (!me) return <div className="text-stone-500">Member record not found.</div>;

  const handleCheckIn = (locationId) => {
    if (!me || !setCheckIns || !setMembers) return;
    if (me.status === "paused") {
      setCheckInFeedback({ type: "error", message: "Your membership is on hold. Please contact the front desk." });
      setShowScanner(false); return;
    }
    if (me.status !== "active") {
      setCheckInFeedback({ type: "error", message: "Your membership is expired. Please renew at the front desk." });
      setShowScanner(false); return;
    }
    const recentCheckIn = checkIns.find((c) => c.memberId === me.id && c.date === today() && Math.abs(parseInt(c.time.replace(":", "")) - parseInt(nowTime().replace(":", ""))) < 5);
    if (recentCheckIn) {
      setCheckInFeedback({ type: "info", message: "You're already checked in! Get to work." });
      setShowScanner(false); return;
    }
    setMembers((prev) => prev.map((m) => m.id === me.id ? { ...m, checkIns: m.checkIns + 1, lastVisit: today() } : m));
    setCheckIns((prev) => [{ id: `ci${Date.now()}`, memberId: me.id, memberName: me.name, date: today(), time: nowTime(), method: "QR" }, ...prev]);
    if (setLoyaltyPoints) {
      setLoyaltyPoints((lps) => {
        const entry = { id: `lph${Date.now()}`, date: today(), points: 5, reason: "Gym check-in" };
        const existing = lps.find((l) => l.memberId === me.id);
        if (existing) return lps.map((l) => l.memberId === me.id ? { ...l, points: l.points + 5, history: [entry, ...l.history] } : l);
        return [...lps, { memberId: me.id, points: 5, history: [entry] }];
      });
    }
    setCheckInFeedback({ type: "success", message: `Welcome back, ${me.name.split(" ")[0]}! That's visit #${me.checkIns + 1}. +5 loyalty points!` });
    setShowScanner(false);
  };

  if (showScanner) {
    return <MemberQRScanner onCheckIn={handleCheckIn} onClose={() => setShowScanner(false)} />;
  }

  const myClasses = classes.filter((c) => (c.bookedMemberIds || []).includes(me.id));
  const myCheckIns = checkIns.filter((c) => c.memberId === me.id);
  const myPayments = payments.filter((p) => p.memberId === me.id);
  const daysToExpiry = Math.ceil((new Date(me.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
  const overdue = myPayments.find((p) => p.status === "overdue");
  const streak = computeStreak(checkIns, workoutLogs, me.id);
  const suggestion = getWorkoutSuggestion(workoutLogs, me.id);

  const todayDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
  const todaysClasses = myClasses.filter((c) => c.day === todayDay).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-6">
      {overdue && (
        <div className="flex items-center gap-3 p-4 bg-rose-950/40 border border-rose-800 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-rose-900/50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-rose-300">Overdue payment</div>
            <div className="text-xs text-rose-400">₦{overdue.amount.toLocaleString()} — please contact the front desk</div>
          </div>
        </div>
      )}

      {todaysClasses.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-amber-400" />
            <div className="text-sm font-semibold text-amber-300">You have {todaysClasses.length} class{todaysClasses.length > 1 ? "es" : ""} today</div>
          </div>
          <div className="space-y-2">
            {todaysClasses.map((c) => (
              <div key={c.id} className="flex items-center justify-between bg-stone-800 rounded-lg px-3 py-2 border border-amber-900/50">
                <div>
                  <div className="text-sm font-medium text-stone-200">{c.name}</div>
                  <div className="text-xs text-stone-400">with {c.trainer}</div>
                </div>
                <div className="text-sm font-mono font-semibold text-amber-400">{c.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Check-in feedback */}
      {checkInFeedback && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          checkInFeedback.type === "success" ? "bg-red-950/40 border-red-800 text-red-300" :
          checkInFeedback.type === "error"   ? "bg-rose-950/40 border-rose-800 text-rose-300" :
          "bg-sky-950/40 border-sky-800 text-sky-300"
        }`}>
          {checkInFeedback.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
          <p className="text-sm font-medium flex-1">{checkInFeedback.message}</p>
          <button onClick={() => setCheckInFeedback(null)} className="shrink-0 opacity-60 hover:opacity-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Big check-in CTA */}
      <button onClick={() => setMembers && setCheckIns ? setShowScanner(true) : onNavigate("my-qr")}
        className="w-full bg-red-600 text-white rounded-2xl p-6 sm:p-8 flex items-center gap-5 hover:bg-red-700 transition group">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-900 rounded-2xl flex items-center justify-center shrink-0">
          <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="font-display text-2xl sm:text-3xl font-semibold leading-tight">Check in</div>
          <div className="text-sm sm:text-base text-red-200 mt-1">Tap to scan the QR at the front desk</div>
        </div>
      </button>

      {/* Milestone share card */}
      {!milestoneDismissed && (
        <MilestoneCard totalCheckIns={me.checkIns} memberName={me.name} onDismiss={() => setMilestoneDismissed(true)} />
      )}

      {/* Streak card */}
      {streak > 0 && (
        <div className={`flex items-center gap-4 rounded-xl p-4 border ${streak >= 7 ? "bg-amber-950/30 border-amber-800" : "bg-stone-900 border-stone-700"}`}>
          <span className="text-4xl shrink-0">🔥</span>
          <div>
            <div className={`font-display text-2xl font-semibold ${streak >= 7 ? "text-amber-300" : "text-white"}`}>
              {streak} day streak!
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              {streak >= 30 ? "Unreal consistency. Iron Will badge unlocked!" : streak >= 7 ? "You're on fire — don't break the chain!" : `Keep going — ${7 - streak} more days for the Week Warrior badge!`}
            </div>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden rounded-2xl bg-stone-900 text-white p-6 sm:p-8 fade-up">
        <div className="absolute inset-0 noise-bg opacity-30 pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-red-500/20 blur-3xl" />
        <div className="relative z-10 max-w-xl">
          <div className="text-xs font-mono tracking-widest text-red-400 uppercase mb-3">{me.plan.toUpperCase()} MEMBER</div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-3">
            {me.checkIns} workouts and counting.
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            Membership valid for another {daysToExpiry > 0 ? daysToExpiry : 0} days. Keep showing up.
          </p>
        </div>
      </div>

      {/* Workout suggestion */}
      {suggestion && (
        <div className="flex items-start gap-3 bg-stone-900 border border-stone-700 rounded-xl p-4">
          <span className="text-xl shrink-0 mt-0.5">{suggestion.icon}</span>
          <div>
            <div className="text-xs font-mono tracking-wider text-stone-500 uppercase mb-0.5">Workout suggestion</div>
            <div className="text-sm text-stone-200">{suggestion.msg}</div>
            <button onClick={() => onNavigate("my-workouts")} className="text-xs text-red-400 hover:text-red-300 mt-2 inline-block transition">
              Log a session →
            </button>
          </div>
        </div>
      )}

      {/* Class rating prompt */}
      <ClassRatingPrompt classes={classes} user={user} classRatings={classRatings} setClassRatings={setClassRatings} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard className="fade-up stagger-1" label="Total visits" value={me.checkIns} icon={Activity} accent="bg-red-500/20 text-red-400" />
        <StatCard className="fade-up stagger-2" label="Classes booked" value={myClasses.length} icon={CalendarDays} accent="bg-sky-500/20 text-sky-400" />
        <StatCard className="fade-up stagger-3" label="Plan" value={me.plan} icon={Award} accent="bg-amber-500/20 text-amber-400" />
        <StatCard className="fade-up stagger-4" label="Days left" value={daysToExpiry >= 0 ? daysToExpiry : 0} icon={Calendar} accent={daysToExpiry < 14 ? "bg-rose-500/20 text-rose-400" : "bg-stone-700 text-stone-400"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-stone-900 rounded-xl border border-stone-700 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl font-semibold text-white">My upcoming classes</h3>
            <button onClick={() => onNavigate("book-classes")} className="text-xs font-medium text-red-400 hover:text-red-300 transition">Book more</button>
          </div>
          {myClasses.length === 0 ? <EmptyState icon={CalendarDays} title="No classes booked yet" /> : (
            <div className="space-y-3">
              {myClasses.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-stone-800 flex flex-col items-center justify-center shrink-0">
                    <div className="text-[10px] font-mono text-stone-500">{c.day.toUpperCase()}</div>
                    <div className="text-xs font-semibold text-stone-200">{c.time}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-stone-200 truncate">{c.name}</div>
                    <div className="text-xs text-stone-500 truncate">with {c.trainer}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-stone-900 rounded-xl border border-stone-700 p-5 sm:p-6">
          <h3 className="font-display text-xl font-semibold text-white mb-5">Recent visits</h3>
          {myCheckIns.length === 0 ? <EmptyState icon={UserCheck} title="No visits logged yet" /> : (
            <div className="space-y-1">
              {myCheckIns.slice(0, 5).map((ci) => (
                <div key={ci.id} className="flex items-center gap-3 py-2">
                  <div className="w-7 h-7 rounded-full bg-red-900/40 flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-red-400" /></div>
                  <div className="flex-1 text-sm text-stone-300">{new Date(ci.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
                  <div className="text-sm font-mono text-stone-500">{ci.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Member QR scan view — opens the camera scanner
export function MemberQRView({ user, members, setMembers, checkIns, setCheckIns, onNavigate, loyaltyPoints, setLoyaltyPoints }) {
  const [showScanner, setShowScanner] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const me = members.find((m) => m.id === user.memberId);

  const handleCheckIn = (locationId) => {
    if (!me) return;
    if (me.status === "paused") {
      setFeedback({ type: "error", message: "Your membership is on hold. Please contact the front desk." });
      setShowScanner(false);
      return;
    }
    if (me.status !== "active") {
      setFeedback({ type: "error", message: "Your membership is expired. Please renew at the front desk." });
      setShowScanner(false);
      return;
    }

    const recentCheckIn = checkIns.find((c) => c.memberId === me.id && c.date === today() && Math.abs(parseInt(c.time.replace(":", "")) - parseInt(nowTime().replace(":", ""))) < 5);
    if (recentCheckIn) {
      setFeedback({ type: "info", message: "You're already checked in! Get to work." });
      setShowScanner(false);
      return;
    }

    setMembers(members.map((m) => m.id === me.id ? { ...m, checkIns: m.checkIns + 1, lastVisit: today() } : m));
    setCheckIns([{ id: `ci${Date.now()}`, memberId: me.id, memberName: me.name, date: today(), time: nowTime(), method: "QR" }, ...checkIns]);

    if (setLoyaltyPoints) {
      setLoyaltyPoints((lps) => {
        const entry = { id: `lph${Date.now()}`, date: today(), points: 5, reason: "Gym check-in" };
        const existing = lps.find((l) => l.memberId === me.id);
        if (existing) return lps.map((l) => l.memberId === me.id ? { ...l, points: l.points + 5, history: [entry, ...l.history] } : l);
        return [...lps, { memberId: me.id, points: 5, history: [entry] }];
      });
    }

    setFeedback({ type: "success", message: `Welcome back, ${me.name.split(" ")[0]}! That's visit #${me.checkIns + 1}. +5 loyalty points!` });
    setShowScanner(false);
  };

  if (showScanner) {
    return <MemberQRScanner onCheckIn={handleCheckIn} onClose={() => setShowScanner(false)} />;
  }

  return (
    <div className="space-y-6 max-w-xl">
      {feedback && (
        <div className={`p-4 rounded-xl border ${
          feedback.type === "success" ? "bg-red-950/40 border-red-800 text-red-300" :
          feedback.type === "error" ? "bg-rose-950/40 border-rose-800 text-rose-300" :
          "bg-sky-950/40 border-sky-800 text-sky-300"
        }`}>
          <div className="flex items-center gap-3">
            {feedback.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
            <p className="text-sm font-medium">{feedback.message}</p>
          </div>
        </div>
      )}

      <div className="bg-stone-900 rounded-2xl border border-stone-700 p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-stone-800 rounded-2xl flex items-center justify-center">
          <QrCode className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="font-display text-2xl font-semibold mb-2 text-white">Check in to the gym</h2>
        <p className="text-sm text-stone-400 mb-6 max-w-sm mx-auto">
          When you arrive at the gym, tap the button below and point your camera at the QR code displayed at the front desk.
        </p>
        <button onClick={() => setShowScanner(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
          <Camera className="w-4 h-4" /> Open camera
        </button>

        <div className="mt-8 pt-6 border-t border-stone-700 text-left">
          <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-3">How it works</div>
          <ol className="space-y-2 text-sm text-stone-400">
            <li className="flex gap-3">
              <span className="font-mono font-semibold text-stone-300 shrink-0">1.</span>
              <span>Open this app when you arrive at the gym.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono font-semibold text-stone-300 shrink-0">2.</span>
              <span>Tap "Open camera" above to launch the scanner.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono font-semibold text-stone-300 shrink-0">3.</span>
              <span>Point your camera at the QR poster at reception.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono font-semibold text-stone-300 shrink-0">4.</span>
              <span>You're checked in! Get to work.</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export function MemberBookClasses({ user, classes, setClasses, loyaltyPoints, setLoyaltyPoints, setNotifications }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNames = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };
  const [bookedFeedback, setBookedFeedback] = useState(null);

  const awardPoints = (reason) => {
    if (!setLoyaltyPoints || !user.memberId) return;
    setLoyaltyPoints((lps) => {
      const entry = { id: `lph${Date.now()}`, date: new Date().toISOString().slice(0, 10), points: 10, reason };
      const existing = lps.find((l) => l.memberId === user.memberId);
      if (existing) return lps.map((l) => l.memberId === user.memberId ? { ...l, points: l.points + 10, history: [entry, ...l.history] } : l);
      return [...lps, { memberId: user.memberId, points: 10, history: [entry] }];
    });
  };

  const toggleBooking = (cls) => {
    const isBooked = (cls.bookedMemberIds || []).includes(user.memberId);
    const onWaitlist = (cls.waitlist || []).some((w) => w.memberId === user.memberId);

    setClasses(classes.map((c) => {
      if (c.id !== cls.id) return c;
      if (isBooked) {
        const waitlist = c.waitlist || [];
        if (waitlist.length > 0) {
          const [next, ...rest] = waitlist;
          if (setNotifications) {
            setNotifications((ns) => [{
              id: `notif-wl-${Date.now()}`,
              userId: next.memberId,
              type: "class",
              title: `You're booked for ${c.name}!`,
              body: `A spot opened up in ${c.name} (${c.day} ${c.time}). You've been automatically booked in.`,
              timestamp: new Date().toISOString(),
              read: false,
            }, ...ns]);
          }
          return { ...c, bookedMemberIds: [...c.bookedMemberIds.filter((id) => id !== user.memberId), next.memberId], waitlist: rest };
        }
        return { ...c, booked: Math.max(0, c.booked - 1), bookedMemberIds: c.bookedMemberIds.filter((id) => id !== user.memberId) };
      }
      if (onWaitlist) {
        return { ...c, waitlist: (c.waitlist || []).filter((w) => w.memberId !== user.memberId) };
      }
      if (c.booked >= c.capacity) {
        setBookedFeedback({ id: c.id, type: "waitlist" });
        setTimeout(() => setBookedFeedback(null), 3000);
        return { ...c, waitlist: [...(c.waitlist || []), { memberId: user.memberId, memberName: user.name }] };
      }
      awardPoints(`Class booked: ${c.name}`);
      setBookedFeedback({ id: c.id, type: "booked" });
      setTimeout(() => setBookedFeedback(null), 3000);
      return { ...c, booked: c.booked + 1, bookedMemberIds: [...(c.bookedMemberIds || []), user.memberId] };
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-stone-800 border border-stone-700 rounded-xl p-4">
        <p className="text-sm text-stone-300">Tap a class to book or cancel. Full classes have a waitlist — join to be auto-booked when a spot opens. Booking earns <strong className="text-white">10 loyalty points</strong>.</p>
      </div>

      {days.map((day) => {
        const dayClasses = classes.filter((c) => c.day === day).sort((a, b) => a.time.localeCompare(b.time));
        if (dayClasses.length === 0) return null;
        return (
          <div key={day}>
            <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-2 px-1">{dayNames[day]}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {dayClasses.map((c) => {
                const isBooked = (c.bookedMemberIds || []).includes(user.memberId);
                const onWaitlist = (c.waitlist || []).some((w) => w.memberId === user.memberId);
                const full = c.booked >= c.capacity && !isBooked;
                const pct = Math.round((c.booked / c.capacity) * 100);
                const feedback = bookedFeedback?.id === c.id ? bookedFeedback.type : null;
                const waitlistCount = (c.waitlist || []).length;
                return (
                  <div key={c.id} className={`rounded-xl border p-4 transition ${
                    isBooked ? "border-red-600 bg-red-950/20" :
                    onWaitlist ? "border-amber-600 bg-amber-950/20" :
                    "border-stone-700 bg-stone-900"
                  }`}>
                    {feedback && (
                      <div className={`text-xs font-semibold mb-2 px-2 py-1 rounded-lg text-center ${feedback === "waitlist" ? "bg-amber-900/40 text-amber-300" : "bg-red-900/40 text-red-300"}`}>
                        {feedback === "waitlist" ? "Added to waitlist!" : "Booked! +10 pts"}
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-stone-100 truncate">{c.name}</div>
                        <div className="text-xs text-stone-400">{c.trainer}</div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <div className="text-xs font-mono font-semibold text-stone-300">{c.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 h-1 bg-stone-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pct >= 100 ? "bg-rose-500" : pct >= 90 ? "bg-orange-500" : "bg-red-500"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-stone-500">{c.booked}/{c.capacity}</span>
                    </div>
                    {waitlistCount > 0 && !isBooked && (
                      <div className="text-[10px] text-amber-500 font-mono mb-2">{waitlistCount} on waitlist</div>
                    )}
                    <button onClick={() => toggleBooking(c)}
                      className={`w-full py-2 text-xs font-semibold rounded-lg transition ${
                        isBooked ? "bg-stone-700 text-white hover:bg-stone-600" :
                        onWaitlist ? "bg-amber-600 text-white hover:bg-amber-700" :
                        full ? "bg-stone-700 text-stone-300 hover:bg-stone-600" :
                        "bg-red-600 text-white hover:bg-red-700"
                      }`}>
                      {isBooked ? "Cancel booking" : onWaitlist ? "Leave waitlist" : full ? "Join waitlist" : "Book spot"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function MemberHistory({ user, checkIns, classes }) {
  const myCheckIns = checkIns.filter((c) => c.memberId === user.memberId);
  const myClasses = classes.filter((c) => (c.bookedMemberIds || []).includes(user.memberId));
  const grouped = myCheckIns.reduce((acc, ci) => { (acc[ci.date] = acc[ci.date] || []).push(ci); return acc; }, {});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-stone-900 rounded-xl border border-stone-700 p-5">
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Gym visits</div>
          <div className="font-display text-3xl font-semibold mt-1 text-white">{myCheckIns.length}</div>
        </div>
        <div className="bg-stone-900 rounded-xl border border-stone-700 p-5">
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Classes booked</div>
          <div className="font-display text-3xl font-semibold mt-1 text-white">{myClasses.length}</div>
        </div>
      </div>

      <div className="bg-stone-900 rounded-xl border border-stone-700 p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold mb-5 text-white">Visit log</h3>
        {Object.keys(grouped).length === 0 ? (
          <EmptyState icon={UserCheck} title="No visits yet" subtitle="Scan the front-desk QR next time you're at the gym." />
        ) : (
          <div className="space-y-5">
            {Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([date, entries]) => (
              <div key={date}>
                <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-2">
                  {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                </div>
                {entries.map((ci) => (
                  <div key={ci.id} className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-red-900/40 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-red-400" /></div>
                    <div className="flex-1 text-sm text-stone-300">Checked in {ci.method && <span className="text-xs text-stone-500 font-mono ml-1">via {ci.method}</span>}</div>
                    <div className="text-sm font-mono text-stone-500">{ci.time}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================================================
// MEMBER SHOP
// ========================================================================
const SHOP_CATEGORIES = ["Fitness Accessories", "Daily Essentials"];

export function MemberShop({ user, shopOrders, setShopOrders, memberStocks, setMemberStocks }) {
  const [category, setCategory] = useState("Fitness Accessories");
  const [cart, setCart] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const products = seedShopProducts.filter((p) => p.category === category);

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeFromCart = (id) => setCart((c) => {
    const next = { ...c };
    if (next[id] <= 1) delete next[id]; else next[id]--;
    return next;
  });
  const clearCart = () => setCart({});

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const p = seedShopProducts.find((x) => x.id === id);
    return { ...p, qty };
  });
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const hasAccessories = cartItems.some((i) => i.category === "Fitness Accessories");
  const hasEssentials = cartItems.some((i) => i.category === "Daily Essentials");

  const confirmOrder = ({ paymentMethod, deliveryOption }) => {
    if (cartItems.length === 0) return;
    const order = {
      id: `ord${Date.now()}`,
      memberId: user.memberId,
      memberName: user.name,
      items: cartItems,
      total: cartTotal,
      date: today(),
      paymentMethod,
      deliveryOption: hasAccessories ? deliveryOption : "N/A",
      status: "confirmed",
    };
    setShopOrders([order, ...shopOrders]);

    if (hasEssentials) {
      const essentials = cartItems.filter((i) => i.category === "Daily Essentials");
      setMemberStocks((stocks) => {
        const existing = stocks.find((s) => s.memberId === user.memberId);
        if (existing) {
          return stocks.map((s) => {
            if (s.memberId !== user.memberId) return s;
            const updatedItems = [...s.items];
            essentials.forEach((e) => {
              const idx = updatedItems.findIndex((x) => x.productId === e.id);
              if (idx >= 0) updatedItems[idx] = { ...updatedItems[idx], qty: updatedItems[idx].qty + e.qty };
              else updatedItems.push({ productId: e.id, name: e.name, qty: e.qty, lastUpdated: today() });
            });
            return { ...s, items: updatedItems };
          });
        } else {
          return [...stocks, {
            memberId: user.memberId,
            memberName: user.name,
            items: essentials.map((e) => ({ productId: e.id, name: e.name, qty: e.qty, lastUpdated: today() })),
          }];
        }
      });
    }

    clearCart();
    setShowCheckout(false);
    setOrdered(true);
    setTimeout(() => setOrdered(false), 5000);
  };

  return (
    <div className="space-y-6">
      {ordered && (
        <div className="flex items-center gap-3 p-4 bg-red-950/40 border border-red-800 rounded-xl">
          <PackageCheck className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-red-300">Order placed!</div>
            <div className="text-xs text-stone-400">Collect and pay at the front desk.</div>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-2">
        {SHOP_CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              category === cat ? "bg-red-600 text-white" : "bg-stone-800 border border-stone-700 text-stone-300 hover:border-stone-500"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product grid */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {products.map((p) => {
            const qty = cart[p.id] || 0;
            return (
              <div key={p.id} className="bg-stone-900 rounded-xl border border-stone-700 p-4 flex flex-col gap-3">
                <div className="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-stone-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm leading-tight text-stone-100">{p.name}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{p.description}</div>
                  <div className="font-semibold text-sm mt-2 text-white">₦{p.price.toLocaleString()}</div>
                </div>
                {qty === 0 ? (
                  <button onClick={() => addToCart(p.id)}
                    className="w-full py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition">
                    Add
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <button onClick={() => removeFromCart(p.id)} className="w-8 h-8 bg-stone-700 text-stone-200 rounded-lg flex items-center justify-center hover:bg-stone-600 transition">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-semibold text-sm text-white">{qty}</span>
                    <button onClick={() => addToCart(p.id)} className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-700 transition">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cart */}
        <div className="bg-stone-900 rounded-xl border border-stone-700 p-5 h-fit sticky top-24">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-5 h-5 text-stone-400" />
            <h3 className="font-display text-lg font-semibold text-white">Cart</h3>
            {cartCount > 0 && (
              <span className="ml-auto text-xs bg-red-600 text-white rounded-full px-2 py-0.5 font-mono">{cartCount}</span>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-stone-500">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-stone-200 truncate">{item.name}</div>
                    <div className="text-xs text-stone-500">₦{item.price.toLocaleString()} × {item.qty}</div>
                  </div>
                  <div className="text-sm font-mono font-semibold text-stone-200 shrink-0">₦{(item.price * item.qty).toLocaleString()}</div>
                  <button onClick={() => removeFromCart(item.id)} className="text-stone-500 hover:text-rose-400 transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="pt-3 border-t border-stone-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-stone-200">Total</span>
                  <span className="font-display text-xl font-semibold text-white">₦{cartTotal.toLocaleString()}</span>
                </div>
                <button onClick={() => setShowCheckout(true)}
                  className="w-full py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
                  Checkout
                </button>
                {hasEssentials && <p className="text-[10px] text-stone-500 text-center mt-2">Daily essentials go to your personal stock</p>}
              </div>
            </div>
          )}
        </div>
      </div>
      {showCheckout && (
        <ShopCheckoutModal
          cartItems={cartItems}
          cartTotal={cartTotal}
          hasAccessories={hasAccessories}
          hasEssentials={hasEssentials}
          onConfirm={confirmOrder}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}

function ShopCheckoutModal({ cartItems, cartTotal, hasAccessories, hasEssentials, onConfirm, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [deliveryOption, setDeliveryOption] = useState("Pickup");

  return (
    <Modal title="Checkout" subtitle={`${cartItems.length} item${cartItems.length !== 1 ? "s" : ""} · ₦${cartTotal.toLocaleString()}`} onClose={onClose}>
      <div className="space-y-5">
        {/* Order summary */}
        <div className="bg-stone-800 rounded-lg p-3 space-y-1.5">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-stone-300">{item.qty}× {item.name}</span>
              <span className="font-mono font-medium text-stone-200">₦{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-stone-700 pt-2 flex justify-between font-semibold text-sm text-stone-100">
            <span>Total</span>
            <span>₦{cartTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment method */}
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-2 block">Payment method</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "Cash", label: "Cash", icon: DollarSign },
              { id: "Card", label: "Card", icon: CreditCard },
              { id: "Transfer", label: "Transfer", icon: CreditCard },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setPaymentMethod(id)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-lg border text-xs font-medium transition ${paymentMethod === id ? "bg-red-600 text-white border-red-600" : "bg-stone-800 border-stone-700 text-stone-300 hover:border-stone-500"}`}>
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Delivery option — only for fitness accessories */}
        {hasAccessories && (
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-2 block">Delivery option</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "Pickup", label: "Pickup at desk", icon: Store },
                { id: "Delivery", label: "Home delivery", icon: Truck },
              ].map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setDeliveryOption(id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition ${deliveryOption === id ? "bg-red-600 text-white border-red-600" : "bg-stone-800 border-stone-700 text-stone-300 hover:border-stone-500"}`}>
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stock note */}
        {hasEssentials && (
          <div className="flex items-start gap-2 p-3 bg-sky-950/40 border border-sky-800 rounded-lg text-xs text-sky-300">
            <Layers className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Daily essentials will be added to your personal stock. View and manage them in <strong>My Stock</strong>.</span>
          </div>
        )}

        <button onClick={() => onConfirm({ paymentMethod, deliveryOption })}
          className="w-full py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
          Confirm order · ₦{cartTotal.toLocaleString()}
        </button>
        <p className="text-[10px] text-stone-500 text-center -mt-3">
          {deliveryOption === "Delivery" ? "Pay on delivery" : "Pay at the front desk"}
        </p>
      </div>
    </Modal>
  );
}

// ========================================================================
// MEMBER STOCK — Personal daily essentials inventory
// ========================================================================
export function MemberStock({ user, memberStocks, setMemberStocks, onNavigate }) {
  const myStock = memberStocks.find((s) => s.memberId === user.memberId);
  const items = myStock?.items?.filter((i) => i.qty > 0) || [];

  const useItem = (productId) => {
    setMemberStocks((stocks) =>
      stocks.map((s) => {
        if (s.memberId !== user.memberId) return s;
        return {
          ...s,
          items: s.items.map((i) =>
            i.productId === productId ? { ...i, qty: Math.max(0, i.qty - 1), lastUpdated: today() } : i
          ),
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-stone-800 border border-stone-700 rounded-xl p-4 text-sm text-stone-300">
        Your personal stock of daily essentials. Tap <strong className="text-white">Use 1</strong> when you take an item at the gym.
        Running low? Head to the <button onClick={() => onNavigate("my-shop")} className="text-red-400 font-semibold underline">Shop</button> to reorder.
      </div>

      {items.length === 0 ? (
        <div className="bg-stone-900 rounded-xl border border-stone-700 p-12 text-center">
          <Layers className="w-10 h-10 mx-auto mb-3 text-stone-600" />
          <p className="font-medium text-stone-400">No stock yet</p>
          <p className="text-sm text-stone-500 mt-1 mb-4">Order daily essentials from the shop to build your stock.</p>
          <button onClick={() => onNavigate("my-shop")}
            className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition">
            Go to Shop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const low = item.qty <= 2;
            return (
              <div key={item.productId} className={`rounded-xl border p-5 ${low ? "border-amber-700 bg-amber-950/20" : "border-stone-700 bg-stone-900"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="font-medium text-sm text-stone-100">{item.name}</div>
                  {low && <span className="text-[10px] font-mono bg-amber-900/50 text-amber-300 px-2 py-0.5 rounded-full shrink-0">Low</span>}
                </div>
                <div className="font-display text-4xl font-semibold mb-1 text-white">{item.qty}</div>
                <div className="text-xs text-stone-500 mb-4">units remaining</div>
                <div className="flex gap-2">
                  <button onClick={() => useItem(item.productId)}
                    className="flex-1 py-2 bg-stone-700 text-white text-xs font-semibold rounded-lg hover:bg-stone-600 transition">
                    Use 1
                  </button>
                  <button onClick={() => onNavigate("my-shop")}
                    className="p-2 border border-stone-700 rounded-lg hover:border-stone-500 transition" title="Reorder">
                    <RefreshCw className="w-4 h-4 text-stone-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MemberPayments({ user, payments, members }) {
  const me = members.find((m) => m.id === user.memberId);
  const myPayments = payments.filter((p) => p.memberId === user.memberId).sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalPaid = myPayments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const outstanding = myPayments.filter((p) => p.status !== "paid").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-stone-900 rounded-xl border border-stone-700 p-5">
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Current plan</div>
          <div className="font-display text-2xl font-semibold mt-1 text-white">{me?.plan || "—"}</div>
          <div className="text-xs text-stone-500 mt-1 font-mono">₦{PLAN_PRICES[me?.plan]?.toLocaleString() || "—"}/mo</div>
        </div>
        <div className="bg-stone-900 rounded-xl border border-stone-700 p-5">
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Total paid</div>
          <div className="font-display text-2xl font-semibold mt-1 text-white">₦{(totalPaid / 1000).toFixed(0)}K</div>
          <div className="text-xs text-stone-500 mt-1">Lifetime</div>
        </div>
        <div className={`rounded-xl border p-5 ${outstanding > 0 ? "border-rose-800 bg-rose-950/30" : "border-stone-700 bg-stone-900"}`}>
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Outstanding</div>
          <div className={`font-display text-2xl font-semibold mt-1 ${outstanding > 0 ? "text-rose-400" : "text-white"}`}>₦{(outstanding / 1000).toFixed(0)}K</div>
          <div className="text-xs text-stone-500 mt-1">{outstanding > 0 ? "Pay at front desk" : "All clear"}</div>
        </div>
      </div>

      <div className="bg-stone-900 rounded-xl border border-stone-700 p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold mb-5 text-white">Payment history</h3>
        {myPayments.length === 0 ? <EmptyState title="No payments yet" /> : (
          <div className="space-y-2">
            {myPayments.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-stone-800 rounded-lg">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${p.status === "paid" ? "bg-red-900/40" : p.status === "overdue" ? "bg-rose-900/40" : "bg-amber-900/40"}`}>
                  <CheckCircle2 className={`w-4 h-4 ${p.status === "paid" ? "text-red-400" : p.status === "overdue" ? "text-rose-400" : "text-amber-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-stone-100">₦{p.amount.toLocaleString()}</div>
                  <div className="text-xs text-stone-500">{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {p.method}</div>
                </div>
                <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded-full ${p.status === "paid" ? "bg-red-900/40 text-red-300" : p.status === "overdue" ? "bg-rose-900/40 text-rose-300" : "bg-amber-900/40 text-amber-300"}`}>{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Member Friends / Social ───────────────────────────────────────────────────
export function MemberFriendsView({ user, members, setMembers }) {
  const [tab, setTab] = useState("discover");
  const [search, setSearch] = useState("");
  const me = members.find((m) => m.id === user.memberId);
  const myFollowing = me?.following || [];
  const myFollowers = members.filter((m) => m.id !== user.memberId && (m.following || []).includes(user.memberId));

  const toggleFollow = (targetId) => {
    setMembers((prev) => prev.map((m) => {
      if (m.id !== user.memberId) return m;
      const following = m.following || [];
      return {
        ...m,
        following: following.includes(targetId)
          ? following.filter((id) => id !== targetId)
          : [...following, targetId],
      };
    }));
  };

  const others = members.filter((m) => m.id !== user.memberId);
  const pool = tab === "following"
    ? others.filter((m) => myFollowing.includes(m.id))
    : tab === "followers"
    ? myFollowers
    : others.filter((m) => m.status === "active");

  const visible = search
    ? pool.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    : pool;

  const followersOf = (memberId) => members.filter((m) => (m.following || []).includes(memberId)).length;

  return (
    <div className="space-y-4 max-w-lg">
      <div className="flex gap-1 bg-stone-800 p-1 rounded-lg">
        {[
          { id: "discover",  label: "Discover" },
          { id: "following", label: `Following · ${myFollowing.length}` },
          { id: "followers", label: `Followers · ${myFollowers.length}` },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${tab === t.id ? "bg-stone-950 text-white shadow-sm" : "text-stone-400 hover:text-white"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members…"
          className="w-full pl-10 pr-4 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-base sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500"
        />
      </div>

      <div className="space-y-2">
        {visible.map((m) => {
          const isFollowing = myFollowing.includes(m.id);
          const isMutual = isFollowing && (m.following || []).includes(user.memberId);
          const followerCount = followersOf(m.id);
          return (
            <div key={m.id} className="flex items-center gap-3 bg-stone-900 border border-stone-700 rounded-xl p-4">
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${m.avatarColor || "from-stone-700 to-stone-600"} flex items-center justify-center font-semibold text-stone-200 shrink-0 overflow-hidden`}>
                {m.avatarImage
                  ? <img src={m.avatarImage} className="w-full h-full object-cover" alt="" />
                  : m.avatarEmoji
                    ? <span className="text-xl leading-none">{m.avatarEmoji}</span>
                    : <span>{m.name[0]}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <div className="font-medium text-sm text-stone-200 truncate">{m.name}</div>
                  {isMutual && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-red-900/30 text-red-300 border border-red-800/50 shrink-0">Friends</span>
                  )}
                  {!isMutual && (m.following || []).includes(user.memberId) && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-stone-700/60 text-stone-400 border border-stone-600/50 shrink-0">Follows you</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${planBadge(m.plan)}`}>{m.plan.toUpperCase()}</span>
                  <span className="text-xs text-stone-500">{m.checkIns} visits</span>
                  {followerCount > 0 && <span className="text-xs text-stone-500">{followerCount} follower{followerCount !== 1 ? "s" : ""}</span>}
                </div>
              </div>
              <button
                onClick={() => toggleFollow(m.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                  isFollowing
                    ? "bg-stone-800 border-stone-700 text-stone-400 hover:border-rose-700 hover:text-rose-300"
                    : "bg-red-600/20 border-red-600/50 text-red-400 hover:bg-red-600/30"
                }`}
              >
                {isFollowing
                  ? <><UserMinus className="w-3.5 h-3.5" /> Unfollow</>
                  : <><UserPlus className="w-3.5 h-3.5" /> Follow</>}
              </button>
            </div>
          );
        })}
        {visible.length === 0 && (
          <div className="py-12 text-center text-stone-500">
            <Users className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <div className="text-sm">{tab === "following" ? "You're not following anyone yet" : tab === "followers" ? "No one is following you yet" : "No members found"}</div>
          </div>
        )}
      </div>
    </div>
  );
}