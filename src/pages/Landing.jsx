import { Link } from 'react-router-dom'
import {
  Trophy, Users, CalendarRange, BarChart3, CalendarDays, LineChart,
  Search, UserPlus, Flag, Medal, ArrowRight, CheckCircle2, Zap,
} from 'lucide-react'
import { Logo } from '../components/ui'

const features = [
  { icon: Trophy, title: 'Event Management', text: 'Create sports events, set eligibility and publish announcements in one place.', tag: 'Coordinator tools' },
  { icon: Users, title: 'Team Formation', text: 'Captains build rosters, invite players and track squad size before deadlines.', tag: 'Roster tools' },
  { icon: CalendarRange, title: 'Tournament Scheduling', text: 'Knockout and league fixtures with dates, venues and match status.', tag: 'Fixtures' },
  { icon: BarChart3, title: 'Results & Leaderboards', text: 'Official scores update tournament standings automatically.', tag: 'Live standings' },
  { icon: CalendarDays, title: 'Facility Booking', text: 'Reserve courts and grounds with built-in overlap checks.', tag: 'Conflict-free' },
  { icon: LineChart, title: 'Participation Analytics', text: 'Reports on participation by sport, department and event.', tag: 'Reports' },
]

const steps = [
  { icon: Search, title: 'Browse Events', text: 'Discover open tournaments and campus leagues.' },
  { icon: UserPlus, title: 'Register / Form Team', text: 'Sign up solo or build a team with eligible members.' },
  { icon: Flag, title: 'Play Matches', text: 'Check fixtures, venues and timings in one schedule.' },
  { icon: Medal, title: 'View Results', text: 'Follow scores, standings and leaderboards.' },
]

const roles = [
  {
    badge: 'Student', color: 'text-blue-300 bg-brand-blue/10', title: 'Students',
    points: ['Discover and register for events', 'Find teammates and join teams', 'View schedules, results and alerts'],
    cta: 'Join as a Student', role: 'student',
  },
  {
    badge: 'Sports Coordinator', color: 'text-brand-green bg-brand-green/10', title: 'Sports Coordinators',
    points: ['Create and manage tournaments', 'Approve or reject registrations', 'Publish fixtures and official scores'],
    cta: 'Coordinator Portal', role: 'coordinator',
  },
  {
    badge: 'Administrator', color: 'text-amber-400 bg-brand-amber/10', title: 'Administrators',
    points: ['Manage users and permissions', 'Oversee events and facilities', 'Generate participation reports'],
    cta: 'Admin Console', role: 'admin',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-navy-900">
      {/* Nav */}
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#how" className="hover:text-white">How it Works</a>
            <a href="#roles" className="hover:text-white">Roles</a>
            <Link to="/events" className="hover:text-white">Tournaments</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white">Log in</Link>
            <Link to="/login" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src="/images/arena.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-900/85 to-navy-900" />
        <div className="relative mx-auto max-w-5xl px-4 pb-24 pt-40 text-center md:px-8 md:pt-48">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-green">
            <Zap size={14} /> The all-in-one college sports platform
          </div>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            One Platform. <span className="text-brand-green">Every Sport.</span>
            <br /> One Campus Community.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Manage events, teams, matches and sports facilities in one place.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/login" className="btn-primary px-6 py-3 text-base">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link to="/events" className="btn-secondary border-brand-blue/40 px-6 py-3 text-base text-blue-300">
              <Trophy size={18} /> Explore Events
            </Link>
          </div>
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            {['3 user roles', '6 core modules', 'Conflict-free booking', 'Auto standings'].map((t) => (
              <div key={t} className="card flex items-center justify-center gap-2 bg-navy-800/70 px-4 py-4 text-sm font-medium backdrop-blur">
                <CheckCircle2 size={16} className="text-brand-green" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="text-center">
          <div className="eyebrow text-brand-green">Core features</div>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Everything Sports in One Place</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            One web application connecting students, sports coordinators and administrators.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text, tag }) => (
            <div key={title} className="card group p-6 transition hover:border-brand-green/30">
              <div className="mb-5 inline-flex rounded-lg bg-brand-green/10 p-3 text-brand-green">
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{text}</p>
              <div className="mt-5 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-slate-500">
                {tag} <ArrowRight size={14} className="transition group-hover:translate-x-1 group-hover:text-brand-green" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-white/5 bg-navy-950/50">
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-8">
          <div className="text-center">
            <div className="eyebrow text-brand-green">How it works</div>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">From Kickoff to Championship in Four Steps</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="card relative p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-brand-green/40 font-display text-lg font-bold text-brand-green">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <Icon size={20} className="mx-auto mb-3 text-slate-400" />
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="text-center">
          <div className="eyebrow text-brand-green">Built for every user</div>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Tailored Workspaces for Every Role</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {roles.map((r) => (
            <div key={r.title} className="card flex flex-col p-6">
              <span className={`badge w-fit ${r.color}`}>{r.badge}</span>
              <h3 className="mt-4 text-xl font-semibold">{r.title}</h3>
              <ul className="mt-5 flex-1 space-y-3">
                {r.points.map((p) => (
                  <li key={p} className="flex gap-3 text-sm text-slate-300">
                    <CheckCircle2 size={18} className="shrink-0 text-brand-green" /> {p}
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                state={{ role: r.role }}
                className="mt-6 flex items-center justify-between rounded-lg bg-navy-950 px-4 py-3 text-sm font-medium hover:bg-navy-700"
              >
                {r.cta} <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <div className="card flex flex-col items-start gap-6 bg-gradient-to-r from-navy-800 to-navy-700 p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Ready to bring campus sports together?</h2>
            <p className="mt-2 text-slate-400">Sign in to explore the Sports Sphere prototype.</p>
          </div>
          <Link to="/login" className="btn-primary px-6 py-3">Get Started <ArrowRight size={18} /></Link>
        </div>
      </section>

      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between md:px-8">
          <Logo />
          <p>Software Engineering Project · Thapar Institute of Engineering and Technology</p>
          <p>© 2026 Sports Sphere</p>
        </div>
      </footer>
    </div>
  )
}
