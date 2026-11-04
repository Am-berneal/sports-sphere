import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, CalendarDays, MapPin, Users, Clock, LayoutGrid, List, PlusCircle } from 'lucide-react'
import { PageHeader, StatusBadge, Progress, SampleDataNote } from '../components/ui'
import { events, SPORTS } from '../data/mockData'
import { getRole } from '../components/Layout'

export default function Events() {
  const [sport, setSport] = useState('All')
  const [status, setStatus] = useState('All')
  const [type, setType] = useState('All')
  const [q, setQ] = useState('')
  const [view, setView] = useState('grid')
  const role = getRole()

  const filtered = useMemo(
    () =>
      events.filter(
        (e) =>
          (sport === 'All' || e.sport === sport) &&
          (status === 'All' || e.status === status) &&
          (type === 'All' || e.type === type) &&
          e.name.toLowerCase().includes(q.toLowerCase())
      ),
    [sport, status, type, q]
  )

  const countFor = (s) => events.filter((e) => e.sport === s).length

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow={`${events.filter((e) => e.status !== 'Completed').length} active competitions`}
        title="Events & Tournaments"
        description="Browse campus tournaments, intramural leagues and departmental competitions."
        actions={
          role === 'coordinator' && (
            <Link to="/coordinator/create-event" className="btn-primary"><PlusCircle size={16} /> Create Event</Link>
          )
        }
      />

      <div className="card mb-8 space-y-4 p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input pl-9" placeholder="Search tournaments…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="input lg:w-44" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">Status: All</option>
            <option>Open</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>
          <select className="input lg:w-44" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="All">Type: Team & Solo</option>
            <option>Team</option>
            <option>Individual</option>
          </select>
          <div className="flex rounded-lg bg-navy-950 p-1">
            {[['grid', LayoutGrid], ['list', List]].map(([v, Icon]) => (
              <button key={v} onClick={() => setView(v)} className={`rounded-md px-3 py-1.5 ${view === v ? 'bg-navy-700 text-brand-green' : 'text-slate-500'}`}>
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...SPORTS].map((s) => (
            <button
              key={s}
              onClick={() => setSport(s)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                sport === s ? 'bg-brand-green text-navy-950 font-semibold' : 'bg-navy-950 text-slate-300 hover:bg-navy-700'
              }`}
            >
              {s === 'All' ? 'All Sports' : s}
              <span className="ml-2 rounded-full bg-black/20 px-1.5 text-xs">{s === 'All' ? events.length : countFor(s)}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && <div className="card p-10 text-center text-slate-400">No events match these filters.</div>}

      <div className={view === 'grid' ? 'grid gap-6 md:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
        {filtered.map((e) => (
          <div key={e.id} className={`card overflow-hidden ${view === 'list' ? 'flex flex-col md:flex-row' : ''}`}>
            <div className={`relative ${view === 'list' ? 'h-40 md:h-auto md:w-64' : 'h-44'}`}>
              <img src={e.image} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-transparent to-transparent" />
              <div className="absolute left-3 top-3 flex gap-2">
                <span className="badge bg-brand-blue text-white">{e.sport}</span>
                <StatusBadge status={e.status} />
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-lg bg-navy-950/80 px-3 py-2 text-xs backdrop-blur">
                <Clock size={14} className="text-amber-400" />
                {e.status === 'Completed' ? 'Tournament finished' : `Registration closes ${e.deadline}`}
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-semibold">{e.name}</h3>
              <div className="mt-3 space-y-1.5 text-sm text-slate-400">
                <div className="flex items-center gap-2"><CalendarDays size={15} /> {e.startDate} → {e.endDate}</div>
                <div className="flex items-center gap-2"><MapPin size={15} /> {e.venue}</div>
                <div className="flex items-center gap-2"><Users size={15} /> {e.teamSize} · {e.format}</div>
              </div>
              <div className="mt-4 rounded-lg bg-navy-950/60 p-3">
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-slate-300">{e.type === 'Team' ? 'Teams' : 'Players'}: {e.slotsFilled}/{e.slotsTotal}</span>
                  <span className="text-brand-green">{Math.round((e.slotsFilled / e.slotsTotal) * 100)}%</span>
                </div>
                <Progress value={e.slotsFilled} max={e.slotsTotal} color={e.slotsFilled === e.slotsTotal ? 'bg-brand-blue' : 'bg-brand-green'} />
              </div>
              <div className="mt-auto flex items-center justify-between pt-5">
                <Link to={`/events/${e.id}`} className="text-sm text-slate-300 hover:text-white">View Details →</Link>
                {e.status === 'Open' ? (
                  <Link to={`/events/${e.id}`} className="btn-primary">Register {e.type === 'Team' ? 'Team' : 'Solo'}</Link>
                ) : (
                  <Link to="/matches" className="btn-secondary">{e.status === 'Completed' ? 'View Results' : 'Match Center'}</Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <SampleDataNote />
    </div>
  )
}
