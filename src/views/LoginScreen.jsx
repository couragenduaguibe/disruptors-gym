import React, { useState } from "react";
import { Dumbbell, User, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { DEMO_ACCOUNTS } from "../data/seed";
import { ROLES } from "../data/roles";

export function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const found = DEMO_ACCOUNTS.find(
      (a) => a.username === username.trim().toLowerCase() && a.password === password
    );
    if (found) { setError(""); onLogin(found); }
    else setError("Invalid credentials. Try one of the demo accounts below.");
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  const quickLogin = (acc) => { setUsername(acc.username); setPassword(acc.password); onLogin(acc); };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
        <div className="relative bg-stone-950 text-white p-8 lg:p-12 flex flex-col justify-between min-h-[280px] lg:min-h-[600px] border-r border-stone-800">
          <div className="absolute inset-0 noise-bg opacity-20 pointer-events-none" />
          <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-red-500/20 blur-3xl" />
          <div className="absolute -left-12 bottom-0 w-60 h-60 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-11 h-11 bg-red-600 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-display text-2xl font-semibold">Disruptors</div>
                <div className="text-xs text-stone-500 font-mono tracking-widest">GYM OS</div>
              </div>
            </div>

            <div className="text-xs font-mono tracking-widest text-red-400 uppercase mb-3">Welcome back</div>
            <h1 className="font-display text-4xl lg:text-5xl font-semibold leading-tight mb-4">
              Lift heavy. <br />Run the numbers.
            </h1>
            <p className="text-stone-300 text-base lg:text-lg max-w-md">
              Everything you need to run your gym in one place. Sign in to manage members, classes, and check-ins.
            </p>
          </div>

          <div className="relative z-10 text-xs text-stone-600 font-mono tracking-wider mt-8">
            © 2026 DISRUPTORS GYM SYSTEMS
          </div>
        </div>

        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto">
            <h2 className="font-display text-3xl font-semibold mb-2 text-white">Sign in</h2>
            <p className="text-sm text-stone-400 mb-8">Enter your credentials to continue.</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={handleKey} placeholder="admin"
                    className="w-full pl-10 pr-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKey} placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
                  <button onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-950/40 border border-rose-800 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />{error}
                </div>
              )}

              <button onClick={handleSubmit} className="w-full py-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">
                Sign in
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-800">
              <div className="text-xs font-mono tracking-wider text-stone-500 uppercase mb-3">
                Demo accounts — click to sign in
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((acc) => {
                  const role = ROLES[acc.role];
                  const Icon = role.icon;
                  return (
                    <button key={acc.username} onClick={() => quickLogin(acc)}
                      className="flex items-center gap-2 p-2.5 border border-stone-700 rounded-lg hover:border-red-600 hover:bg-stone-800 transition text-left">
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${role.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-stone-200 truncate">{role.label}</div>
                        <div className="text-[10px] text-stone-500 font-mono truncate">{acc.username}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
