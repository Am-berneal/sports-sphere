import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export function Logo({ subtitle = 'Campus Athletics', to = '/' }) {
  return (
    <Link to={to} className="flex items-center gap-3">
      <img src="/images/logo-icon.png" alt="Sports Sphere logo" className="h-10 w-10 rounded-lg object-cover" />
      <div className="leading-tight">
        <div className="font-display text-lg font-bold tracking-tight">Sports Sphere</div>
        {subtitle && <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-green">{subtitle}</div>}
      </div>
    </Link>
  )
}

const badgeStyles = {
  Open: 'bg-brand-green/15 text-brand-green',
  Approved: 'bg-brand-green/15 text-brand-green',
  Completed: 'bg-slate-500/20 text-slate-300',
  Confirmed: 'bg-brand-green/15 text-brand-green',
  Active: 'bg-brand-green/15 text-brand-green',
  Ongoing: 'bg-brand-blue/15 text-blue-300',
  Scheduled: 'bg-brand-blue/15 text-blue-300',
  Booked: 'bg-brand-blue/15 text-blue-300',
  Live: 'bg-red-500/15 text-red-400',
  Pending: 'bg-brand-amber/15 text-amber-400',
  Rejected: 'bg-red-500/15 text-red-400',
  Closed: 'bg-slate-500/20 text-slate-400',
  Student: 'bg-brand-blue/15 text-blue-300',
  Coordinator: 'bg-brand-amber/15 text-amber-400',
  Administrator: 'bg-purple-500/15 text-purple-300',
}

export function StatusBadge({ status, children }) {
  return (
    <span className={`badge ${badgeStyles[status] || 'bg-white/10 text-slate-300'}`}>
      {(status === 'Open' || status === 'Live' || status === 'Ongoing') && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {children || status}
    </span>
  )
}

export function StatCard({ label, value, hint, icon: Icon, accent = 'green' }) {
  const accents = {
    green: 'text-brand-green bg-brand-green/10',
    blue: 'text-blue-300 bg-brand-blue/10',
    amber: 'text-amber-400 bg-brand-amber/10',
    red: 'text-red-400 bg-red-500/10',
  }
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className="eyebrow">{label}</div>
        {Icon && (
          <div className={`rounded-lg p-2 ${accents[accent]}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="mt-2 font-display text-3xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
  )
}

export function Progress({ value, max, color = 'bg-brand-green' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-navy-950">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-green">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
            {eyebrow}
          </div>
        )}
        <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-slate-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  )
}

export function Avatar({ name, size = 'md' }) {
  const initials = name
    .replace(/[^A-Za-z ]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base' }
  return (
    <div className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-full bg-navy-600 font-semibold text-brand-green`}>
      {initials || '?'}
    </div>
  )
}

export function SampleDataNote() {
  return (
    <div className="mt-10 rounded-lg border border-dashed border-white/10 px-4 py-3 text-center text-xs text-slate-500">
      UI prototype · all names, numbers and events shown are sample data
    </div>
  )
}

// ---------- Smart-feature helpers ----------
export function AIBadge({ label = 'AI Powered' }) {
  return (
    <span className="badge bg-brand-blue/15 text-blue-300">
      <span aria-hidden>✦</span> {label}
    </span>
  )
}

// small toast message that disappears after a few seconds
export function useToast() {
  const [msg, setMsg] = useState(null)
  const timer = useRef(null)
  const show = useCallback((text, type = 'success') => {
    clearTimeout(timer.current)
    setMsg({ text, type })
    timer.current = setTimeout(() => setMsg(null), 3000)
  }, [])
  useEffect(() => () => clearTimeout(timer.current), [])
  const node = msg ? (
    <div
      role="status"
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border px-5 py-3 text-sm font-medium shadow-2xl ${
        msg.type === 'error' ? 'border-red-500/40 bg-red-950 text-red-200' : 'border-brand-green/40 bg-navy-800 text-brand-green'
      }`}
    >
      {msg.text}
    </div>
  ) : null
  return [node, show]
}

const BAR_COLORS = ['bg-brand-green', 'bg-brand-blue', 'bg-amber-400', 'bg-purple-400', 'bg-teal-400', 'bg-slate-400']
export function BarList({ rows, unit = '', highlight, lowBelow }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <div className="space-y-3">
      {rows.map((r, i) => {
        const low = lowBelow !== undefined && r.value < lowBelow
        const color = highlight ? (r.label === highlight ? 'bg-brand-green' : 'bg-navy-600') : lowBelow !== undefined ? (low ? 'bg-amber-400' : 'bg-brand-green') : BAR_COLORS[i % BAR_COLORS.length]
        return (
          <div key={r.label}>
            <div className="mb-1 flex justify-between gap-3 text-sm">
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-navy-950 text-[10px] text-slate-400">{i + 1}</span>
                {r.label}
                {low && <span className="badge bg-amber-500/15 text-amber-400">Low</span>}
              </span>
              <span className="text-slate-300">{r.value}{unit && <span className="text-slate-500"> {unit}</span>}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-navy-950">
              <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${(r.value / max) * 100}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
