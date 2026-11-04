import { useMemo, useState } from 'react'
import { Dumbbell, Wand2, Timer, Flame, CheckCircle2, Info, CalendarDays, RotateCcw } from 'lucide-react'
import { PageHeader, AIBadge, Progress, SampleDataNote, useToast } from '../components/ui'
import { drills } from '../data/smartData'
import { events } from '../data/mockData'
import { trainingPlan } from '../lib/smartText'
import { storage } from '../lib/storage'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const intensityStyle = {
  Light: 'bg-brand-green/15 text-brand-green',
  Medium: 'bg-amber-500/15 text-amber-300',
  Hard: 'bg-red-500/15 text-red-300',
}
const TIPS = [
  'Warm up for 10 minutes before every session.',
  'Drink water before, during and after training.',
  'Sleep 7–8 hours, especially in the week of the event.',
  'Stop and rest if you feel pain, not just tiredness.',
]

function load() {
  const s = storage.get('ss-coach', null)
  return s && typeof s === 'object' && Array.isArray(s.plan) ? s : null
}

export default function TrainingCoach() {
  const saved = load()
  const [form, setForm] = useState(saved?.form || { sport: 'Badminton', level: 'Intermediate', eventId: 'badminton-open', days: 4 })
  const [plan, setPlan] = useState(saved?.plan || null)
  const [done, setDone] = useState(saved?.done || {})
  const [week, setWeek] = useState(0)
  const [toast, showToast] = useToast()

  const sportEvents = events.filter((e) => e.sport === form.sport && e.status !== 'Completed')
  const event = events.find((e) => e.id === form.eventId && e.sport === form.sport)

  const daysLeft = useMemo(() => {
    if (!event) return null
    const start = new Date(`${event.startDate}T00:00:00`)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return Math.round((start - today) / 86400000)
  }, [event])

  const persist = (next) => storage.set('ss-coach', next)

  const generate = () => {
    const p = trainingPlan({ library: drills[form.sport], level: form.level, daysPerWeek: Number(form.days) })
    setPlan(p)
    setDone({})
    setWeek(0)
    persist({ form, plan: p, done: {} })
    showToast('New 4-week plan ready')
  }

  const toggle = (id) => {
    const next = { ...done, [id]: !done[id] }
    setDone(next)
    persist({ form, plan, done: next })
  }

  const allSessions = plan ? plan.flatMap((w) => w.days) : []
  const doneCount = allSessions.filter((d) => done[d.id]).length
  const current = plan?.[week]

  const onSport = (sport) => {
    const firstEvent = events.find((e) => e.sport === sport && e.status !== 'Completed')
    setForm({ ...form, sport, eventId: firstEvent?.id || '' })
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title={<span className="flex flex-wrap items-center gap-3">Training Coach <AIBadge /></span>}
        description="Get a simple 4-week practice plan for your sport, level and upcoming event."
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-6">
          <section className="card space-y-4 p-5">
            <h2 className="flex items-center gap-2 font-semibold"><Dumbbell size={18} className="text-brand-green" /> Your goal</h2>
            <div>
              <label className="label">Sport</label>
              <select className="input" value={form.sport} onChange={(e) => onSport(e.target.value)}>
                {Object.keys(drills).map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Skill level</label>
              <div className="grid grid-cols-3 rounded-lg bg-navy-950 p-1">
                {LEVELS.map((l) => (
                  <button key={l} onClick={() => setForm({ ...form, level: l })} className={`rounded-md py-1.5 text-xs font-semibold ${form.level === l ? 'bg-brand-green text-navy-950' : 'text-slate-400'}`}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Upcoming event</label>
              <select className="input" value={form.eventId} onChange={(e) => setForm({ ...form, eventId: e.target.value })}>
                {sportEvents.length === 0 && <option value="">No upcoming event</option>}
                {sportEvents.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Training days per week: <b className="text-white">{form.days}</b></label>
              <input type="range" min="2" max="6" value={form.days} onChange={(e) => setForm({ ...form, days: Number(e.target.value) })} className="w-full accent-green-500" />
            </div>
            <button onClick={generate} className="btn-primary w-full py-3"><Wand2 size={16} /> {plan ? 'Generate New Plan' : 'Generate My Plan'}</button>
          </section>

          <section className="card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-brand-blue/15 p-2.5 text-blue-300"><CalendarDays size={20} /></div>
              <div>
                <div className="eyebrow">Countdown</div>
                {event ? (
                  daysLeft > 0 ? <div className="font-display text-2xl font-bold">{daysLeft} days</div> : <div className="font-semibold text-slate-300">{daysLeft === 0 ? 'Event is today!' : 'Event has started'}</div>
                ) : (
                  <div className="text-sm text-slate-400">No event selected</div>
                )}
              </div>
            </div>
            {event && <p className="mt-2 text-xs text-slate-400">{event.name} · starts {event.startDate}</p>}
            {event && daysLeft !== null && daysLeft > 0 && daysLeft < 28 && (
              <p className="mt-2 text-xs text-amber-300">
                Less than 4 weeks left —{' '}
                {daysLeft <= 7 ? 'focus on week 4 and keep sessions light before the event.' : `start from week ${5 - Math.ceil(daysLeft / 7)} of the plan.`}
              </p>
            )}
          </section>

          <section className="card p-5">
            <h3 className="font-semibold">Coach tips</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {TIPS.map((t) => <li key={t} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-green" /> {t}</li>)}
            </ul>
          </section>
        </aside>

        <section className="space-y-6">
          {!plan ? (
            <div className="card p-12 text-center">
              <Dumbbell size={40} className="mx-auto text-slate-500" />
              <h2 className="mt-4 text-xl font-bold">No plan yet</h2>
              <p className="mt-2 text-sm text-slate-400">Choose your sport, level and event, then press <b>Generate My Plan</b>.</p>
            </div>
          ) : (
            <>
              <div className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{form.sport} · {form.level} · {form.days} days/week</div>
                    <div className="text-xs text-slate-400">{doneCount} of {allSessions.length} sessions completed</div>
                  </div>
                  <button onClick={() => { setDone({}); persist({ form, plan, done: {} }) }} className="btn-secondary px-3 py-1.5 text-xs"><RotateCcw size={13} /> Reset progress</button>
                </div>
                <div className="mt-3"><Progress value={doneCount} max={allSessions.length || 1} /></div>
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {plan.map((w, i) => {
                  const wDone = w.days.filter((d) => done[d.id]).length
                  return (
                    <button key={w.week} onClick={() => setWeek(i)} className={`shrink-0 rounded-xl px-5 py-3 text-left ${week === i ? 'bg-brand-green text-navy-950' : 'bg-navy-800 text-slate-300'}`}>
                      <div className="text-sm font-bold">Week {w.week}</div>
                      <div className={`text-xs ${week === i ? 'text-navy-900' : 'text-slate-500'}`}>{wDone}/{w.days.length} done</div>
                    </button>
                  )
                })}
              </div>

              {current && (
                <div className="card p-6">
                  <div className="eyebrow text-brand-green">Week {current.week} focus</div>
                  <h2 className="mt-1 text-2xl font-bold">{current.focus}</h2>
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {current.days.map((d, i) => (
                      <label key={d.id} className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${done[d.id] ? 'border-brand-green/40 bg-brand-green/5' : 'border-white/10 hover:border-white/20'}`}>
                        <input type="checkbox" className="mt-1 h-4 w-4 accent-green-500" checked={!!done[d.id]} onChange={() => toggle(d.id)} />
                        <div className="flex-1">
                          <div className="text-xs text-slate-500">Session {i + 1}</div>
                          <div className={`font-semibold ${done[d.id] ? 'text-slate-400 line-through' : ''}`}>{d.title}</div>
                          <div className="mt-2 flex gap-2 text-xs">
                            <span className="badge bg-navy-950 text-slate-300"><Timer size={11} /> {d.minutes} min</span>
                            <span className={`badge ${intensityStyle[d.intensity]}`}><Flame size={11} /> {d.intensity}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          <p className="flex items-start gap-2 text-xs text-slate-500">
            <Info size={14} className="mt-0.5 shrink-0" /> General practice guidance only. Follow your coach's advice and stop if anything hurts.
          </p>
        </section>
      </div>
      {toast}
      <SampleDataNote />
    </div>
  )
}
