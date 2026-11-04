import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Trophy, UserSearch, Flag, BarChart3, CalendarDays,
  Bell, Settings, PlusCircle, ClipboardCheck, Edit3, ShieldCheck, FileText,
  Activity, Search, Menu, X, LogOut, Mail, Shuffle, Sparkles, Newspaper, Dumbbell, LineChart,
} from 'lucide-react'
import { Logo, Avatar } from './ui'
import ErrorBoundary from './ErrorBoundary'
import { storage } from '../lib/storage'

export const NAV = {
  student: {
    label: 'Campus Athletics',
    user: { name: 'Amberneal Singh', title: 'Student · CSE' },
    items: [
      { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/events', label: 'Events & Tournaments', icon: Trophy },
      { to: '/find-players', label: 'Find Players & Teams', icon: UserSearch },
      { to: '/matches', label: 'Matches & Leaderboards', icon: BarChart3 },
      { to: '/facilities', label: 'Facility Booking', icon: CalendarDays },
      { to: '/digest', label: 'Weekly Digest', icon: Mail, ai: true },
      { to: '/training-coach', label: 'Training Coach', icon: Dumbbell, ai: true },
      { to: '/notifications', label: 'Notifications', icon: Bell },
    ],
  },
  coordinator: {
    label: 'Coordinator Portal',
    user: { name: '[Coordinator Name]', title: 'Sports Coordinator' },
    items: [
      { to: '/coordinator', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/coordinator/create-event', label: 'Create Event', icon: PlusCircle },
      { to: '/coordinator/approvals', label: 'Registrations', icon: ClipboardCheck },
      { to: '/coordinator/team-balancer', label: 'Team Balancer', icon: Shuffle, ai: true },
      { to: '/coordinator/scores', label: 'Score Entry', icon: Edit3 },
      { to: '/coordinator/match-recap', label: 'Match Recap', icon: Newspaper, ai: true },
      { to: '/coordinator/insights', label: 'Participation Insights', icon: LineChart, ai: true },
      { to: '/matches', label: 'Fixtures & Standings', icon: Flag },
      { to: '/facilities', label: 'Facility Requests', icon: CalendarDays },
    ],
  },
  admin: {
    label: 'Admin Console',
    user: { name: '[Admin Name]', title: 'System Administrator' },
    items: [
      { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
      { to: '/admin/ask', label: 'Ask Sports Sphere', icon: Sparkles, ai: true },
      { to: '/admin#users', label: 'Users & Roles', icon: ShieldCheck },
      { to: '/events', label: 'Events', icon: Trophy },
      { to: '/facilities', label: 'Facilities', icon: CalendarDays },
      { to: '/admin#reports', label: 'Reports', icon: FileText },
      { to: '/admin#activity', label: 'Activity Log', icon: Activity },
    ],
  },
}

export function getRole() {
  const r = storage.get('ss-role', 'student')
  return NAV[r] ? r : 'student'
}

export function setRole(role) {
  storage.set('ss-role', role)
}

export default function Layout({ role: forcedRole }) {
  const role = forcedRole || getRole()
  const nav = NAV[role]
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // remember the role of the section being viewed (after render, not during it)
  useEffect(() => {
    if (forcedRole) setRole(forcedRole)
  }, [forcedRole])

  // scroll to top on page change, or to a #section when given
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) return el.scrollIntoView({ behavior: 'smooth' })
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive ? 'bg-brand-green text-navy-950 shadow-glow' : 'text-slate-300 hover:bg-white/5 hover:text-white'
    }`

  const item = ({ to, label, icon: Icon, ai }, isActive) => (
    <>
      <Icon size={18} className="shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {ai && (
        <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${isActive ? 'bg-navy-950/20 text-navy-950' : 'bg-brand-green/15 text-brand-green'}`}>
          AI
        </span>
      )}
    </>
  )

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-6">
        <Logo subtitle={nav.label} />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {nav.items.map((it) =>
          it.to.includes('#') ? (
            <a key={it.to} href={it.to} onClick={(e) => { e.preventDefault(); navigate(it.to); setOpen(false) }} className={linkClass({ isActive: false })}>
              {item(it, false)}
            </a>
          ) : (
            <NavLink key={it.to} to={it.to} end={it.end} className={linkClass} onClick={() => setOpen(false)}>
              {({ isActive }) => item(it, isActive)}
            </NavLink>
          )
        )}
      </nav>
      <div className="space-y-1 px-3 pb-4 pt-3">
        <div className="mx-1 mb-3 rounded-lg border border-white/5 bg-navy-950/50 p-3">
          <div className="eyebrow">Switch role (demo)</div>
          <div className="mt-2 grid grid-cols-3 gap-1">
            {['student', 'coordinator', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRole(r)
                  setOpen(false)
                  navigate(r === 'student' ? '/student' : `/${r}`)
                }}
                className={`rounded-md px-1 py-1 text-[11px] capitalize ${
                  r === role ? 'bg-brand-green/20 text-brand-green' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                {r === 'coordinator' ? 'Coord.' : r}
              </button>
            ))}
          </div>
        </div>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5">
          <Settings size={18} /> Settings
        </button>
        <NavLink to="/login" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5">
          <LogOut size={18} /> Log out
        </NavLink>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/5 bg-navy-950 lg:block">{sidebar}</aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-navy-950">
            <button className="absolute right-3 top-3 text-slate-400" onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-white/5 bg-navy-900/90 px-4 py-3 backdrop-blur md:px-8">
          <button className="text-slate-300 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input pl-9" placeholder="Search tournaments, teams, players, courts…" />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <NavLink to="/notifications" className="relative text-slate-300 hover:text-white" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-brand-green" />
            </NavLink>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-semibold">{nav.user.name}</div>
                <div className="text-[11px] uppercase tracking-wide text-brand-green">{nav.user.title}</div>
              </div>
              <Avatar name={nav.user.name} />
            </div>
          </div>
        </header>
        <main className="px-4 py-8 md:px-8">
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
