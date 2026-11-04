import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw, Pencil, Copy, Check, Send, MapPin, Trophy, Info } from 'lucide-react'
import { PageHeader, AIBadge, StatusBadge, SampleDataNote, useToast } from '../components/ui'
import { loadFixtures } from './Matches'
import { recapText, captionText } from '../lib/smartText'
import { copyText, storage } from '../lib/storage'

const TONES = ['Exciting', 'Formal', 'Short']

export default function MatchRecap() {
  const completed = useMemo(() => loadFixtures().filter((f) => f.status === 'Completed' && f.scoreA !== null && f.scoreB !== null), [])
  const [matchId, setMatchId] = useState(completed[completed.length - 1]?.id || '')
  const [tone, setTone] = useState('Exciting')
  const [variant, setVariant] = useState(0)
  const [capVariant, setCapVariant] = useState(0)
  const [editing, setEditing] = useState(false)
  const [chosen, setChosen] = useState(0)
  const [published, setPublished] = useState(() => {
    const p = storage.get('ss-recaps', {})
    return p && typeof p === 'object' ? p : {}
  })
  const initialSummary = (id) => {
    const m = completed.find((x) => x.id === id)
    return m ? published[id]?.summary || recapText(m, 0) : ''
  }
  const [summary, setSummary] = useState(() => initialSummary(matchId))
  const [toast, showToast] = useToast()

  const match = completed.find((m) => m.id === matchId)
  const captions = match ? captionText(match, tone, capVariant) : []

  const chooseMatch = (id) => {
    setMatchId(id)
    setVariant(0)
    setCapVariant(0)
    setChosen(0)
    setEditing(false)
    setSummary(initialSummary(id))
  }
  const regenerate = () => {
    const v = variant + 1
    setVariant(v)
    setSummary(recapText(match, v))
    setEditing(false)
  }

  if (!match) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <Trophy size={36} className="mx-auto text-slate-500" />
        <h2 className="mt-4 text-xl font-bold">No completed matches yet</h2>
        <p className="mt-2 text-sm text-slate-400">Publish a result in Score Entry first, then come back to create a recap.</p>
        <Link to="/coordinator/scores" className="btn-primary mt-6">Go to Score Entry</Link>
      </div>
    )
  }

  const isPublished = !!published[match.id]
  const win = match.scoreA > match.scoreB ? 'A' : match.scoreB > match.scoreA ? 'B' : null

  const publish = () => {
    if (!summary.trim()) return showToast('The summary cannot be empty', 'error')
    const next = { ...published, [match.id]: { summary, caption: captions[chosen], at: new Date().toLocaleString('en-IN') } }
    setPublished(next)
    storage.set('ss-recaps', next)
    setEditing(false)
    showToast('Recap approved and published')
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title={<span className="flex flex-wrap items-center gap-3">AI Match Recap <AIBadge /></span>}
        description="Turn a published result into a short match summary and ready-to-post captions. The coordinator reviews everything before it goes out."
        actions={
          <select className="input w-72" value={matchId} onChange={(e) => chooseMatch(e.target.value)} aria-label="Choose match">
            {completed.map((m) => (
              <option key={m.id} value={m.id}>{m.id} · {m.teamA} {m.scoreA}–{m.scoreB} {m.teamB}{published[m.id] ? ' ✓' : ''}</option>
            ))}
          </select>
        }
      />

      {/* Scoreboard */}
      <section className="card mb-6 bg-gradient-to-br from-navy-800 to-navy-700 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-400">
          <span>Inter-Department Football Cup · {match.round}</span>
          <span className="flex items-center gap-2">{isPublished && <StatusBadge status="Approved">Recap published</StatusBadge>}<StatusBadge status="Completed">Full time</StatusBadge></span>
        </div>
        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
          <div>
            <div className={`text-xl font-bold md:text-2xl ${win === 'A' ? 'text-brand-green' : ''}`}>{match.teamA}</div>
            {win === 'A' && <div className="mt-1 text-xs uppercase tracking-widest text-brand-green">Winner</div>}
          </div>
          <div className="font-display text-5xl font-bold md:text-6xl">
            <span className={win === 'A' ? 'text-brand-green' : ''}>{match.scoreA}</span>
            <span className="mx-3 text-slate-500">–</span>
            <span className={win === 'B' ? 'text-brand-green' : ''}>{match.scoreB}</span>
          </div>
          <div>
            <div className={`text-xl font-bold md:text-2xl ${win === 'B' ? 'text-brand-green' : ''}`}>{match.teamB}</div>
            {win === 'B' && <div className="mt-1 text-xs uppercase tracking-widest text-brand-green">Winner</div>}
          </div>
        </div>
        <div className="mt-5 flex justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1"><MapPin size={13} /> {match.venue}</span>
          <span>{match.date} · {match.time}</span>
        </div>
      </section>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="eyebrow">Caption tone</span>
        {TONES.map((t) => (
          <button key={t} onClick={() => { setTone(t); setChosen(0) }} className={`rounded-full px-4 py-1.5 text-sm ${tone === t ? 'bg-brand-green font-semibold text-navy-950' : 'bg-navy-800 text-slate-300'}`}>{t}</button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card flex flex-col p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Match Summary</h2>
            <AIBadge label="AI draft" />
          </div>
          {editing ? (
            <textarea className="input mt-4 min-h-[180px] flex-1 resize-y leading-relaxed" value={summary} onChange={(e) => setSummary(e.target.value)} aria-label="Edit summary" />
          ) : (
            <p className="mt-4 flex-1 rounded-lg bg-navy-950/60 p-4 leading-relaxed text-slate-200">{summary}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500">{summary.trim().split(/\s+/).filter(Boolean).length} words</span>
            <div className="flex gap-2">
              <button onClick={() => setEditing(!editing)} className="btn-secondary px-3 py-1.5">{editing ? <><Check size={15} /> Done</> : <><Pencil size={15} /> Edit</>}</button>
              <button onClick={regenerate} className="btn-secondary px-3 py-1.5"><RefreshCw size={15} /> Regenerate</button>
            </div>
          </div>
        </section>

        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Social Media Captions</h2>
            <button onClick={() => { setCapVariant((v) => v + 1); setChosen(0) }} className="text-xs text-blue-300 hover:underline">New options</button>
          </div>
          <p className="mt-1 text-xs text-slate-400">Select one caption to publish with the recap.</p>
          <div className="mt-4 space-y-3">
            {captions.map((c, i) => (
              <div
                key={i}
                role="radio"
                aria-checked={chosen === i}
                tabIndex={0}
                onClick={() => setChosen(i)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setChosen(i)}
                className={`cursor-pointer rounded-xl border p-4 transition ${chosen === i ? 'border-brand-green bg-brand-green/5' : 'border-white/10 hover:border-white/20'}`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Option {i + 1}{chosen === i && <span className="ml-2 text-brand-green">· Selected</span>}</span>
                  <button
                    onClick={async (e) => { e.stopPropagation(); showToast((await copyText(c)) ? 'Caption copied' : 'Copy not allowed in this browser') }}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                  >
                    <Copy size={13} /> Copy
                  </button>
                </div>
                <p className="text-sm">{c}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="card mt-6 flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <p className="flex items-start gap-2 text-sm text-slate-400">
          <Info size={16} className="mt-0.5 shrink-0" />
          {isPublished ? `Published ${published[match.id].at}. You can edit and publish again to update it.` : 'AI-generated text is a draft. Review it, then approve to publish to the Sports Sphere news feed.'}
        </p>
        <button onClick={publish} className="btn-primary px-6 py-3"><Send size={16} /> {isPublished ? 'Update & Publish' : 'Approve & Publish'}</button>
      </section>
      {toast}
      <SampleDataNote />
    </div>
  )
}
