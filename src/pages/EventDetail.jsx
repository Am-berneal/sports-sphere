import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, MapPin, Users, ShieldCheck, Trophy, CheckCircle2, XCircle, Plus, Trash2, Info, Clock, Mail } from 'lucide-react'
import { StatusBadge, Avatar, SampleDataNote } from '../components/ui'
import { events, students } from '../data/mockData'

const timeline = [
  { title: 'Team registration & roster verification', date: 'Until registration deadline', current: true },
  { title: "Captains' briefing & fixture draw", date: 'After deadline' },
  { title: 'Round of 16 / group stage', date: 'Week 1' },
  { title: 'Quarter-finals & semi-finals', date: 'Week 2' },
  { title: 'Final & prize distribution', date: 'Last day' },
]

export default function EventDetail() {
  const { id } = useParams()
  const event = events.find((e) => e.id === id) || events[0]
  const [mode, setMode] = useState(event.type === 'Team' ? 'team' : 'solo')
  const [teamName, setTeamName] = useState('Thunderbolts FC')
  const [roll, setRoll] = useState('')
  const [members, setMembers] = useState([
    { name: 'Amberneal Singh (you)', roll: '[Roll No.]', eligible: true, captain: true },
    { name: 'Arjun Mehta', roll: '102303001', eligible: true },
    { name: 'Karan Gill', roll: '102303005', eligible: true },
  ])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const addMember = () => {
    setError('')
    const r = roll.trim()
    if (!r) return
    if (members.some((m) => m.roll === r)) return setError('This student is already on the roster.')
    if (members.length >= event.maxSize) return setError(`Maximum squad size is ${event.maxSize}.`)
    const s = students.find((st) => st.roll === r)
    setMembers([...members, { name: s ? s.name : 'Unknown student', roll: r, eligible: !!s }])
    setRoll('')
  }

  const canSubmit = mode === 'solo' || (members.length >= event.minSize && members.every((m) => m.eligible))

  return (
    <div className="mx-auto max-w-7xl">
      <Link to="/events" className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        <ArrowLeft size={16} /> Back to Events
      </Link>

      {/* Banner */}
      <div className="relative mb-8 overflow-hidden rounded-2xl">
        <img src={event.image} alt="" className="h-72 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="badge bg-brand-blue text-white">{event.sport}</span>
            <span className="badge bg-white/10 text-white">{event.format}</span>
            <StatusBadge status={event.status} />
          </div>
          <h1 className="mt-3 text-3xl font-extrabold md:text-5xl">{event.name}</h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [CalendarDays, 'Dates', `${event.startDate} → ${event.endDate}`],
              [MapPin, 'Venue', event.venue],
              [Users, 'Roster size', event.teamSize],
              [Clock, 'Deadline', event.deadline],
            ].map(([Icon, l, v]) => (
              <div key={l} className="flex items-center gap-3 rounded-lg bg-navy-950/70 px-4 py-3 backdrop-blur">
                <Icon size={18} className="text-brand-green" />
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400">{l}</div>
                  <div className="text-sm font-medium">{v}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold"><Trophy size={20} className="text-brand-green" /> About the Tournament</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              An inter-department competition open to all enrolled students. Teams represent their department and
              compete for the championship trophy. Matches are officiated by authorized officials, and results are
              published on Sports Sphere so standings update automatically.
            </p>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-semibold">Format & Rules</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ['Format', `${event.format} — teams progress based on results.`],
                ['Points', 'Win = 3 points, Draw = 1, Loss = 0 (league stages).'],
                ['Eligibility', 'Active enrolment; one team per student per event.'],
                ['Reporting', 'Teams report 30 minutes before kick-off; late teams may forfeit.'],
              ].map(([t, d]) => (
                <div key={t} className="rounded-lg bg-navy-950/60 p-4">
                  <div className="font-semibold">{t}</div>
                  <div className="mt-1 text-sm text-slate-400">{d}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-semibold">Tournament Timeline</h2>
            <ol className="relative mt-5 space-y-5 border-l border-white/10 pl-6">
              {timeline.map((t) => (
                <li key={t.title} className="relative">
                  <span className={`absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 ${t.current ? 'border-brand-green bg-brand-green' : 'border-slate-500 bg-navy-800'}`} />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{t.title}</span>
                    {t.current && <span className="badge bg-brand-green/15 text-brand-green">Current phase</span>}
                  </div>
                  <div className="text-xs text-slate-400">{t.date}</div>
                </li>
              ))}
            </ol>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-semibold">Coordinator Contact</h2>
            <div className="mt-4 flex items-center gap-4">
              <Avatar name="Sports Coordinator" size="lg" />
              <div className="flex-1">
                <div className="font-semibold">[Coordinator Name]</div>
                <div className="text-sm text-slate-400">{event.organizer}</div>
              </div>
              <button className="btn-secondary"><Mail size={16} /> Email</button>
            </div>
          </section>
        </div>

        {/* Registration panel */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Registration</h2>
              <span className="badge bg-brand-green/15 text-brand-green">{event.slotsTotal - event.slotsFilled} spots left</span>
            </div>

            {submitted ? (
              <div className="mt-6 rounded-xl border border-brand-green/30 bg-brand-green/10 p-5 text-center">
                <CheckCircle2 size={36} className="mx-auto text-brand-green" />
                <div className="mt-3 font-semibold">Registration submitted</div>
                <p className="mt-1 text-sm text-slate-300">Status: <b className="text-amber-400">Pending</b>. The sports coordinator will review it.</p>
                <Link to="/student" className="btn-secondary mt-4">Back to Dashboard</Link>
              </div>
            ) : event.status !== 'Open' ? (
              <p className="mt-4 text-sm text-slate-400">Registration is closed for this event.</p>
            ) : (
              <>
                <div className="mt-5 grid grid-cols-2 rounded-lg bg-navy-950 p-1">
                  {[['solo', 'Individual'], ['team', 'Team']].map(([m, l]) => (
                    <button
                      key={m}
                      disabled={event.type === 'Team' && m === 'solo'}
                      onClick={() => setMode(m)}
                      className={`rounded-md py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 ${mode === m ? 'bg-brand-green text-navy-950' : 'text-slate-400'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                {mode === 'team' ? (
                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="label">Team name</label>
                      <input className="input" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                    </div>
                    <div>
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-slate-400">Roster (min {event.minSize}, max {event.maxSize})</span>
                        <span className={members.length >= event.minSize ? 'text-brand-green' : 'text-amber-400'}>{members.length} added</span>
                      </div>
                      <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                        {members.map((m) => (
                          <div key={m.roll} className="flex items-center gap-3 rounded-lg bg-navy-950/60 px-3 py-2">
                            <Avatar name={m.name} size="sm" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium">
                                {m.name} {m.captain && <span className="badge ml-1 bg-brand-green/15 text-brand-green">Captain</span>}
                              </div>
                              <div className="text-xs text-slate-500">Roll: {m.roll}</div>
                            </div>
                            {m.eligible ? <CheckCircle2 size={18} className="text-brand-green" /> : <XCircle size={18} className="text-red-400" />}
                            {!m.captain && (
                              <button onClick={() => setMembers(members.filter((x) => x.roll !== m.roll))} className="text-slate-500 hover:text-red-400">
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <input
                          className="input"
                          placeholder="Add by roll number"
                          value={roll}
                          onChange={(e) => setRoll(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addMember()}
                        />
                        <button onClick={addMember} className="btn-secondary px-3"><Plus size={16} /></button>
                      </div>
                      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
                      <p className="mt-2 text-[11px] text-slate-500">Demo: try 102303002 (eligible) or 999 (not found).</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 space-y-3 text-sm text-slate-300">
                    <div className="rounded-lg bg-navy-950/60 p-4">
                      Registering as <b>Amberneal Singh</b>
                      <div className="text-xs text-slate-500">Computer Science · [Roll No.]</div>
                    </div>
                  </div>
                )}

                <div className="mt-5 flex gap-2 rounded-lg bg-brand-blue/10 p-3 text-xs text-blue-200">
                  <Info size={16} className="shrink-0" />
                  Registration will be reviewed by the sports coordinator. Ineligible members must be removed before submitting.
                </div>

                <button disabled={!canSubmit} onClick={() => setSubmitted(true)} className="btn-primary mt-5 w-full py-3 disabled:cursor-not-allowed disabled:opacity-40">
                  <ShieldCheck size={18} /> Submit Registration
                </button>
              </>
            )}
          </div>
        </aside>
      </div>
      <SampleDataNote />
    </div>
  )
}
