import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Save, Send, CheckCircle2, Minus, Plus, RotateCcw } from 'lucide-react'
import { PageHeader, StatusBadge } from '../components/ui'
import { computeStandings, initialFixtures } from '../data/mockData'
import { loadFixtures } from './Matches'

export default function ScoreEntry() {
  const [fixtures, setFixtures] = useState(loadFixtures)
  const [matchId, setMatchId] = useState(fixtures.find((f) => f.status !== 'Completed')?.id || fixtures[0].id)
  const match = fixtures.find((f) => f.id === matchId)
  const [scores, setScores] = useState({ a: match.scoreA ?? 0, b: match.scoreB ?? 0 })
  const [status, setStatus] = useState(match.status === 'Completed' ? 'Completed' : 'Live')
  const [remarks, setRemarks] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [done, setDone] = useState(false)

  const pick = (id) => {
    const m = fixtures.find((f) => f.id === id)
    setMatchId(id)
    setScores({ a: m.scoreA ?? 0, b: m.scoreB ?? 0 })
    setStatus(m.status === 'Completed' ? 'Completed' : 'Live')
    setDone(false)
  }

  const preview = useMemo(() => {
    const next = fixtures.map((f) => (f.id === matchId ? { ...f, scoreA: scores.a, scoreB: scores.b, status: 'Completed' } : f))
    return computeStandings(next).filter((s) => s.group === match.round)
  }, [fixtures, matchId, scores, match.round])

  const publish = () => {
    const next = fixtures.map((f) => (f.id === matchId ? { ...f, scoreA: scores.a, scoreB: scores.b, status: 'Completed' } : f))
    setFixtures(next)
    try { localStorage.setItem('ss-fixtures', JSON.stringify(next)) } catch { /* ignore */ }
    setConfirm(false)
    setDone(true)
  }

  const reset = () => {
    try { localStorage.removeItem('ss-fixtures') } catch { /* ignore */ }
    setFixtures(initialFixtures)
    pick(initialFixtures.find((f) => f.status !== 'Completed').id)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="Authorized officials only"
        title="Match Score Entry"
        description="Enter official scores. Publishing a result recalculates tournament standings automatically."
        actions={<button onClick={reset} className="btn-secondary"><RotateCcw size={16} /> Reset demo data</button>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="card grid gap-4 p-5 md:grid-cols-2">
            <div>
              <label className="label">Tournament</label>
              <select className="input"><option>Inter-Department Football Cup</option></select>
            </div>
            <div>
              <label className="label">Match</label>
              <select className="input" value={matchId} onChange={(e) => pick(e.target.value)}>
                {fixtures.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.id} · {f.teamA} vs {f.teamB} {f.status === 'Completed' ? '(completed)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scoreboard */}
          <div className="card bg-gradient-to-br from-navy-800 to-navy-700 p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
              <span>{match.round} · {match.date}, {match.time} · {match.venue}</span>
              <StatusBadge status={status} />
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              {[['a', match.teamA], null, ['b', match.teamB]].map((t, i) =>
                t === null ? (
                  <div key="sep" className="font-display text-4xl font-bold text-slate-500">:</div>
                ) : (
                  <div key={t[0]} className="text-center">
                    <div className="text-lg font-semibold md:text-xl">{t[1]}</div>
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <button onClick={() => setScores({ ...scores, [t[0]]: Math.max(0, scores[t[0]] - 1) })} className="rounded-lg bg-navy-950 p-2 hover:bg-navy-600"><Minus size={18} /></button>
                      <input
                        type="number"
                        min="0"
                        value={scores[t[0]]}
                        onChange={(e) => setScores({ ...scores, [t[0]]: Math.max(0, Number(e.target.value)) })}
                        className="w-24 rounded-xl border border-white/10 bg-navy-950 py-3 text-center font-display text-5xl font-bold text-brand-green outline-none focus:border-brand-green"
                      />
                      <button onClick={() => setScores({ ...scores, [t[0]]: scores[t[0]] + 1 })} className="rounded-lg bg-navy-950 p-2 hover:bg-navy-600"><Plus size={18} /></button>
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Match status</label>
                <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option>Scheduled</option><option>Live</option><option>Completed</option>
                </select>
              </div>
              <div>
                <label className="label">Scorers / remarks</label>
                <input className="input" placeholder="e.g. Arjun 24', Karan 61'" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-400"><Lock size={16} className="text-amber-400" /> Only authorized officials can publish official results.</div>
            <div className="flex gap-3">
              <button className="btn-secondary"><Save size={16} /> Save</button>
              <button onClick={() => setConfirm(true)} className="btn-primary"><Send size={16} /> Publish Result</button>
            </div>
          </div>

          {done && (
            <div className="flex items-center justify-between rounded-xl border border-brand-green/30 bg-brand-green/10 p-4 text-sm text-brand-green">
              <span className="flex items-center gap-2"><CheckCircle2 size={18} /> Result published. Standings updated.</span>
              <Link to="/matches" className="font-semibold underline">View standings</Link>
            </div>
          )}
        </div>

        {/* Standings preview */}
        <aside className="card h-fit overflow-hidden">
          <div className="border-b border-white/5 p-5">
            <div className="font-semibold">Standings preview · {match.round}</div>
            <div className="text-xs text-slate-400">If this result is published (W 3 · D 1 · L 0)</div>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-slate-400">
              <tr><th className="px-4 py-2 text-left">Team</th><th className="px-2 py-2">P</th><th className="px-2 py-2">GD</th><th className="px-4 py-2">Pts</th></tr>
            </thead>
            <tbody>
              {preview.map((s, i) => (
                <tr key={s.team} className={`border-t border-white/5 ${[match.teamA, match.teamB].includes(s.team) ? 'bg-brand-blue/10' : ''}`}>
                  <td className="px-4 py-3">{i + 1}. {s.team}</td>
                  <td className="px-2 py-3 text-center">{s.P}</td>
                  <td className="px-2 py-3 text-center">{s.GF - s.GA}</td>
                  <td className="px-4 py-3 text-center font-bold text-brand-green">{s.Pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="card w-full max-w-md p-6">
            <h3 className="text-xl font-bold">Publish official result?</h3>
            <p className="mt-2 text-sm text-slate-300">
              {match.teamA} <b className="text-brand-green">{scores.a} – {scores.b}</b> {match.teamB}
            </p>
            <p className="mt-2 text-sm text-slate-400">Publishing will update tournament standings automatically and notify both teams.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setConfirm(false)} className="btn-secondary">Cancel</button>
              <button onClick={publish} className="btn-primary">Confirm & Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
