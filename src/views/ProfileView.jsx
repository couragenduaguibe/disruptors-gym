import React, { useState, useRef } from "react";
import { User, Lock, Check, AlertCircle, Camera, Trash2, PauseCircle, MapPin, ChevronRight, X } from "lucide-react";
import { loadData, saveData, today } from "../utils/storage";
import { BRANCHES } from "../data/seed";

const AVATAR_COLORS = [
  { label: "Red",    value: "from-red-600 to-red-400"         },
  { label: "Orange", value: "from-orange-500 to-amber-400"    },
  { label: "Blue",   value: "from-sky-600 to-blue-400"        },
  { label: "Green",  value: "from-emerald-600 to-green-400"   },
  { label: "Purple", value: "from-purple-600 to-violet-400"   },
  { label: "Pink",   value: "from-pink-500 to-rose-400"       },
  { label: "Teal",   value: "from-teal-500 to-cyan-400"       },
  { label: "Stone",  value: "from-stone-500 to-stone-400"     },
];

const AVATAR_EMOJIS = ["", "💪", "🏋️", "🔥", "⚡", "🎯", "🏆", "🦁", "🐺", "🦅", "👊", "🥊"];

const PAUSE_DURATIONS = [
  { id: "1w", label: "1 Week",  days: 7  },
  { id: "2w", label: "2 Weeks", days: 14 },
  { id: "1m", label: "1 Month", days: 30 },
];

export function ProfileView({ user, setUser, members, setMembers }) {
  const [displayName, setDisplayName]     = useState(user.name || "");
  const [avatarColor, setAvatarColor]     = useState(user.avatarColor || "from-red-600 to-red-400");
  const [avatarEmoji, setAvatarEmoji]     = useState(user.avatarEmoji || "");
  const [avatarImage, setAvatarImage]     = useState(user.avatarImage || null);
  const [profileSaved, setProfileSaved]   = useState(false);
  const fileInputRef = useRef(null);

  const [currentPw,    setCurrentPw]      = useState("");
  const [newPw,        setNewPw]          = useState("");
  const [confirmPw,    setConfirmPw]      = useState("");
  const [pwStatus,     setPwStatus]       = useState(null); // "success" | "error"
  const [pwMsg,        setPwMsg]          = useState("");

  // ── Membership pause state ───────────────────────────────────────────────────
  const [pauseDuration, setPauseDuration] = useState("1m");
  const [pauseNote,     setPauseNote]     = useState("");
  const [pauseSubmitted, setPauseSubmitted] = useState(false);

  const roleLabels = { admin: "Admin", receptionist: "Receptionist", trainer: "Trainer", member: "Member" };

  // ── Member-specific data ──────────────────────────────────────────────────────
  const memberRecord = (user.role === "member" && members) ? members.find((m) => m.id === user.memberId) : null;

  // ── Image upload ─────────────────────────────────────────────────────────────
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        setAvatarImage(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ── Profile save ────────────────────────────────────────────────────────────
  const handleSaveProfile = () => {
    if (!displayName.trim()) return;
    const updated = { ...user, name: displayName.trim(), avatarColor, avatarEmoji, avatarImage };
    setUser(updated);
    saveData("session", updated);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  // ── Password change ──────────────────────────────────────────────────────────
  const handlePasswordChange = () => {
    setPwStatus(null);
    const credentials = loadData("credentials", {});
    const storedPw = credentials[user.username]?.password ?? user.password;

    if (!currentPw) { setPwStatus("error"); setPwMsg("Enter your current password"); return; }
    if (currentPw !== storedPw) { setPwStatus("error"); setPwMsg("Current password is incorrect"); return; }
    if (newPw.length < 4)       { setPwStatus("error"); setPwMsg("New password must be at least 4 characters"); return; }
    if (newPw !== confirmPw)    { setPwStatus("error"); setPwMsg("Passwords don't match"); return; }

    saveData("credentials", { ...credentials, [user.username]: { password: newPw } });
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setPwStatus("success"); setPwMsg("Password updated");
    setTimeout(() => setPwStatus(null), 3000);
  };

  // ── Membership pause / hold ───────────────────────────────────────────────────
  const handlePauseRequest = () => {
    if (!memberRecord || !setMembers) return;
    setMembers((prev) => prev.map((m) => m.id === memberRecord.id
      ? { ...m, pauseRequest: { status: "pending", duration: pauseDuration, requestedDate: today(), startDate: today(), note: pauseNote.trim() } }
      : m
    ));
    setPauseNote("");
    setPauseSubmitted(true);
  };

  const handleCancelPause = () => {
    if (!memberRecord || !setMembers) return;
    setMembers((prev) => prev.map((m) => m.id === memberRecord.id ? { ...m, pauseRequest: null } : m));
    setPauseSubmitted(false);
  };

  // ── Branch change ────────────────────────────────────────────────────────────
  const handleBranchChange = (branchId) => {
    if (!memberRecord || !setMembers) return;
    setMembers((prev) => prev.map((m) => m.id === memberRecord.id ? { ...m, branchId } : m));
  };

  const initials = displayName.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-lg mx-auto space-y-6 fade-up">

      {/* ── Avatar ──────────────────────────────────────────────────────────── */}
      <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 sm:p-6">
        <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-5">Avatar</div>

        <div className="flex flex-col items-center gap-5">
          {/* Preview */}
          <div className="relative group">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center shrink-0 overflow-hidden`}>
              {avatarImage ? (
                <img src={avatarImage} className="w-full h-full object-cover" alt="Profile" />
              ) : avatarEmoji ? (
                <span className="text-4xl leading-none">{avatarEmoji}</span>
              ) : (
                <span className="font-display text-3xl font-semibold text-white">{initials || "?"}</span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition"
              title="Upload photo"
            >
              <Camera className="w-7 h-7 text-white" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg border border-stone-700 transition flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" /> Upload photo
            </button>
            {avatarImage && (
              <button
                onClick={() => setAvatarImage(null)}
                className="px-3 py-1.5 text-xs font-medium bg-stone-800 hover:bg-rose-900/40 text-stone-400 hover:text-rose-300 rounded-lg border border-stone-700 hover:border-rose-800 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            )}
          </div>

          {/* Color swatches */}
          <div className="w-full">
            <div className="text-xs font-mono text-stone-500 uppercase tracking-wider mb-2">Colour</div>
            <div className="flex flex-wrap gap-2">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setAvatarColor(c.value)}
                  title={c.label}
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${c.value} transition border-2 ${
                    avatarColor === c.value ? "border-white scale-110" : "border-transparent hover:border-stone-500"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Emoji options */}
          <div className="w-full">
            <div className="text-xs font-mono text-stone-500 uppercase tracking-wider mb-2">Emoji overlay</div>
            <div className="flex flex-wrap gap-2">
              {AVATAR_EMOJIS.map((e, i) => (
                <button
                  key={i}
                  onClick={() => setAvatarEmoji(e)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition border ${
                    avatarEmoji === e
                      ? "border-red-500 bg-red-900/30"
                      : "border-stone-700 bg-stone-800 hover:border-stone-500"
                  }`}
                >
                  {e === "" ? <Camera className="w-4 h-4 text-stone-500" /> : e}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Identity ────────────────────────────────────────────────────────── */}
      <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 sm:p-6">
        <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-5">Identity</div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Display name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-base sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500"
              placeholder="Your name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Username</label>
              <div className="px-3 py-2.5 bg-stone-800/50 border border-stone-800 rounded-lg text-sm text-stone-500 font-mono select-all">
                {user.username}
              </div>
            </div>
            <div>
              <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Role</label>
              <div className="px-3 py-2.5 bg-stone-800/50 border border-stone-800 rounded-lg text-sm text-stone-500 capitalize">
                {roleLabels[user.role] || user.role}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          className={`mt-5 w-full py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
            profileSaved
              ? "bg-stone-700 text-stone-300"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {profileSaved ? <><Check className="w-4 h-4" /> Saved</> : "Save profile"}
        </button>
      </div>

      {/* ── Password ────────────────────────────────────────────────────────── */}
      <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 sm:p-6">
        <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-5">Change password</div>

        <div className="space-y-3">
          {[
            { label: "Current password", value: currentPw, set: setCurrentPw },
            { label: "New password",     value: newPw,     set: setNewPw     },
            { label: "Confirm new",      value: confirmPw, set: setConfirmPw },
          ].map(({ label, value, set }) => (
            <div key={label}>
              <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">{label}</label>
              <input
                type="password"
                value={value}
                onChange={(e) => set(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-base sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500"
                placeholder="••••••••"
              />
            </div>
          ))}
        </div>

        {pwStatus && (
          <div className={`mt-4 flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg ${
            pwStatus === "success"
              ? "bg-emerald-900/30 border border-emerald-800 text-emerald-300"
              : "bg-rose-950/40 border border-rose-800 text-rose-300"
          }`}>
            {pwStatus === "success" ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {pwMsg}
          </div>
        )}

        <button
          onClick={handlePasswordChange}
          className="mt-4 w-full py-2.5 bg-stone-700 hover:bg-stone-600 text-white rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" /> Update password
        </button>
      </div>

      {/* ── Home Branch (members only) ───────────────────────────────────────── */}
      {user.role === "member" && memberRecord && (
        <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="w-4 h-4 text-stone-500" />
            <div className="text-xs font-mono tracking-widest text-stone-500 uppercase">Home Branch</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {BRANCHES.map((b) => {
              const active = (memberRecord.branchId || BRANCHES[0].id) === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => handleBranchChange(b.id)}
                  className={`p-3 rounded-xl border text-left transition ${
                    active
                      ? "bg-red-600/20 border-red-600 text-red-300"
                      : "bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500"
                  }`}
                >
                  <div className={`font-semibold text-sm ${active ? "text-red-200" : "text-stone-300"}`}>{b.name}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5 leading-tight">{b.address}</div>
                  {active && <div className="text-[10px] font-mono text-red-400 mt-1 uppercase tracking-wider">Your branch</div>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Membership Hold (members only) ──────────────────────────────────── */}
      {user.role === "member" && memberRecord && (() => {
        const pr = memberRecord.pauseRequest;

        // Approved hold
        if (pr?.status === "approved") {
          const durLabel = PAUSE_DURATIONS.find((d) => d.id === pr.duration)?.label ?? pr.duration;
          return (
            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <PauseCircle className="w-4 h-4 text-stone-500" />
                <div className="text-xs font-mono tracking-widest text-stone-500 uppercase">Membership Hold</div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-emerald-900/20 border border-emerald-800 rounded-xl">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-emerald-300">Hold approved — {durLabel}</div>
                  <div className="text-xs text-stone-500 mt-0.5">Your membership will be extended accordingly.</div>
                </div>
              </div>
            </div>
          );
        }

        // Pending hold
        if (pr?.status === "pending") {
          const durLabel = PAUSE_DURATIONS.find((d) => d.id === pr.duration)?.label ?? pr.duration;
          return (
            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <PauseCircle className="w-4 h-4 text-stone-500" />
                <div className="text-xs font-mono tracking-widest text-stone-500 uppercase">Membership Hold</div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-amber-900/20 border border-amber-800 rounded-xl mb-4">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-amber-300">Request pending — {durLabel}</div>
                  <div className="text-xs text-stone-500 mt-0.5">Our team will review and confirm shortly.</div>
                  {pr.note && <div className="text-xs text-stone-400 mt-1 italic">"{pr.note}"</div>}
                </div>
              </div>
              <button
                onClick={handleCancelPause}
                className="w-full py-2.5 border border-stone-700 hover:border-rose-700 text-stone-400 hover:text-rose-300 rounded-lg text-sm font-medium transition"
              >
                Cancel request
              </button>
            </div>
          );
        }

        // Rejected / no request — show form
        return (
          <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-1">
              <PauseCircle className="w-4 h-4 text-stone-500" />
              <div className="text-xs font-mono tracking-widest text-stone-500 uppercase">Membership Hold</div>
            </div>
            <p className="text-xs text-stone-500 mb-5 mt-1">Going away? Pause your membership and we'll extend your expiry by the same duration.</p>

            {pr?.status === "rejected" && (
              <div className="flex items-center gap-2 p-3 bg-rose-950/30 border border-rose-800 rounded-xl mb-4">
                <X className="w-4 h-4 text-rose-400 shrink-0" />
                <div className="text-sm text-rose-300">Your last request was declined. You can submit a new one.</div>
              </div>
            )}

            {pauseSubmitted && !pr && (
              <div className="flex items-center gap-2 p-3 bg-emerald-900/20 border border-emerald-800 rounded-xl mb-4">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-sm text-emerald-300">Request submitted! Pending admin review.</div>
              </div>
            )}

            <div className="mb-4">
              <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-2 block">Pause duration</label>
              <div className="grid grid-cols-3 gap-2">
                {PAUSE_DURATIONS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setPauseDuration(d.id)}
                    className={`py-2.5 rounded-lg text-sm font-medium border transition ${
                      pauseDuration === d.id
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-stone-800 border-stone-700 text-stone-300 hover:border-stone-500"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Reason (optional)</label>
              <textarea
                value={pauseNote}
                onChange={(e) => setPauseNote(e.target.value)}
                placeholder="e.g. travelling, injury recovery…"
                rows={2}
                className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-base sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500 resize-none"
              />
            </div>

            <button
              onClick={handlePauseRequest}
              className="w-full py-2.5 bg-stone-700 hover:bg-stone-600 text-white rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
            >
              <PauseCircle className="w-4 h-4" /> Request hold
            </button>
          </div>
        );
      })()}

    </div>
  );
}
