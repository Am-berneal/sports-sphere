import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, Trophy, Edit3, Download } from 'lucide-react'
import { PageHeader, StatusBadge, SampleDataNote } from '../components/ui'
import { initialFixtures, computeStandings } from '../data/mockData'
import { getRole } from '../components/Layout'

export function loadFixtures() {
  try {
    const saved = localStorage.getItem('ss-fixtures')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch { /* ignore */ }
  return initialFixtures
}

export default function Matches() {
  const [tab, setTab] = useState('fixtures')
  const [round, setRound] = useState('All')
  const fixtures = loadFixtures()
  const standings = useMemo(() => computeStandings(fixtures), [fixtures])
  const role = getRole()

  const shown = fixtures.filter((f) => round === 'All' || f.round === round)
  const scheduled = shown.filter((f) => f.status !== 'Completed')
  const completed = shown.filter((f) => f.status === 'Completed')

  const byDate = scheduled.reduce((acc, f) => {
    ;(acc[f.date] = acc[f.date] || []).push(f)
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-2 text-sm text-slate-400">Events / <span className="text-brand-green">Inter-Department Football Cup</span></div>
      <PageHeader
        title="Matches & Leaderboards"
        description="Fixtures, official results and standings. Standings update automatically when results are published."
        actions={
          <>
            <button className="btn-secondary"><Download size={16} /> Export Fixtures</button>
            {role !== 'student' && <Link to="/coordinator/scores" className="btn-primary"><Edit3 size={16} /> Log Match Score</Link>}
          </>
        }
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex rounded-xl bg-navy-950 p-1">
          {[
            ['fixtures', 'Fixtures', scheduled.length],
            ['results', 'Results', completed.length],
            ['standings', 'Standings', null],
          ].map(([id, l, n]) => (
            <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${tab === id ? 'bg-brand-green text-navy-950' : 'text-slate-400 hover:text-white'}`}>
              {l} {n !== null && <span className="rounded-full bg-black/20 px-1.5 text-xs">{n}</span>}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['All', 'Group A', 'Group B'].map((r) => (
            <button key={r} onClick={() => setRound(r)} className={`rounded-full px-4 py-1.5 text-sm ${round === r ? 'bg-brand-blue text-white' : 'bg-navy-800 text-slate-300'}`}>
              {r === 'All' ? 'All Stages' : r}
            </button>
          ))}
        </div>
      </div>

      {tab === 'fixtures' && (
        <div className="space-y-8">
          {Object.keys(byDate).length === 0 && <div className="card p-10 text-center text-slate-400">No upcoming fixtures.</div>}
          {Object.entries(byDate).map(([date, list]) => (
            <div key={date}>
              <h3 className="mb-3 flex items-center gap-2 font-semibold"><span className="h-2 w-2 rounded-full bg-brand-green" /> {date}</h3>
              <div className="space-y-3">
                {list.map((m) => <FixtureRow key={m.id} m={m} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'results' && (
        <div className="grid gap-5 md:grid-cols-2">
          {completed.map((m) => {
            const aWin = m.scoreA > m.scoreB
            const bWin = m.scoreB > m.scoreA
            return (
              <div key={m.id} className="card p-5">
                <div className="mb-4 flex justify-between text-xs text-slate-400">
                  <span>{m.round} · {m.date}</span>
                  <StatusBadge status="Completed">Final</StatusBadge>
                </div>
                {[[m.teamA, m.scoreA, aWin], [m.teamB, m.scoreB, bWin]].map(([t, s, w]) => (
                  <div key={t} className="flex items-center justify-between py-1.5">
                    <span className={`font-semibold ${w ? 'text-brand-green' : ''}`}>{t} {w && <Trophy size={14} className="ml-1 inline" />}</span>
                    <span className={`font-display text-2xl font-bold ${w ? 'text-brand-green' : 'text-slate-300'}`}>{s}</span>
                  </div>
                ))}
                <div className="mt-3 flex items-center gap-1 text-xs text-slate-500"><MapPin size={13} /> {m.venue}</div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'standings' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {['Group A', 'Group B'].filter((g) => round === 'All' || g === round).map((g) => (
            <div key={g} className="card overflow-hidden">
              <div className="border-b border-white/5 px-5 py-4 font-semibold">{g}</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      {['#', 'Team', 'P', 'W', 'D', 'L', 'GD', 'Pts'].map((h) => (
                        <th key={h} className={`px-4 py-3 ${h === 'Team' ? 'text-left' : 'text-center'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {standings.filter((s) => s.group === g).map((s, i) => (
                      <tr key={s.team} className={`border-t border-white/5 ${i < 2 ? 'bg-brand-green/5' : ''}`}>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${i < 2 ? 'bg-brand-green text-navy-950' : 'bg-navy-700'}`}>{i + 1}</span>
                        </td>
                        <td className="px-4 py-3 font-medium">{s.team}</td>
                        <td className="px-4 py-3 text-center">{s.P}</td>
                        <td className="px-4 py-3 text-center">{s.W}</td>
                        <td className="px-4 py-3 text-center">{s.D}</td>
                        <td className="px-4 py-3 text-center">{s.L}</td>
                        <td className="px-4 py-3 text-center">{s.GF - s.GA > 0 ? '+' : ''}{s.GF - s.GA}</td>
                        <td className="px-4 py-3 text-center font-bold text-brand-green">{s.Pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 text-xs text-slate-500">Top 2 qualify for semi-finals · Win 3, Draw 1, Loss 0</div>
            </div>
          ))}
        </div>
      )}
      <SampleDataNote />
    </div>
  )
}

function FixtureRow({ m }) {
  return (
    <div className="card flex flex-col gap-4 p-5 md:flex-row md:items-center">
      <div className="flex items-center gap-4 md:w-40">
        <div>
          <div className="font-display text-2xl font-bold">{m.time.split(' ')[0]}</div>
          <div className="text-xs text-slate-400">{m.time.split(' ')[1]} · KICKOFF</div>
        </div>
        <div className="hidden h-10 w-0.5 rounded bg-brand-blue md:block" />
      </div>
      <span className="badge w-fit bg-brand-blue/10 text-blue-300">{m.round}</span>
      <div className="flex flex-1 items-center justify-center gap-4 text-center">
        <span className="flex-1 text-right font-semibold">{m.teamA}</span>
        <span className="rounded-md bg-navy-950 px-2 py-1 text-xs text-slate-400">VS</span>
        <span className="flex-1 text-left font-semibold">{m.teamB}</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-400 md:w-56 md:justify-end">
        <span className="flex items-center gap-1"><CalendarDays size={14} /> {m.date}</span>
        <span className="flex items-center gap-1"><MapPin size={14} /> {m.venue}</span>
        <StatusBadge status={m.status} />
      </div>
    </div>
  )
}
