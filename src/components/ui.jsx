import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { createPortal } from "react-dom";

export function StatCard({ label, value, icon: Icon, accent, className = "", trend, trendUp }) {
  return (
    <div className={`bg-stone-900 rounded-xl border border-stone-700 p-4 sm:p-5 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent}`}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-[10px] font-mono font-semibold ${trendUp ? "text-red-400" : "text-rose-400"}`}>
            {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
      <div className="font-display text-2xl sm:text-3xl font-semibold text-white">{value}</div>
      <div className="text-xs text-stone-400 mt-1">{label}</div>
    </div>
  );
}

export function Field({ icon: Icon, label, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">{label}</label>
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />}
        <input
          type={type}
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full ${Icon ? "pl-10" : "pl-3"} pr-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500`}
        />
      </div>
    </div>
  );
}

export function TextArea({ label, value, onChange, rows = 3, placeholder }) {
  return (
    <div>
      <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">{label}</label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500 resize-none"
      />
    </div>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500">
        {options.map((opt) => <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>)}
      </select>
    </div>
  );
}

/* Modal slides up from bottom on mobile, centers on sm+.
   Uses dvh so it shrinks when the keyboard appears.
   Rendered via portal to escape any CSS-transform ancestor (which would
   otherwise create a new containing block, clipping position:fixed). */
export function Modal({ title, subtitle, onClose, children, footer, maxWidth = "max-w-md" }) {
  return createPortal(
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className={`bg-stone-900 border border-stone-700 rounded-t-2xl sm:rounded-2xl w-full ${maxWidth} flex flex-col fade-up`}
        style={{ maxHeight: "92dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed header */}
        <div className="px-5 pt-5 sm:px-6 sm:pt-6 shrink-0">
          <div className="w-10 h-1 bg-stone-700 rounded-full mx-auto mb-4 sm:hidden" />
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-semibold text-white">{title}</h3>
              {subtitle && <p className="text-sm text-stone-400 mt-1">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="p-1 hover:bg-stone-800 rounded-md text-stone-400 hover:text-stone-100 transition shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 pb-2 min-h-0">
          {children}
        </div>
        {/* Fixed footer — always visible, never scrolls away */}
        {footer ? (
          <div className="px-5 pb-6 pt-3 sm:px-6 sm:pb-6 border-t border-stone-800 shrink-0">
            <div className="flex gap-2">{footer}</div>
          </div>
        ) : (
          <div className="pb-5 shrink-0" />
        )}
      </div>
    </div>,
    document.body
  );
}

export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="text-center py-10 text-stone-500">
      {Icon && <Icon className="w-8 h-8 mx-auto mb-3 opacity-30" />}
      <p className="text-sm font-medium text-stone-400">{title}</p>
      {subtitle && <p className="text-xs mt-1 text-stone-500">{subtitle}</p>}
    </div>
  );
}
