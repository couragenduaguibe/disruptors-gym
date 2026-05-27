import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function StatCard({ label, value, icon: Icon, accent, className = "", trend, trendUp }) {
  return (
    <div className={`bg-white rounded-xl border border-stone-200 p-4 sm:p-5 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent}`}>
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-[10px] font-mono font-semibold ${trendUp ? "text-red-700" : "text-rose-700"}`}>
            {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
      <div className="font-display text-2xl sm:text-3xl font-semibold">{value}</div>
      <div className="text-xs text-stone-500 mt-1">{label}</div>
    </div>
  );
}

export function Field({ icon: Icon, label, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs font-mono tracking-wider text-stone-500 uppercase mb-1.5 block">{label}</label>
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />}
        <input
          type={type}
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full ${Icon ? "pl-10" : "pl-3"} pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900 focus:bg-white`}
        />
      </div>
    </div>
  );
}

export function TextArea({ label, value, onChange, rows = 3, placeholder }) {
  return (
    <div>
      <label className="text-xs font-mono tracking-wider text-stone-500 uppercase mb-1.5 block">{label}</label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900 focus:bg-white resize-none"
      />
    </div>
  );
}

export function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs font-mono tracking-wider text-stone-500 uppercase mb-1.5 block">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900 focus:bg-white">
        {options.map((opt) => <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>)}
      </select>
    </div>
  );
}

export function Modal({ title, subtitle, onClose, children, footer, maxWidth = "max-w-md" }) {
  return (
    <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl w-full ${maxWidth} p-6 fade-up max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-display text-2xl font-semibold">{title}</h3>
            {subtitle && <p className="text-sm text-stone-500 mt-1">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded-md text-stone-500 hover:text-stone-900">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        {children}
        {footer && <div className="flex gap-2 mt-6">{footer}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="text-center py-12 text-stone-400">
      {Icon && <Icon className="w-8 h-8 mx-auto mb-3 opacity-50" />}
      <p className="text-sm font-medium text-stone-600">{title}</p>
      {subtitle && <p className="text-xs mt-1 text-stone-500">{subtitle}</p>}
    </div>
  );
}
