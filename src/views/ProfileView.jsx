import React, { useState } from "react";
import { User, Lock, Check, AlertCircle, Camera } from "lucide-react";
import { loadData, saveData } from "../utils/storage";

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

export function ProfileView({ user, setUser }) {
  const [displayName, setDisplayName]     = useState(user.name || "");
  const [avatarColor, setAvatarColor]     = useState(user.avatarColor || "from-red-600 to-red-400");
  const [avatarEmoji, setAvatarEmoji]     = useState(user.avatarEmoji || "");
  const [profileSaved, setProfileSaved]   = useState(false);

  const [currentPw,    setCurrentPw]      = useState("");
  const [newPw,        setNewPw]          = useState("");
  const [confirmPw,    setConfirmPw]      = useState("");
  const [pwStatus,     setPwStatus]       = useState(null); // "success" | "error"
  const [pwMsg,        setPwMsg]          = useState("");

  const roleLabels = { admin: "Admin", receptionist: "Receptionist", trainer: "Trainer", member: "Member" };

  // ── Profile save ────────────────────────────────────────────────────────────
  const handleSaveProfile = () => {
    if (!displayName.trim()) return;
    const updated = { ...user, name: displayName.trim(), avatarColor, avatarEmoji };
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

  const initials = displayName.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-lg mx-auto space-y-6 fade-up">

      {/* ── Avatar ──────────────────────────────────────────────────────────── */}
      <div className="bg-stone-900 border border-stone-700 rounded-2xl p-5 sm:p-6">
        <div className="text-xs font-mono tracking-widest text-stone-500 uppercase mb-5">Avatar</div>

        <div className="flex flex-col items-center gap-5">
          {/* Preview */}
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center shrink-0 relative`}>
            {avatarEmoji ? (
              <span className="text-4xl leading-none">{avatarEmoji}</span>
            ) : (
              <span className="font-display text-3xl font-semibold text-white">{initials || "?"}</span>
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

    </div>
  );
}
