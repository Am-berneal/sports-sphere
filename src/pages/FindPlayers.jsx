import { useMemo, useState } from 'react'
import { Search, UserPlus, Clock, Users, PlusCircle, Settings2, CheckCircle2 } from 'lucide-react'
import { PageHeader, Avatar, Progress, SampleDataNote } from '../components/ui'
import { students, teamsRecruiting, myTeam, SPORTS, DEPARTMENTS } from '../data/mockData'

const skillColor = {
  Advanced: 'bg-brand-green/15 text-brand-green',
  Intermediate: 'bg-brand-blue/15 text-blue-300',
  Beginner: 'bg-slate-500/20 text-slate-300',
}

export default function FindPlayers() {
  const [tab, setTab] = useState('players')
  const [sport, setSport] = useState('All')
  const [skill, setSkill] = useState('All')
  const [dept, setDept] = useState('All')
  const [q, setQ] = useState('')
  const [invited, setInvited] = useState([])
  const [requested, setRequested] = useState([])

  const list = useMemo(
    () =>
      students.filter(
        (s) =>
          (sport === 'All' || s.sport === sport) &&
          (skill === 'All' || s.skill === skill) &&
          (dept === 'All' || s.dept === dept) &&
          (s.name + s.roll + s.position).toLowerCase().includes(q.toLowerCase())
      ),
    [sport, skill, dept, q]
  )

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Player discovery"
        title="Find Players & Teams"
        description="Find students across departments or recruit missing positions for upcoming tournaments."
        actions={<button className="btn-primary"><PlusCircle size={16} /> Post Team Need</button>}
      />

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <div className="mb-6 flex gap-6 border-b border-white/10">
            {[
              ['players', 'Find Players', students.length],
              ['teams', 'Teams Looking for Members', teamsRecruiting.length],
            ].map(([id, l, n]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`-mb-px flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold ${tab === id ? 'border-brand-green text-brand-green' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                {l} <span className="rounded-full bg-navy-700 px-2 text-xs text-slate-300">{n}</span>
              </button>
            ))}
          </div>

          {tab === 'players' ? (
            <>
              <div className="card mb-6 grid gap-3 p-4 md:grid-cols-4">
                <div className="relative md:col-span-4">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input className="input pl-9" placeholder="Search by name, roll no. or position…" value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
                <select className="input" value={sport} onChange={(e) => setSport(e.target.value)}>
                  <option value="All">All sports</option>
                  {SPORTS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <select className="input" value={skill} onChange={(e) => setSkill(e.target.value)}>
                  <option value="All">All skill levels</option>
                  <option>Advanced</option><option>Intermediate</option><option>Beginner</option>
                </select>
                <select className="input md:col-span-2" value={dept} onChange={(e) => setDept(e.target.value)}>
                  <option value="All">All departments</option>
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="mb-3 text-sm text-slate-400">Showing <span className="text-brand-green">{list.length}</span> players</div>
              <div className="grid gap-5 md:grid-cols-2">
                {list.map((s) => (
                  <div key={s.roll} className="card border-l-4 border-l-brand-green p-5">
                    <div className="flex items-start gap-4">
                      <Avatar name={s.name} size="lg" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-semibold">{s.name}</div>
                            <div className="text-xs text-slate-400">{s.roll} · {s.dept}</div>
                          </div>
                          <span className="badge bg-white/5 text-slate-300">{s.sport}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className={`badge ${skillColor[s.skill]}`}>{s.skill}</span>
                          <span className="badge bg-brand-blue/10 text-blue-300">{s.position}</span>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400"><Clock size={14} /> {s.availability}</div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {invited.includes(s.roll) ? (
                        <button className="btn-secondary text-brand-green" disabled><CheckCircle2 size={16} /> Invited</button>
                      ) : (
                        <button className="btn-primary" onClick={() => setInvited([...invited, s.roll])}><UserPlus size={16} /> Invite to Team</button>
                      )}
                      <button className="btn-secondary">Profile</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {teamsRecruiting.map((t) => (
                <div key={t.name} className="card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-lg font-semibold">{t.name}</div>
                      <div className="text-xs text-slate-400">{t.sport} · Capt. {t.captain}</div>
                    </div>
                    <span className="badge bg-brand-green/15 text-brand-green">Recruiting</span>
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Users size={14} /> Members</span>
                    <span>{t.members}/{t.max}</span>
                  </div>
                  <div className="mt-1.5"><Progress value={t.members} max={t.max} /></div>
                  <div className="mt-4 text-xs text-slate-400">Positions needed</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {t.needs.map((n) => <span key={n} className="badge bg-brand-amber/15 text-amber-400">{n}</span>)}
                  </div>
                  <button
                    disabled={requested.includes(t.name)}
                    onClick={() => setRequested([...requested, t.name])}
                    className="btn-primary mt-5 w-full disabled:opacity-50"
                  >
                    {requested.includes(t.name) ? 'Request sent' : 'Request to Join'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My team */}
        <aside className="space-y-6">
          <div className="card p-5">
            <div className="eyebrow">My team</div>
            <div className="mt-2 text-lg font-semibold">{myTeam.name}</div>
            <div className="text-xs text-slate-400">{myTeam.sport} · {myTeam.event}</div>
            <div className="mt-5 flex justify-between text-sm">
              <span>Squad capacity</span>
              <span className="font-semibold text-brand-green">{myTeam.members.length + invited.length}/{myTeam.max}</span>
            </div>
            <div className="mt-2"><Progress value={myTeam.members.length + invited.length} max={myTeam.max} /></div>
            <p className="mt-2 text-xs text-slate-500">Minimum squad must be complete before the registration deadline.</p>

            <div className="mt-5 eyebrow">Current roster</div>
            <div className="mt-3 space-y-2">
              {myTeam.members.map((m) => (
                <div key={m.name} className="flex items-center gap-3 rounded-lg bg-navy-950/60 px-3 py-2">
                  <Avatar name={m.name} size="sm" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {m.name} {m.role === 'Captain' && <span className="badge ml-1 bg-purple-500/15 text-purple-300">Captain</span>}
                    </div>
                    <div className="text-xs text-slate-500">{m.position}</div>
                  </div>
                </div>
              ))}
              {invited.map((r) => {
                const s = students.find((x) => x.roll === r)
                return (
                  <div key={r} className="flex items-center gap-3 rounded-lg border border-dashed border-white/10 px-3 py-2">
                    <Avatar name={s.name} size="sm" />
                    <div className="flex-1 text-sm">{s.name}</div>
                    <span className="badge bg-brand-amber/15 text-amber-400">Invite sent</span>
                  </div>
                )
              })}
            </div>
            <button className="btn-primary mt-5 w-full"><Settings2 size={16} /> Manage Team</button>
          </div>
        </aside>
      </div>
      <SampleDataNote />
    </div>
  )
}
