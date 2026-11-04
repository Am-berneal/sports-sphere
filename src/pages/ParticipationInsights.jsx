import { useMemo, useState } from 'react'
import { UserX, Building2, Sparkles, Send, Pencil, Check, Lightbulb, Info, CheckCircle2 } from 'lucide-react'
import { PageHeader, AIBadge, StatCard, BarList, Avatar, SampleDataNote, useToast } from '../components/ui'
import { inactiveStudents, beginnerEvents, DEPTS, enrolled, activeStudents } from '../data/smartData'
import { nudgeText } from '../lib/smartText'
import { storage } from '../lib/storage'

const LOW = 35 // a department is "low turnout" below this % of students active

export default function ParticipationInsights() {
  const [tab, setTab] = useState('All')
  const [selectedId, setSelectedId] = useState(inactiveStudents[0].id)
  const [tone, setTone] = useState('Friendly')
  const [edits, setEdits] = useState({})
  const [editing, setEditing] = useState(false)
  const [sent, setSent] = useState(() => {
    const s = storage.get('ss-nudges', {})
    return s && typeof s === 'object' ? s : {}
  })
  const [toast, showToast] = useToast()

  const rates = useMemo(
    () => DEPTS.map((d) => ({ label: d, value: Math.round((activeStudents[d] / enrolled[d]) * 100) })).sort((a, b) => b.value - a.value),
    []
  )
  const lowDepts = rates.filter((r) => r.value < LOW).map((r) => r.label)

  const list = inactiveStudents.filter((s) =>
    tab === 'All' ? true : tab === 'First year' ? s.year === '1st year' : tab === 'Low-turnout depts' ? lowDepts.includes(s.dept) : true
  )
  const student = inactiveStudents.find((s) => s.id === selectedId) || inactiveStudents[0]
  const event = beginnerEvents[student.interest]
  const key = `${student.id}-${tone}`
  const message = edits[key] ?? nudgeText(student, event, tone)

  const send = (s, msg) => {
    const next = { ...sent, [s.id]: { at: new Date().toLocaleString('en-IN'), msg } }
    setSent(next)
    storage.set('ss-nudges', next)
    showToast(`Nudge sent to ${s.name.split(' ')[0]}`)
  }
  const sendAll = () => {
    const pending = list.filter((s) => !sent[s.id])
    if (!pending.length) return showToast('Everyone in this list has already been nudged')
    const next = { ...sent }
    pending.forEach((s) => (next[s.id] = { at: new Date().toLocaleString('en-IN'), msg: nudgeText(s, beginnerEvents[s.interest], tone) }))
    setSent(next)
    storage.set('ss-nudges', next)
    showToast(`${pending.length} nudges sent`)
  }

  const lowest = rates[rates.length - 1]

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title={<span className="flex flex-wrap items-center gap-3">Participation Insights <AIBadge /></span>}
        description="Find students who have stopped playing and invite them back with a friendly, personalised message."
        actions={<button onClick={sendAll} className="btn-primary"><Send size={16} /> Nudge everyone in list</button>}
      />

      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <StatCard label="Inactive students (30+ days)" value={inactiveStudents.length} hint={`${Object.keys(sent).length} already nudged`} icon={UserX} accent="amber" />
        <StatCard label="Low-turnout departments" value={lowDepts.length} hint={`Below ${LOW}% of students active`} icon={Building2} accent="red" />
        <StatCard label="Beginner-friendly events" value={Object.keys(beginnerEvents).length} hint="Open this month" icon={Sparkles} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <section className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Inactive students</h2>
            <div className="flex rounded-xl bg-navy-950 p-1">
              {['All', 'First year', 'Low-turnout depts'].map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-3 py-1.5 text-xs ${tab === t ? 'bg-navy-700 font-semibold text-brand-green' : 'text-slate-400'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {list.length === 0 && <p className="py-6 text-center text-sm text-slate-500">No students in this view.</p>}
            {list.map((s) => (
              <div
                key={s.id}
                onClick={() => { setSelectedId(s.id); setEditing(false) }}
                className={`cursor-pointer rounded-xl border p-4 transition ${selectedId === s.id ? 'border-brand-green/50 bg-brand-green/5' : 'border-white/5 bg-navy-950/40 hover:border-white/15'}`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Avatar name={s.name} />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-slate-400">{s.dept} · {s.year} · last played {s.lastSport.toLowerCase()} {s.lastActive} days ago</div>
                  </div>
                  {sent[s.id] ? (
                    <span className="badge bg-brand-green/15 text-brand-green"><CheckCircle2 size={12} /> Nudged</span>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); send(s, nudgeText(s, beginnerEvents[s.interest], tone)) }} className="btn-secondary px-3 py-1.5 text-xs">
                      <Send size={13} /> Send nudge
                    </button>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Suggested:</span>
                  <span className="badge bg-brand-blue/10 text-blue-300">{beginnerEvents[s.interest]}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="card p-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Nudge message</h2>
              <AIBadge label="AI draft" />
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-lg bg-navy-950/60 p-3">
              <Avatar name={student.name} size="sm" />
              <div className="text-sm">
                To: <b>{student.name}</b>
                <div className="text-xs text-slate-500">via Sports Sphere notification + email</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 rounded-lg bg-navy-950 p-1">
              {['Friendly', 'Formal', 'Short'].map((t) => (
                <button key={t} onClick={() => { setTone(t); setEditing(false) }} className={`rounded-md py-1.5 text-xs font-semibold ${tone === t ? 'bg-brand-blue text-white' : 'text-slate-400'}`}>{t}</button>
              ))}
            </div>
            {editing ? (
              <textarea className="input mt-3 h-36 resize-none" value={message} onChange={(e) => setEdits({ ...edits, [key]: e.target.value })} aria-label="Edit message" />
            ) : (
              <p className="mt-3 rounded-lg border border-white/10 bg-navy-950/60 p-4 text-sm leading-relaxed">{message}</p>
            )}
            <div className="mt-3 rounded-lg bg-brand-blue/5 p-3 text-xs text-blue-200">
              Suggested event: <b>{event}</b>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => setEditing(!editing)} className="btn-secondary">{editing ? <><Check size={15} /> Done</> : <><Pencil size={15} /> Edit</>}</button>
              <button
                disabled={!!sent[student.id] || !message.trim()}
                onClick={() => send(student, message)}
                className="btn-primary disabled:opacity-50"
              >
                <Send size={15} /> {sent[student.id] ? 'Sent' : 'Send'}
              </button>
            </div>
            {sent[student.id] && <p className="mt-2 text-center text-xs text-slate-500">Sent {sent[student.id].at}</p>}
          </section>
        </aside>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px]">
        <section className="card p-6">
          <h2 className="font-semibold">Students active this semester, by department</h2>
          <p className="mb-5 text-xs text-slate-400">Percentage of enrolled students who played at least one event. Amber = below {LOW}%.</p>
          <BarList rows={rates} unit="%" lowBelow={LOW} />
        </section>
        <section className="card p-6">
          <div className="flex items-center gap-2 font-semibold"><Lightbulb size={18} className="text-amber-300" /> AI insight</div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            <b className="text-white">{lowest.label}</b> has the lowest participation ({lowest.value}%).
            Consider a beginner-friendly <b className="text-white">evening league</b> and promoting it in the weekly digest for {lowDepts.length > 1 ? `${lowDepts.slice(0, -1).join(', ')} and ${lowDepts[lowDepts.length - 1]}` : lowDepts[0] || 'these departments'}.
          </p>
          <p className="mt-4 flex items-start gap-2 text-xs text-slate-500">
            <Info size={14} className="mt-0.5 shrink-0" /> Suggestions only. The coordinator decides who to contact.
          </p>
        </section>
      </div>
      {toast}
      <SampleDataNote />
    </div>
  )
}
