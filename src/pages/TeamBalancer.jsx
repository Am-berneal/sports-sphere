import { useMemo, useState } from 'react'
import { Search, Shuffle, ArrowLeftRight, Check, Wand2, ShieldCheck, Info, AlertTriangle, Lock } from 'lucide-react'
import { PageHeader, Avatar, SampleDataNote, useToast } from '../components/ui'
import { footballPool, POSITIONS, SKILL_LABEL } from '../data/smartData'
import { balanceTeams, balanceStats, averageSkill, lineRating } from '../lib/teamBalancer'
import { storage } from '../lib/storage'

const TEAM_STYLE = [
  { name: 'Team Green', text: 'text-brand-green', chip: 'bg-brand-green/15 text-brand-green', bar: 'bg-brand-green' },
  { name: 'Team Blue', text: 'text-blue-300', chip: 'bg-brand-blue/15 text-blue-300', bar: 'bg-brand-blue' },
  { name: 'Team Amber', text: 'text-amber-300', chip: 'bg-amber-500/15 text-amber-300', bar: 'bg-amber-400' },
]
const skillChip = (s) =>
  s >= 8 ? 'bg-brand-green/15 text-brand-green' : s >= 5 ? 'bg-brand-blue/15 text-blue-300' : 'bg-slate-500/20 text-slate-300'
const short = (s) => SKILL_LABEL(s).slice(0, 3)

export default function TeamBalancer() {
  const [selected, setSelected] = useState(() => new Set(footballPool.map((p) => p.id)))
  const [teamCount, setTeamCount] = useState(2)
  const [filter, setFilter] = useState('All')
  const [q, setQ] = useState('')
  const [seed, setSeed] = useState(0)
  const [teams, setTeams] = useState(() => balanceTeams(footballPool, 2, 0))
  const [swapMode, setSwapMode] = useState(false)
  const [swapPick, setSwapPick] = useState(null)
  const [confirmed, setConfirmed] = useState(() => storage.get('ss-teams-confirmed', null))
  const [lastRun, setLastRun] = useState('just now')
  const [toast, showToast] = useToast()

  const pool = footballPool.filter((p) => selected.has(p.id))
  const gkCount = pool.filter((p) => p.pos === 'GK').length
  const minPlayers = teamCount * 3
  const stats = useMemo(() => balanceStats(teams), [teams])

  const shown = footballPool.filter(
    (p) => (filter === 'All' || p.pos === filter) && `${p.name} ${p.dept} ${p.role}`.toLowerCase().includes(q.toLowerCase())
  )

  const run = (newSeed = seed, count = teamCount) => {
    if (pool.length < count * 3) return showToast(`Select at least ${count * 3} players`, 'error')
    setTeams(balanceTeams(pool, count, newSeed))
    setSwapPick(null)
    setSwapMode(false)
    setConfirmed(null)
    storage.remove('ss-teams-confirmed')
    setLastRun(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
  }

  const toggle = (id) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  const pickForSwap = (teamIdx, player) => {
    if (!swapMode) return
    if (!swapPick) return setSwapPick({ teamIdx, player })
    if (swapPick.teamIdx === teamIdx) return setSwapPick({ teamIdx, player })
    const next = teams.map((t) => ({ ...t, players: [...t.players] }))
    const a = next[swapPick.teamIdx]
    const b = next[teamIdx]
    a.players = a.players.map((p) => (p.id === swapPick.player.id ? player : p))
    b.players = b.players.map((p) => (p.id === player.id ? swapPick.player : p))
    next.forEach((t) => (t.total = t.players.reduce((s, p) => s + p.skill, 0)))
    setTeams(next)
    setSwapPick(null)
    setConfirmed(null)
    showToast(`Swapped ${swapPick.player.name} and ${player.name}`)
  }

  const confirm = () => {
    const data = { at: new Date().toLocaleString('en-IN'), teams: teams.map((t, i) => ({ name: TEAM_STYLE[i].name, players: t.players.map((p) => p.name) })) }
    storage.set('ss-teams-confirmed', data)
    setConfirmed(data)
    setSwapMode(false)
    showToast('Teams confirmed and published to players')
  }

  const gaugeColor = stats.score >= 90 ? '#22C55E' : stats.score >= 75 ? '#F59E0B' : '#EF4444'
  const C = 2 * Math.PI * 52

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow="Algorithm · no AI needed"
        title="Smart Team Balancer"
        description="Create fair teams automatically based on skill level and position. The coordinator reviews and approves the final teams."
        actions={
          <div className="card flex items-center gap-2 px-4 py-2.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-brand-green" /> {pool.length} players checked in
          </div>
        }
      />

      {/* Controls */}
      <div className="card mb-6 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
          <div>
            <label className="label">Event</label>
            <select className="input"><option>Intramural Football Friendly</option></select>
          </div>
          <div>
            <label className="label">Number of teams</label>
            <select className="input" value={teamCount} onChange={(e) => { const n = Number(e.target.value); setTeamCount(n); run(seed, n) }}>
              <option value={2}>2 teams</option>
              <option value={3}>3 teams</option>
            </select>
          </div>
          <div>
            <label className="label">Balance by</label>
            <select className="input"><option>Skill + position</option></select>
          </div>
          <button onClick={() => { setSeed(0); run(0) }} className="btn-primary py-2.5"><Wand2 size={16} /> Balance Teams</button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="badge bg-navy-950 text-slate-300"><Lock size={11} /> Goalkeepers spread evenly</span>
          <span className="badge bg-navy-950 text-slate-300">Greedy skill balancing per position</span>
          <span className="ml-auto">Last balanced: {lastRun}</span>
        </div>
        {(gkCount < teamCount || pool.length < minPlayers) && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
            <AlertTriangle size={16} />
            {pool.length < minPlayers ? `Select at least ${minPlayers} players to make ${teamCount} teams.` : `Only ${gkCount} goalkeeper${gkCount === 1 ? '' : 's'} selected — some teams will have no goalkeeper.`}
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        {/* Player pool */}
        <aside className="card flex h-fit flex-col p-5 xl:sticky xl:top-24">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">Player Pool <span className="rounded-full bg-navy-700 px-2 text-xs">{selected.size}</span></h2>
            <label className="flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                className="accent-green-500"
                checked={selected.size === footballPool.length}
                onChange={() => setSelected(selected.size === footballPool.length ? new Set() : new Set(footballPool.map((p) => p.id)))}
              />
              Select all
            </label>
          </div>
          <div className="relative mt-4">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input pl-9" placeholder="Search player or department" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['All', 'GK', 'DEF', 'MID', 'FWD'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3 py-1 text-xs ${filter === f ? 'bg-brand-blue text-white' : 'bg-navy-950 text-slate-400'}`}>
                {f} ({f === 'All' ? footballPool.length : footballPool.filter((p) => p.pos === f).length})
              </button>
            ))}
          </div>
          <div className="mt-4 max-h-[520px] space-y-2 overflow-y-auto pr-1">
            {shown.map((p) => (
              <label key={p.id} className="flex cursor-pointer items-center gap-3 rounded-lg bg-navy-950/60 px-3 py-2 hover:bg-navy-950">
                <input type="checkbox" className="accent-green-500" checked={selected.has(p.id)} onChange={() => toggle(p.id)} />
                <Avatar name={p.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium" title={p.name}>{p.name}</div>
                  <div className="text-xs text-slate-500">{p.dept}</div>
                </div>
                <span className="badge bg-navy-700 text-slate-300">{p.role}</span>
                <span className={`badge ${skillChip(p.skill)}`}>{short(p.skill)}</span>
              </label>
            ))}
            {shown.length === 0 && <p className="py-6 text-center text-sm text-slate-500">No players match.</p>}
          </div>
          <div className="mt-3 text-xs text-slate-400">{selected.size}/{footballPool.length} selected · then press Balance Teams</div>
        </aside>

        <div className="space-y-6">
          {/* Balance score */}
          <section className="card grid gap-6 p-6 md:grid-cols-[auto_1fr_1.2fr] md:items-center">
            <div className="relative mx-auto h-32 w-32">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="52" stroke="#0B1426" strokeWidth="10" fill="none" />
                <circle cx="60" cy="60" r="52" stroke={gaugeColor} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - stats.score / 100)} style={{ transition: 'stroke-dashoffset .6s' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-bold" style={{ color: gaugeColor }}>{stats.score}%</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400">Fair</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">Balance score: {stats.score}%</h2>
              <p className="mt-1 text-sm text-slate-400">
                Skill difference between teams: <b className="text-white">{stats.diff} point{stats.diff === 1 ? '' : 's'}</b>.
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                <li className={`flex items-center gap-2 ${stats.gkOk ? 'text-brand-green' : 'text-amber-400'}`}>
                  {stats.gkOk ? <Check size={15} /> : <AlertTriangle size={15} />} {stats.gkOk ? 'Every team has a goalkeeper' : 'A team has no goalkeeper'}
                </li>
                <li className={`flex items-center gap-2 ${stats.sizeOk ? 'text-brand-green' : 'text-amber-400'}`}>
                  {stats.sizeOk ? <Check size={15} /> : <AlertTriangle size={15} />} Team sizes: {teams.map((t) => t.players.length).join(' vs ')}
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              {[['DEF', 'Defence'], ['MID', 'Midfield'], ['FWD', 'Attack']].map(([pos, label]) => (
                <div key={pos}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-300">{label} rating</span>
                    <span className="text-slate-400">{teams.map((t) => `${lineRating(t, pos)}%`).join(' vs ')}</span>
                  </div>
                  <div className="flex h-2 gap-1 overflow-hidden rounded-full bg-navy-950">
                    {teams.map((t, i) => (
                      <div key={i} className={`${TEAM_STYLE[i].bar} h-full`} style={{ width: `${100 / teams.length}%`, opacity: 0.35 + lineRating(t, pos) / 160 }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {swapMode && (
            <div className="flex items-center gap-2 rounded-lg border border-brand-blue/30 bg-brand-blue/10 px-4 py-3 text-sm text-blue-200">
              <ArrowLeftRight size={16} />
              {swapPick ? <>Now click a player in another team to swap with <b>{swapPick.player.name}</b>.</> : 'Swap mode: click one player, then a player from another team.'}
            </div>
          )}

          {/* Teams */}
          <div className={`grid gap-6 ${teams.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
            {teams.map((t, ti) => {
              const style = TEAM_STYLE[ti]
              const captain = [...t.players].sort((a, b) => b.skill - a.skill)[0]
              const counts = { Adv: 0, Int: 0, Beg: 0 }
              t.players.forEach((p) => counts[short(p.skill)]++)
              return (
                <section key={ti} className="card p-5">
                  <div className="flex items-center justify-between">
                    <span className={`badge ${style.chip} px-3 py-1 text-xs`}>{style.name}</span>
                    <span className="text-sm text-slate-400">{t.players.length} players · <b className={`font-display text-xl ${style.text}`}>{t.total}</b> pts</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-lg bg-navy-950/60 px-4 py-3">
                    <div>
                      <div className="text-xs text-slate-400">Average rating</div>
                      <div className="font-display text-xl font-bold">{averageSkill(t)}<span className="text-sm text-slate-500"> / 10</span></div>
                    </div>
                    <div className="flex gap-1.5 text-[11px]">
                      <span className="badge bg-brand-green/15 text-brand-green">{counts.Adv} Adv</span>
                      <span className="badge bg-brand-blue/15 text-blue-300">{counts.Int} Int</span>
                      <span className="badge bg-slate-500/20 text-slate-300">{counts.Beg} Beg</span>
                    </div>
                  </div>
                  {POSITIONS.map(([pos, label]) => {
                    const list = t.players.filter((p) => p.pos === pos)
                    return (
                      <div key={pos} className="mt-4">
                        <div className="eyebrow mb-2">{label} ({list.length})</div>
                        <div className="space-y-1.5">
                          {list.length === 0 && <div className="rounded-lg border border-dashed border-amber-500/30 px-3 py-2 text-xs text-amber-400">None in this team</div>}
                          {list.map((p) => {
                            const picked = swapPick?.player.id === p.id
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => pickForSwap(ti, p)}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                                  picked ? 'bg-brand-blue/25 ring-1 ring-brand-blue' : 'bg-navy-950/60'
                                } ${swapMode ? 'cursor-pointer hover:bg-navy-700' : 'cursor-default'}`}
                              >
                                <span className={p.id === captain?.id ? `${style.text} font-semibold` : ''}>
                                  {p.name} <span className="text-slate-500">({p.role}{p.id === captain?.id ? ' · Capt' : ''})</span>
                                </span>
                                <span className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500">{p.dept}</span>
                                  <span className={`badge ${skillChip(p.skill)}`}>{short(p.skill)}</span>
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </section>
              )
            })}
          </div>

          {/* Actions */}
          <section className="card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck size={28} className={confirmed ? 'text-brand-green' : 'text-slate-500'} />
              <div>
                <div className="font-semibold">{confirmed ? 'Teams confirmed' : 'Waiting for coordinator approval'}</div>
                <div className="text-xs text-slate-400">{confirmed ? `Published ${confirmed.at}` : 'Review the teams, swap players if needed, then confirm.'}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => { const s = seed + 1; setSeed(s); run(s) }} className="btn-secondary"><Shuffle size={16} /> Reshuffle</button>
              <button onClick={() => { setSwapMode(!swapMode); setSwapPick(null) }} className={`btn-secondary ${swapMode ? 'border-brand-blue text-blue-200' : ''}`}>
                <ArrowLeftRight size={16} /> {swapMode ? 'Done Swapping' : 'Manual Swap'}
              </button>
              <button onClick={confirm} disabled={!!confirmed} className="btn-primary disabled:opacity-50"><Check size={16} /> {confirmed ? 'Published' : 'Confirm & Publish'}</button>
            </div>
          </section>

          <p className="flex items-center gap-2 text-xs text-slate-500">
            <Info size={14} /> How it works: players are grouped by position, then each player goes to the team with the lower total skill so far.
          </p>
        </div>
      </div>
      {toast}
      <SampleDataNote />
    </div>
  )
}
