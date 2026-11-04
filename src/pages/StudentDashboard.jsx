import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Shield, Volleyball, CalendarCheck, CalendarDays, MapPin, ArrowRight, Info, CheckCircle2, AlertTriangle, Bell, PlusCircle, Compass } from 'lucide-react'
import { StatCard, StatusBadge, Progress, SampleDataNote } from '../components/ui'
import { events, upcomingMatches, notifications, teamInvites } from '../data/mockData'

const noteIcon = { info: Info, success: CheckCircle2, warning: AlertTriangle }
const noteColor = { info: 'text-blue-300 bg-brand-blue/10', success: 'text-brand-green bg-brand-green/10', warning: 'text-amber-400 bg-brand-amber/10' }

export default function StudentDashboard() {
  const [invites, setInvites] = useState(teamInvites)
  const openEvents = events.filter((e) => e.status === 'Open').slice(0, 3)

  return (
    <div className="mx-auto max-w-7xl">
      {/* Welcome */}
      <div className="card relative mb-8 overflow-hidden bg-gradient-to-r from-navy-800 to-navy-700 p-8">
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <StatusBadge status="Open">Season active</StatusBadge>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Welcome back, Amberneal 👋</h1>
            <p className="mt-2 text-slate-300">
              You have <b className="text-white">2 matches</b> this week and <b className="text-white">{invites.length} pending team invites</b>.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/events" className="btn-secondary"><Compass size={16} /> Explore Tournaments</Link>
            <Link to="/facilities" className="btn-primary"><PlusCircle size={16} /> New Facility Booking</Link>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Registered events" value="3" hint="2 active · 1 upcoming" icon={Trophy} />
        <StatCard label="My teams" value="2" hint="Captain of Thunderbolts FC" icon={Shield} accent="blue" />
        <StatCard label="Upcoming matches" value="2" hint="Next: Mon 6:30 PM" icon={Volleyball} accent="amber" />
        <StatCard label="Facility bookings" value="1" hint="Badminton Court 2 · Sat" icon={CalendarCheck} />
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          {/* Upcoming matches */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-semibold"><span className="h-5 w-1 rounded bg-brand-green" /> Upcoming Matches</h2>
              <Link to="/matches" className="text-sm text-blue-300 hover:underline">Full schedule →</Link>
            </div>
            <div className="space-y-3">
              {upcomingMatches.map((m) => (
                <div key={m.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-brand-green">
                    <Volleyball size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="badge bg-brand-amber/15 text-amber-400">{m.sport}</span>
                      <span className="text-slate-400">{m.round}</span>
                      <StatusBadge status={m.status} />
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      <span className="text-brand-green">{m.teamA}</span>
                      {m.teamB && <><span className="mx-2 text-sm text-slate-500">vs</span>{m.teamB}</>}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><CalendarDays size={14} /> {m.date} · {m.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {m.venue}</span>
                    </div>
                  </div>
                  <Link to="/matches" className="btn-secondary">View</Link>
                </div>
              ))}
            </div>
          </section>

          {/* Open tournaments */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-semibold"><span className="h-5 w-1 rounded bg-brand-blue" /> Open Tournaments</h2>
              <Link to="/events" className="text-sm text-blue-300 hover:underline">View all →</Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {openEvents.map((e) => (
                <div key={e.id} className="card overflow-hidden">
                  <div className="relative h-28">
                    <img src={e.image} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-800 to-transparent" />
                  </div>
                  <div className="p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-brand-green">{e.sport}</div>
                    <div className="mt-1 font-semibold leading-snug">{e.name}</div>
                    <div className="mt-3 flex justify-between text-xs text-slate-400">
                      <span>Slots filled</span>
                      <span>{e.slotsFilled}/{e.slotsTotal}</span>
                    </div>
                    <div className="mt-1.5"><Progress value={e.slotsFilled} max={e.slotsTotal} /></div>
                    <div className="mt-3 text-xs text-slate-400">Deadline: {e.deadline}</div>
                    <Link to={`/events/${e.id}`} className="btn-primary mt-4 w-full">Register</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          <section className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Team Invites</h2>
              <span className="badge bg-brand-green/15 text-brand-green">{invites.length} pending</span>
            </div>
            {invites.length === 0 && <p className="text-sm text-slate-400">No pending invites.</p>}
            <div className="space-y-3">
              {invites.map((inv) => (
                <div key={inv.id} className="rounded-lg bg-navy-950/60 p-4">
                  <div className="font-semibold">{inv.team}</div>
                  <div className="text-xs text-slate-400">{inv.sport} · Capt. {inv.captain}</div>
                  <div className="mt-1 text-xs text-blue-300">Role: {inv.role}</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button className="btn-primary py-1.5" onClick={() => setInvites(invites.filter((i) => i.id !== inv.id))}>Accept</button>
                    <button className="btn-secondary py-1.5" onClick={() => setInvites(invites.filter((i) => i.id !== inv.id))}>Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold"><Bell size={18} /> Recent Activity</h2>
              <Link to="/notifications" className="text-xs text-blue-300">View all</Link>
            </div>
            <div className="space-y-4">
              {notifications.map((n) => {
                const Icon = noteIcon[n.type]
                return (
                  <div key={n.id} className="flex gap-3">
                    <div className={`h-8 w-8 shrink-0 rounded-full p-2 ${noteColor[n.type]}`}><Icon size={16} /></div>
                    <div>
                      <div className="text-sm">{n.text}</div>
                      <div className="text-xs text-slate-500">{n.time}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <Link to="/find-players" className="card flex items-center justify-between p-5 hover:border-brand-green/30">
            <div>
              <div className="font-semibold">Looking for teammates?</div>
              <div className="text-xs text-slate-400">Browse players by sport and skill</div>
            </div>
            <ArrowRight className="text-brand-green" />
          </Link>
        </div>
      </div>
      <SampleDataNote />
    </div>
  )
}
