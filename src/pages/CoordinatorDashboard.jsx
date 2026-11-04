import { Link } from 'react-router-dom'
import { Trophy, ClipboardCheck, Flag, CalendarDays, PlusCircle, Edit3, AlertTriangle, Download, MapPin } from 'lucide-react'
import { PageHeader, StatCard, StatusBadge, Progress, SampleDataNote } from '../components/ui'
import { initialRegistrations, initialBookings, events } from '../data/mockData'
import { loadFixtures } from './Matches'

export default function CoordinatorDashboard() {
  const fixtures = loadFixtures()
  const pendingRegs = initialRegistrations.filter((r) => r.status === 'Pending')
  const pendingBookings = initialBookings.filter((b) => b.status === 'Pending')
  const upcoming = fixtures.filter((f) => f.status !== 'Completed').slice(0, 4)
  const active = events.filter((e) => e.status !== 'Completed')

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Coordinator desk"
        title="Athletics Operations Hub"
        description="Overview of active tournaments, pending approvals, fixtures and facility requests."
        actions={
          <>
            <button className="btn-secondary"><Download size={16} /> Export Report</button>
            <Link to="/coordinator/create-event" className="btn-primary"><PlusCircle size={16} /> New Event</Link>
          </>
        }
      />

      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active events" value={active.length} hint="Open or ongoing" icon={Trophy} />
        <StatCard label="Pending registrations" value={pendingRegs.length} hint="Awaiting your review" icon={ClipboardCheck} accent="amber" />
        <StatCard label="Upcoming fixtures" value={upcoming.length} hint="Football Cup group stage" icon={Flag} accent="blue" />
        <StatCard label="Facility requests" value={pendingBookings.length} hint="Pending approval" icon={CalendarDays} accent="red" />
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 p-5">
              <h2 className="text-lg font-semibold">Upcoming Fixtures</h2>
              <Link to="/coordinator/scores" className="btn-primary py-1.5"><Edit3 size={15} /> Score Entry</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-5 py-3 text-left">ID</th>
                    <th className="px-5 py-3 text-left">Match</th>
                    <th className="px-5 py-3 text-left">Time & venue</th>
                    <th className="px-5 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map((m) => (
                    <tr key={m.id} className="border-t border-white/5">
                      <td className="px-5 py-4 font-mono text-xs text-slate-400">#{m.id}</td>
                      <td className="px-5 py-4">
                        <div className="font-medium">{m.teamA} vs {m.teamB}</div>
                        <div className="text-xs text-slate-500">{m.round}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-300">
                        {m.date}, {m.time}
                        <div className="flex items-center gap-1 text-xs text-slate-500"><MapPin size={12} /> {m.venue}</div>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={m.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active Events</h2>
              <Link to="/events" className="text-sm text-blue-300 hover:underline">Manage events →</Link>
            </div>
            <div className="space-y-4">
              {active.map((e) => (
                <div key={e.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{e.name}</span>
                      <StatusBadge status={e.status} />
                    </div>
                    <div className="mt-2"><Progress value={e.slotsFilled} max={e.slotsTotal} /></div>
                  </div>
                  <div className="w-16 text-right text-sm text-slate-400">{e.slotsFilled}/{e.slotsTotal}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold"><AlertTriangle size={18} className="text-amber-400" /> Action Required</h2>
              <span className="badge bg-red-500/15 text-red-400">{pendingRegs.length + pendingBookings.length}</span>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg border-l-4 border-amber-400 bg-navy-950/60 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-amber-400">Registrations</div>
                <div className="mt-1 text-sm">{pendingRegs.length} team registrations are waiting for review.</div>
                <Link to="/coordinator/approvals" className="mt-2 inline-block text-xs font-semibold text-brand-green">Review now →</Link>
              </div>
              <div className="rounded-lg border-l-4 border-brand-blue bg-navy-950/60 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-blue-300">Facility request</div>
                <div className="mt-1 text-sm">{pendingBookings.length} booking request pending for the Main Football Ground.</div>
                <Link to="/facilities" className="mt-2 inline-block text-xs font-semibold text-brand-green">Open bookings →</Link>
              </div>
              <div className="rounded-lg border-l-4 border-brand-green bg-navy-950/60 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-brand-green">Registration window</div>
                <div className="mt-1 text-sm">Football Cup registration closes on Nov 8.</div>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-lg font-semibold">Quick Announcement</h2>
            <textarea className="input mt-3 h-24 resize-none" placeholder="Write an announcement for participants…" />
            <button className="btn-primary mt-3 w-full">Publish Announcement</button>
          </div>
        </aside>
      </div>
      <SampleDataNote />
    </div>
  )
}
