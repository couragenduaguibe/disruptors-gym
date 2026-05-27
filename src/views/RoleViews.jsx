import React, { useState } from "react";
import {
  Users, CalendarDays, Activity, Flame, CheckCircle2, AlertTriangle,
  Calendar, Award, UserCheck, QrCode, Camera,
} from "lucide-react";
import { StatCard, EmptyState } from "../components/ui";
import { planBadge, today, nowTime } from "../utils/storage";
import { PLAN_PRICES } from "../data/seed";
import { MemberQRScanner } from "../components/QRScanner";

// ========================================================================
// TRAINER VIEWS
// ========================================================================
export function TrainerHome({ user, classes, members }) {
  const myClasses = classes.filter((c) => c.trainerId === user.trainerId);
  const myClients = members.filter((m) => m.trainerId === user.trainerId);
  const totalBooked = myClasses.reduce((s, c) => s + c.booked, 0);
  const totalCapacity = myClasses.reduce((s, c) => s + c.capacity, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard className="fade-up stagger-1" label="Active clients" value={myClients.length} icon={Users} accent="bg-lime-100 text-lime-900" />
        <StatCard className="fade-up stagger-2" label="Weekly classes" value={myClasses.length} icon={CalendarDays} accent="bg-sky-100 text-sky-900" />
        <StatCard className="fade-up stagger-3" label="Total bookings" value={totalBooked} icon={Activity} accent="bg-amber-100 text-amber-900" />
        <StatCard className="fade-up stagger-4" label="Capacity used" value={`${Math.round((totalBooked / Math.max(1, totalCapacity)) * 100)}%`} icon={Flame} accent="bg-rose-100 text-rose-900" />
      </div>

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

      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold mb-5">This week's schedule</h3>
        {myClasses.length === 0 ? <EmptyState icon={CalendarDays} title="No classes scheduled" /> : (
          <div className="space-y-3">
            {myClasses.sort((a, b) => {
              const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
              return days.indexOf(a.day) - days.indexOf(b.day) || a.time.localeCompare(b.time);
            }).map((c) => {
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
                      <div className={`h-full rounded-full ${pct >= 90 ? "bg-rose-500" : "bg-lime-500"}`} style={{ width: `${pct}%` }} />
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
          <div key={day} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-4">
              {day} · <span className="text-stone-400">{dayClasses.length} class{dayClasses.length !== 1 ? "es" : ""}</span>
            </div>
            <div className="space-y-4">
              {dayClasses.map((c) => {
                const attendees = (c.bookedMemberIds || []).map((id) => members.find((m) => m.id === id)).filter(Boolean);
                const pct = Math.round((c.booked / c.capacity) * 100);
                return (
                  <div key={c.id} className="border border-stone-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-xs text-stone-500 font-mono mt-0.5">{c.time}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono text-stone-500">{c.booked}/{c.capacity}</div>
                        <div className="w-20 h-1 bg-stone-100 rounded-full mt-1 overflow-hidden">
                          <div className={`h-full rounded-full ${pct >= 90 ? "bg-rose-500" : "bg-lime-500"}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                    {attendees.length > 0 && (
                      <div className="pt-3 border-t border-stone-100">
                        <div className="text-[10px] font-mono tracking-wider text-stone-500 uppercase mb-2">Booked attendees</div>
                        <div className="flex flex-wrap gap-1.5">
                          {attendees.map((a) => (
                            <span key={a.id} className="inline-flex items-center gap-1.5 text-xs bg-stone-50 px-2 py-1 rounded-full">
                              <span className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-semibold">{a.name[0]}</span>
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
          className={`bg-white rounded-xl border border-stone-200 p-5 text-left hover:border-stone-900 transition fade-up stagger-${(i % 4) + 1}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center font-semibold text-stone-700">{m.name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{m.name}</div>
              <span className={`text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full ${planBadge(m.plan)}`}>{m.plan.toUpperCase()}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="font-mono text-stone-500 tracking-wider uppercase">Visits</div>
              <div className="font-semibold text-base mt-0.5">{m.checkIns}</div>
            </div>
            <div>
              <div className="font-mono text-stone-500 tracking-wider uppercase">Status</div>
              <div className={`font-semibold text-base mt-0.5 ${m.status === "active" ? "text-lime-700" : "text-rose-700"}`}>
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
export function MemberHome({ user, members, classes, payments, checkIns, onNavigate }) {
  const me = members.find((m) => m.id === user.memberId);
  if (!me) return <div className="text-stone-500">Member record not found.</div>;

  const myClasses = classes.filter((c) => (c.bookedMemberIds || []).includes(me.id));
  const myCheckIns = checkIns.filter((c) => c.memberId === me.id);
  const myPayments = payments.filter((p) => p.memberId === me.id);
  const daysToExpiry = Math.ceil((new Date(me.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
  const overdue = myPayments.find((p) => p.status === "overdue");

  return (
    <div className="space-y-6">
      {overdue && (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-700" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">Overdue payment</div>
            <div className="text-xs text-rose-700">₦{overdue.amount.toLocaleString()} — please contact the front desk</div>
          </div>
        </div>
      )}

      {/* Big check-in CTA */}
      <button onClick={() => onNavigate("my-qr")}
        className="w-full bg-lime-400 text-stone-900 rounded-2xl p-6 sm:p-8 flex items-center gap-5 hover:bg-lime-500 transition group">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-900 rounded-2xl flex items-center justify-center shrink-0">
          <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-lime-400" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="font-display text-2xl sm:text-3xl font-semibold leading-tight">Check in</div>
          <div className="text-sm sm:text-base text-stone-800/80 mt-1">Tap to scan the QR at the front desk</div>
        </div>
      </button>

      <div className="relative overflow-hidden rounded-2xl bg-stone-900 text-white p-6 sm:p-8 fade-up">
        <div className="absolute inset-0 noise-bg opacity-30 pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-lime-400/20 blur-3xl" />
        <div className="relative z-10 max-w-xl">
          <div className="text-xs font-mono tracking-widest text-lime-400 uppercase mb-3">{me.plan.toUpperCase()} MEMBER</div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mb-3">
            {me.checkIns} workouts and counting.
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            Membership valid for another {daysToExpiry > 0 ? daysToExpiry : 0} days. Keep showing up.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard className="fade-up stagger-1" label="Total visits" value={me.checkIns} icon={Activity} accent="bg-lime-100 text-lime-900" />
        <StatCard className="fade-up stagger-2" label="Classes booked" value={myClasses.length} icon={CalendarDays} accent="bg-sky-100 text-sky-900" />
        <StatCard className="fade-up stagger-3" label="Plan" value={me.plan} icon={Award} accent="bg-amber-100 text-amber-900" />
        <StatCard className="fade-up stagger-4" label="Days left" value={daysToExpiry >= 0 ? daysToExpiry : 0} icon={Calendar} accent={daysToExpiry < 14 ? "bg-rose-100 text-rose-900" : "bg-stone-100 text-stone-700"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl font-semibold">My upcoming classes</h3>
            <button onClick={() => onNavigate("book-classes")} className="text-xs font-medium text-stone-900 hover:underline">Book more</button>
          </div>
          {myClasses.length === 0 ? <EmptyState icon={CalendarDays} title="No classes booked yet" /> : (
            <div className="space-y-3">
              {myClasses.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-stone-100 flex flex-col items-center justify-center shrink-0">
                    <div className="text-[10px] font-mono text-stone-500">{c.day.toUpperCase()}</div>
                    <div className="text-xs font-semibold">{c.time}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{c.name}</div>
                    <div className="text-xs text-stone-500 truncate">with {c.trainer}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6">
          <h3 className="font-display text-xl font-semibold mb-5">Recent visits</h3>
          {myCheckIns.length === 0 ? <EmptyState icon={UserCheck} title="No visits logged yet" /> : (
            <div className="space-y-1">
              {myCheckIns.slice(0, 5).map((ci) => (
                <div key={ci.id} className="flex items-center gap-3 py-2">
                  <div className="w-7 h-7 rounded-full bg-lime-100 flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-lime-700" /></div>
                  <div className="flex-1 text-sm">{new Date(ci.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
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
export function MemberQRView({ user, members, setMembers, checkIns, setCheckIns, onNavigate }) {
  const [showScanner, setShowScanner] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const me = members.find((m) => m.id === user.memberId);

  const handleCheckIn = (locationId) => {
    if (!me) return;
    if (me.status !== "active") {
      setFeedback({ type: "error", message: "Your membership is expired. Please renew at the front desk." });
      setShowScanner(false);
      return;
    }

    // Prevent double check-in within the same minute
    const recentCheckIn = checkIns.find((c) => c.memberId === me.id && c.date === today() && Math.abs(parseInt(c.time.replace(":", "")) - parseInt(nowTime().replace(":", ""))) < 5);
    if (recentCheckIn) {
      setFeedback({ type: "info", message: "You're already checked in! Get to work." });
      setShowScanner(false);
      return;
    }

    setMembers(members.map((m) => m.id === me.id ? { ...m, checkIns: m.checkIns + 1, lastVisit: today() } : m));
    setCheckIns([{ id: `ci${Date.now()}`, memberId: me.id, memberName: me.name, date: today(), time: nowTime(), method: "QR" }, ...checkIns]);
    setFeedback({ type: "success", message: `Welcome back, ${me.name.split(" ")[0]}! That's visit #${me.checkIns + 1}.` });
    setShowScanner(false);
  };

  if (showScanner) {
    return <MemberQRScanner onCheckIn={handleCheckIn} onClose={() => setShowScanner(false)} />;
  }

  return (
    <div className="space-y-6 max-w-xl">
      {feedback && (
        <div className={`p-4 rounded-xl border ${
          feedback.type === "success" ? "bg-lime-50 border-lime-200 text-lime-900" :
          feedback.type === "error" ? "bg-rose-50 border-rose-200 text-rose-900" :
          "bg-sky-50 border-sky-200 text-sky-900"
        }`}>
          <div className="flex items-center gap-3">
            {feedback.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
            <p className="text-sm font-medium">{feedback.message}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-stone-900 rounded-2xl flex items-center justify-center">
          <QrCode className="w-10 h-10 text-lime-400" />
        </div>
        <h2 className="font-display text-2xl font-semibold mb-2">Check in to the gym</h2>
        <p className="text-sm text-stone-600 mb-6 max-w-sm mx-auto">
          When you arrive at the gym, tap the button below and point your camera at the QR code displayed at the front desk.
        </p>
        <button onClick={() => setShowScanner(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-lime-400 text-stone-900 rounded-lg text-sm font-semibold hover:bg-lime-500 transition">
          <Camera className="w-4 h-4" /> Open camera
        </button>

        <div className="mt-8 pt-6 border-t border-stone-200 text-left">
          <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-3">How it works</div>
          <ol className="space-y-2 text-sm text-stone-600">
            <li className="flex gap-3">
              <span className="font-mono font-semibold text-stone-900 shrink-0">1.</span>
              <span>Open this app when you arrive at the gym.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono font-semibold text-stone-900 shrink-0">2.</span>
              <span>Tap "Open camera" above to launch the scanner.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono font-semibold text-stone-900 shrink-0">3.</span>
              <span>Point your camera at the QR poster at reception.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono font-semibold text-stone-900 shrink-0">4.</span>
              <span>You're checked in! Get to work.</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export function MemberBookClasses({ user, classes, setClasses }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNames = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };

  const toggleBooking = (cls) => {
    const isBooked = (cls.bookedMemberIds || []).includes(user.memberId);
    setClasses(classes.map((c) => {
      if (c.id !== cls.id) return c;
      if (isBooked) return { ...c, booked: Math.max(0, c.booked - 1), bookedMemberIds: c.bookedMemberIds.filter((id) => id !== user.memberId) };
      if (c.booked >= c.capacity) return c;
      return { ...c, booked: c.booked + 1, bookedMemberIds: [...(c.bookedMemberIds || []), user.memberId] };
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-stone-100 border border-stone-200 rounded-xl p-4">
        <p className="text-sm text-stone-700">Tap a class to book or cancel your spot.</p>
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
                const full = c.booked >= c.capacity && !isBooked;
                const pct = Math.round((c.booked / c.capacity) * 100);
                return (
                  <div key={c.id} className={`bg-white border rounded-xl p-4 transition ${isBooked ? "border-lime-500 bg-lime-50" : "border-stone-200"}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{c.name}</div>
                        <div className="text-xs text-stone-500">{c.trainer}</div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <div className="text-xs font-mono font-semibold">{c.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 h-1 bg-stone-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pct >= 90 ? "bg-rose-500" : "bg-lime-500"}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-stone-500">{c.booked}/{c.capacity}</span>
                    </div>
                    <button onClick={() => toggleBooking(c)} disabled={full}
                      className={`w-full py-2 text-xs font-semibold rounded-lg transition ${
                        isBooked ? "bg-stone-900 text-white hover:bg-stone-800" :
                        full ? "bg-stone-100 text-stone-400 cursor-not-allowed" :
                        "bg-lime-400 text-stone-900 hover:bg-lime-500"
                      }`}>
                      {isBooked ? "Cancel booking" : full ? "Class full" : "Book spot"}
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
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Gym visits</div>
          <div className="font-display text-3xl font-semibold mt-1">{myCheckIns.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Classes booked</div>
          <div className="font-display text-3xl font-semibold mt-1">{myClasses.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold mb-5">Visit log</h3>
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
                    <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-lime-700" /></div>
                    <div className="flex-1 text-sm">Checked in {ci.method && <span className="text-xs text-stone-500 font-mono ml-1">via {ci.method}</span>}</div>
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

export function MemberPayments({ user, payments, members }) {
  const me = members.find((m) => m.id === user.memberId);
  const myPayments = payments.filter((p) => p.memberId === user.memberId).sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalPaid = myPayments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const outstanding = myPayments.filter((p) => p.status !== "paid").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Current plan</div>
          <div className="font-display text-2xl font-semibold mt-1">{me?.plan || "—"}</div>
          <div className="text-xs text-stone-500 mt-1 font-mono">₦{PLAN_PRICES[me?.plan]?.toLocaleString() || "—"}/mo</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Total paid</div>
          <div className="font-display text-2xl font-semibold mt-1">₦{(totalPaid / 1000).toFixed(0)}K</div>
          <div className="text-xs text-stone-500 mt-1">Lifetime</div>
        </div>
        <div className={`bg-white rounded-xl border p-5 ${outstanding > 0 ? "border-rose-200 bg-rose-50" : "border-stone-200"}`}>
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Outstanding</div>
          <div className={`font-display text-2xl font-semibold mt-1 ${outstanding > 0 ? "text-rose-700" : ""}`}>₦{(outstanding / 1000).toFixed(0)}K</div>
          <div className="text-xs text-stone-500 mt-1">{outstanding > 0 ? "Pay at front desk" : "All clear"}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold mb-5">Payment history</h3>
        {myPayments.length === 0 ? <EmptyState title="No payments yet" /> : (
          <div className="space-y-2">
            {myPayments.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${p.status === "paid" ? "bg-lime-100" : p.status === "overdue" ? "bg-rose-100" : "bg-amber-100"}`}>
                  <CheckCircle2 className={`w-4 h-4 ${p.status === "paid" ? "text-lime-700" : p.status === "overdue" ? "text-rose-700" : "text-amber-700"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">₦{p.amount.toLocaleString()}</div>
                  <div className="text-xs text-stone-500">{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {p.method}</div>
                </div>
                <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-1 rounded-full ${p.status === "paid" ? "bg-lime-100 text-lime-800" : p.status === "overdue" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
