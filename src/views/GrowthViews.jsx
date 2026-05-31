import React, { useState } from "react";
import { Gift, Copy, Check, Trophy, Plus, Users } from "lucide-react";
import { EmptyState, Modal } from "../components/ui";
import { today } from "../utils/storage";
import { BADGE_DEFS, computeStreak } from "./NewMemberFeatures";

// ======================================================================
// LOYALTY & REWARDS
// ======================================================================
const TIERS = [
  { name: "Bronze", min: 0, max: 499, gradient: "from-amber-700 to-amber-500", text: "text-amber-300", bg: "bg-amber-950/30 border-amber-700" },
  { name: "Silver", min: 500, max: 999, gradient: "from-stone-600 to-stone-400", text: "text-stone-300", bg: "bg-stone-800 border-stone-600" },
  { name: "Gold", min: 1000, max: Infinity, gradient: "from-yellow-700 to-yellow-500", text: "text-yellow-300", bg: "bg-yellow-950/30 border-yellow-700" },
];

const HOW_TO_EARN = [
  { action: "Gym check-in", points: 5, icon: "🏋️" },
  { action: "Attend a class", points: 10, icon: "📅" },
  { action: "Refer a friend who joins", points: 50, icon: "👥" },
  { action: "Log a workout session", points: 2, icon: "💪" },
];

export function LoyaltyRewardsView({ user, loyaltyPoints, checkIns = [], workoutLogs = [], classes = [], members = [] }) {
  const myLoyalty = loyaltyPoints.find((l) => l.memberId === user.memberId) || { points: 0, history: [] };
  const pts = myLoyalty.points;
  const tier = TIERS.find((t) => pts >= t.min && pts <= t.max) || TIERS[0];
  const nextTier = TIERS.find((t) => t.min > pts);
  const progress = nextTier ? Math.round(((pts - tier.min) / (nextTier.min - tier.min)) * 100) : 100;

  const myCheckIns = checkIns.filter((c) => c.memberId === user.memberId);
  const myWorkouts = workoutLogs.filter((l) => l.memberId === user.memberId);
  const myClasses = classes.filter((c) => (c.bookedMemberIds || []).includes(user.memberId));
  const streak = computeStreak(checkIns, workoutLogs, user.memberId);
  const me = members.find((m) => m.id === user.memberId);
  const referrals = members.filter((m) => m.referredBy === user.memberId).length;

  const badgeStats = {
    totalCheckIns: myCheckIns.length,
    totalWorkouts: myWorkouts.length,
    totalClasses: myClasses.length,
    streak,
    referrals,
  };
  const badges = BADGE_DEFS.map((b) => ({ ...b, earned: b.check(badgeStats) }));
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${tier.gradient} text-white p-6 sm:p-8`}>
        <div className="absolute -right-12 -top-12 w-52 h-52 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-black/20 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="text-xs font-mono tracking-widest uppercase opacity-80 mb-2">{tier.name} Tier · Disruptors Rewards</div>
          <div className="font-display text-5xl sm:text-6xl font-semibold mb-1">{pts.toLocaleString()}</div>
          <div className="text-white/80 text-sm mb-4">loyalty points</div>
          {nextTier ? (
            <div>
              <div className="text-xs text-white/70 mb-1.5">{(nextTier.min - pts).toLocaleString()} more points to reach {nextTier.name}</div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <div className="text-xs opacity-80">🏆 You've reached the highest tier — Gold status!</div>
          )}
        </div>
      </div>

      {/* Tier overview */}
      <div className="grid grid-cols-3 gap-3">
        {TIERS.map((t) => (
          <div key={t.name} className={`rounded-xl border p-3 text-center transition ${t.name === tier.name ? t.bg : "bg-stone-900 border-stone-700 opacity-50"}`}>
            <div className={`text-sm font-semibold ${t.name === tier.name ? t.text : "text-stone-400"}`}>{t.name}</div>
            <div className="text-xs text-stone-500 mt-0.5">{t.min === 0 ? "0" : t.min.toLocaleString()}{t.max === Infinity ? "+" : `–${t.max.toLocaleString()}`} pts</div>
          </div>
        ))}
      </div>

      {/* How to earn */}
      <div className="bg-stone-900 rounded-xl border border-stone-700 p-5">
        <h3 className="font-display text-lg font-semibold mb-4 text-white">How to earn points</h3>
        <div className="space-y-3">
          {HOW_TO_EARN.map((h) => (
            <div key={h.action} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <span className="text-xl w-7 text-center">{h.icon}</span>
                <span className="text-sm text-stone-300">{h.action}</span>
              </div>
              <span className="text-sm font-semibold font-mono text-red-400">+{h.points} pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-stone-900 rounded-xl border border-stone-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-white">Badges</h3>
          <span className="text-xs font-mono text-stone-400">{earnedCount}/{badges.length} earned</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {badges.map((b) => (
            <div key={b.id} className={`flex flex-col items-center text-center p-3 rounded-xl border transition ${b.earned ? "bg-stone-800 border-stone-600" : "bg-stone-900 border-stone-800 opacity-40 grayscale"}`}>
              <span className="text-3xl mb-1.5 leading-none">{b.emoji}</span>
              <div className={`text-[9px] font-semibold leading-tight ${b.earned ? "text-stone-200" : "text-stone-500"}`}>{b.label}</div>
              {b.earned && <div className="text-[9px] font-mono text-red-400 uppercase tracking-wider mt-0.5">Earned</div>}
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="bg-stone-900 rounded-xl border border-stone-700 p-5">
        <h3 className="font-display text-lg font-semibold mb-4 text-white">Points history</h3>
        {myLoyalty.history.length === 0 ? (
          <EmptyState icon={Gift} title="No points yet" subtitle="Check in and attend classes to start earning!" />
        ) : (
          <div className="space-y-1">
            {myLoyalty.history.map((h) => (
              <div key={h.id} className="flex items-center justify-between py-2.5 border-b border-stone-800 last:border-0">
                <div>
                  <div className="text-sm font-medium text-stone-200">{h.reason}</div>
                  <div className="text-xs font-mono text-stone-500">{new Date(h.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </div>
                <span className="text-sm font-semibold font-mono text-red-400">+{h.points}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ======================================================================
// REFERRALS
// ======================================================================
export function ReferralView({ user, members }) {
  const me = members.find((m) => m.id === user.memberId);
  const referralCode = me?.referralCode || `DIS-${(user.memberId || "MBR").toUpperCase()}`;
  const [copied, setCopied] = useState(false);
  const referredMembers = members.filter((m) => m.referredBy === user.memberId);
  const pointsEarned = referredMembers.length * 50;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-stone-700">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-red-500/20 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="text-xs font-mono tracking-widest text-red-400 uppercase mb-3">Your referral code</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="font-display text-3xl sm:text-4xl font-semibold tracking-widest">{referralCode}</div>
            <button onClick={handleCopy} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition">
              {copied ? <Check className="w-4 h-4 text-red-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {copied && <div className="text-xs text-red-400 font-mono mb-2">Copied to clipboard!</div>}
          <p className="text-stone-300 text-sm max-w-sm">
            Share this code with friends. When they join and give your code at reception, you <strong className="text-white">both earn 50 loyalty points</strong>.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-stone-900 rounded-xl border border-stone-700 p-5">
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Friends referred</div>
          <div className="font-display text-4xl font-semibold mt-1 text-white">{referredMembers.length}</div>
        </div>
        <div className="bg-stone-900 rounded-xl border border-stone-700 p-5">
          <div className="text-xs font-mono text-stone-500 tracking-wider uppercase">Points earned</div>
          <div className="font-display text-4xl font-semibold mt-1 text-red-400">{pointsEarned}</div>
        </div>
      </div>

      {/* Referred list */}
      <div className="bg-stone-900 rounded-xl border border-stone-700 p-5">
        <h3 className="font-display text-lg font-semibold mb-4 text-white">Friends you've referred</h3>
        {referredMembers.length === 0 ? (
          <EmptyState icon={Users} title="No referrals yet" subtitle="Share your code and earn 50 points for every new member who joins!" />
        ) : (
          <div className="space-y-3">
            {referredMembers.map((m) => (
              <div key={m.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center font-semibold text-white text-sm shrink-0">
                  {m.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-stone-200">{m.name}</div>
                  <div className="text-xs text-stone-500">Joined {new Date(m.joinDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" })} · {m.plan}</div>
                </div>
                <span className="text-xs font-mono text-red-400 font-semibold shrink-0">+50 pts</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="bg-stone-800 border border-stone-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-3 text-stone-200">How it works</h3>
        <ol className="space-y-2 text-sm text-stone-400">
          <li className="flex gap-3"><span className="font-mono font-bold text-stone-300 shrink-0">1.</span>Share your code with a friend who isn't yet a member.</li>
          <li className="flex gap-3"><span className="font-mono font-bold text-stone-300 shrink-0">2.</span>They give your code to staff when they sign up at the gym.</li>
          <li className="flex gap-3"><span className="font-mono font-bold text-stone-300 shrink-0">3.</span>You both receive <strong className="text-stone-200">50 loyalty points</strong> instantly!</li>
        </ol>
      </div>
    </div>
  );
}

// ======================================================================
// GROUP CHALLENGES
// ======================================================================
export function ChallengesView({ user, challenges, setChallenges, members, checkIns, classes }) {
  const [showForm, setShowForm] = useState(false);
  const canCreate = user.role === "admin";
  const active = challenges.filter((c) => c.active);

  const getLeaderboard = (challenge) => {
    if (challenge.type === "checkins") {
      const counts = {};
      checkIns.filter((c) => c.date && c.date.startsWith(challenge.period)).forEach((c) => {
        counts[c.memberId] = (counts[c.memberId] || 0) + 1;
      });
      return members.filter((m) => counts[m.id]).map((m) => ({ ...m, score: counts[m.id] })).sort((a, b) => b.score - a.score).slice(0, 8);
    }
    if (challenge.type === "classes") {
      const counts = {};
      classes.forEach((c) => (c.bookedMemberIds || []).forEach((id) => { counts[id] = (counts[id] || 0) + 1; }));
      return members.filter((m) => counts[m.id]).map((m) => ({ ...m, score: counts[m.id] })).sort((a, b) => b.score - a.score).slice(0, 8);
    }
    return [];
  };

  const myId = user.memberId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-400">Compete, earn prizes, and push each other.</p>
        {canCreate && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
            <Plus className="w-4 h-4" /> New challenge
          </button>
        )}
      </div>

      {active.length === 0 ? (
        <EmptyState icon={Trophy} title="No active challenges" subtitle={canCreate ? "Create a challenge to motivate your members!" : "Check back soon for new challenges."} />
      ) : (
        <div className="space-y-6">
          {active.map((challenge) => {
            const leaderboard = getLeaderboard(challenge);
            const myRank = leaderboard.findIndex((m) => m.id === myId);
            return (
              <div key={challenge.id} className="bg-stone-900 rounded-2xl border border-stone-700 overflow-hidden">
                <div className="bg-gradient-to-r from-stone-950 to-stone-900 text-white p-5 sm:p-6 border-b border-stone-700">
                  <div className="flex items-start gap-4">
                    <Trophy className="w-7 h-7 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-xl font-semibold">{challenge.name}</div>
                      <div className="text-stone-300 text-sm mt-1">{challenge.description}</div>
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/30 rounded-full px-3 py-1">
                          <Gift className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs text-amber-300 font-medium">{challenge.prize}</span>
                        </div>
                        <div className="text-xs text-stone-500 font-mono">{challenge.period}</div>
                      </div>
                    </div>
                  </div>
                  {myRank >= 0 && (
                    <div className="mt-4 bg-white/10 rounded-lg px-4 py-2.5 inline-flex items-center gap-2">
                      <span className="text-sm font-semibold">Your rank: #{myRank + 1}</span>
                      <span className="text-stone-300 text-sm">· {leaderboard[myRank].score} {challenge.type === "checkins" ? "check-ins" : "classes"}</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-3">Leaderboard</div>
                  {leaderboard.length === 0 ? (
                    <p className="text-sm text-stone-500 text-center py-6">No entries yet — be the first!</p>
                  ) : (
                    <div className="space-y-2">
                      {leaderboard.map((m, i) => {
                        const isMe = m.id === myId;
                        return (
                          <div key={m.id} className={`flex items-center gap-3 p-2.5 rounded-lg ${isMe ? "bg-red-950/30 border border-red-800" : i === 0 ? "bg-amber-950/20 border border-amber-800/50" : "bg-stone-800"}`}>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                              i === 0 ? "bg-amber-500 text-amber-950" :
                              i === 1 ? "bg-stone-500 text-stone-100" :
                              i === 2 ? "bg-amber-800/60 text-amber-300" :
                              "bg-stone-700 text-stone-400"
                            }`}>{i + 1}</div>
                            <div className="flex-1 text-sm font-medium text-stone-200">{m.name}{isMe && <span className="ml-1.5 text-[10px] font-mono text-red-400 uppercase tracking-wider">You</span>}</div>
                            <div className="text-sm font-mono font-semibold text-stone-200 shrink-0">{m.score}</div>
                            <div className="text-xs text-stone-500 shrink-0">{challenge.type === "checkins" ? "check-ins" : "classes"}</div>
                            {i === 0 && <Trophy className="w-4 h-4 text-amber-400 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <ChallengeForm
          onSave={(ch) => { setChallenges((chs) => [...chs, ch]); setShowForm(false); }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function ChallengeForm({ onSave, onClose }) {
  const [form, setForm] = useState({ name: "", description: "", type: "checkins", period: today().slice(0, 7), prize: "" });
  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  return (
    <Modal title="New Challenge" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Challenge name</label>
          <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. June Check-in King"
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Description</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe what members need to do..."
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500 resize-none" rows={2} />
        </div>
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Prize</label>
          <input type="text" value={form.prize} onChange={(e) => set("prize", e.target.value)} placeholder="e.g. 1 month free membership"
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Metric</label>
          <div className="grid grid-cols-2 gap-2">
            {[{ id: "checkins", label: "Most check-ins" }, { id: "classes", label: "Most classes attended" }].map((t) => (
              <button key={t.id} onClick={() => set("type", t.id)}
                className={`py-2.5 rounded-lg border text-sm font-medium transition ${form.type === t.id ? "bg-red-600 text-white border-red-600" : "bg-stone-800 border-stone-700 text-stone-300 hover:border-stone-500"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Month</label>
          <input type="month" value={form.period} onChange={(e) => set("period", e.target.value)}
            className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500" />
        </div>
        <button onClick={() => { if (!form.name || !form.prize) return; onSave({ id: `ch${Date.now()}`, ...form, active: true, createdBy: "admin" }); }}
          className="w-full py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
          Create challenge
        </button>
      </div>
    </Modal>
  );
}
