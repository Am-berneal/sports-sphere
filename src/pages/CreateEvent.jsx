import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Users, Upload, Save, Rocket, Trash2, CheckCircle2, MapPin } from 'lucide-react'
import { PageHeader } from '../components/ui'
import { SPORTS, facilities } from '../data/mockData'

const formats = [
  ['Knockout', 'Single elimination bracket'],
  ['League', 'Round robin series'],
  ['Hybrid', 'Group stage + knockout'],
]

const scopes = ['Undergraduate students', 'Postgraduate students', 'Faculty & staff']

export default function CreateEvent() {
  const [form, setForm] = useState({
    name: '', sport: 'Football', type: 'Team', format: 'Knockout',
    minSize: 7, maxSize: 15, maxEntries: 16, start: '', end: '', deadline: '',
    venue: facilities[0].id, rules: '', scope: ['Undergraduate students'],
  })
  const [published, setPublished] = useState(false)
  const set = (k, v) => setForm({ ...form, [k]: v })

  const errors = []
  if (!form.name.trim()) errors.push('Event title is required.')
  if (form.type === 'Team' && Number(form.minSize) > Number(form.maxSize)) errors.push('Min roster size cannot exceed max.')
  if (form.start && form.end && form.end < form.start) errors.push('End date must be after start date.')
  if (form.deadline && form.start && form.deadline > form.start) errors.push('Registration deadline must be before the start date.')

  if (published) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <CheckCircle2 size={56} className="mx-auto text-brand-green" />
        <h1 className="mt-4 text-3xl font-bold">Event published</h1>
        <p className="mt-2 text-slate-400">"{form.name}" is now visible to students and open for registration.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/events" className="btn-primary">View Events</Link>
          <button className="btn-secondary" onClick={() => setPublished(false)}>Create another</button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Coordinator desk"
        title="Create New Tournament or Event"
        description="Configure rules, registration limits, schedule and venue."
      />

      <div className="card space-y-10 p-6 md:p-8">
        <Section n="1" title="Basic Information" color="bg-brand-green">
          <div>
            <label className="label">Event title *</label>
            <input className="input" placeholder="e.g. Inter-Department Football Cup" value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Sport</label>
              <select className="input" value={form.sport} onChange={(e) => set('sport', e.target.value)}>
                {SPORTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Participation type</label>
              <div className="grid grid-cols-2 rounded-lg bg-navy-950 p-1">
                {[['Individual', User], ['Team', Users]].map(([t, Icon]) => (
                  <button key={t} onClick={() => set('type', t)} className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm ${form.type === t ? 'bg-brand-green font-semibold text-navy-950' : 'text-slate-400'}`}>
                    <Icon size={15} /> {t === 'Team' ? 'Team sport' : 'Individual'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="label">Tournament format</label>
            <div className="grid gap-3 sm:grid-cols-3">
              {formats.map(([f, d]) => (
                <button key={f} onClick={() => set('format', f)} className={`rounded-xl border p-4 text-left ${form.format === f ? 'border-brand-green bg-brand-green/5' : 'border-white/10 hover:border-white/20'}`}>
                  <div className="flex items-center justify-between font-semibold">
                    {f}
                    <span className={`h-4 w-4 rounded-full border-2 ${form.format === f ? 'border-brand-green bg-brand-green' : 'border-slate-500'}`} />
                  </div>
                  <div className="mt-1 text-xs text-slate-400">{d}</div>
                </button>
              ))}
            </div>
          </div>
        </Section>

        <Section n="2" title="Participation Criteria" color="bg-brand-blue">
          <div className="grid gap-4 sm:grid-cols-3">
            {form.type === 'Team' && (
              <>
                <Num label="Min roster size" value={form.minSize} onChange={(v) => set('minSize', v)} />
                <Num label="Max roster size" value={form.maxSize} onChange={(v) => set('maxSize', v)} />
              </>
            )}
            <Num label={form.type === 'Team' ? 'Max team entries' : 'Max players'} value={form.maxEntries} onChange={(v) => set('maxEntries', v)} />
          </div>
          <div>
            <label className="label">Eligibility</label>
            <div className="flex flex-wrap gap-2">
              {scopes.map((s) => {
                const on = form.scope.includes(s)
                return (
                  <button
                    key={s}
                    onClick={() => set('scope', on ? form.scope.filter((x) => x !== s) : [...form.scope, s])}
                    className={`rounded-full border px-3 py-1.5 text-sm ${on ? 'border-brand-green/50 bg-brand-green/10 text-brand-green' : 'border-white/10 text-slate-400'}`}
                  >
                    {on ? '✓ ' : '+ '}{s}
                  </button>
                )
              })}
            </div>
          </div>
        </Section>

        <Section n="3" title="Dates & Deadlines" color="bg-purple-400">
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label className="label">Start date</label><input type="date" className="input [color-scheme:dark]" value={form.start} onChange={(e) => set('start', e.target.value)} /></div>
            <div><label className="label">End date</label><input type="date" className="input [color-scheme:dark]" value={form.end} onChange={(e) => set('end', e.target.value)} /></div>
            <div><label className="label">Registration deadline</label><input type="date" className="input [color-scheme:dark]" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} /></div>
          </div>
        </Section>

        <Section n="4" title="Venue" color="bg-brand-green">
          <div>
            <label className="label">Facility</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <select className="input pl-9" value={form.venue} onChange={(e) => set('venue', e.target.value)}>
                {facilities.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <p className="mt-2 text-xs text-slate-500">Match slots will be checked against existing facility bookings when fixtures are published.</p>
          </div>
        </Section>

        <Section n="5" title="Rules & Banner" color="bg-brand-blue">
          <div>
            <label className="label">Rules summary</label>
            <textarea className="input h-28 resize-none" placeholder="Kit rules, referee protocol, tie-breakers…" value={form.rules} onChange={(e) => set('rules', e.target.value)} />
          </div>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 p-8 text-sm text-slate-400 hover:border-brand-green/40">
            <Upload size={24} />
            Upload banner image (16:9, PNG/JPG)
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </Section>

        {errors.length > 0 && (
          <ul className="space-y-1 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
            {errors.map((e) => <li key={e}>• {e}</li>)}
          </ul>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/coordinator" className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400"><Trash2 size={16} /> Discard</Link>
          <div className="flex gap-3">
            <button className="btn-secondary"><Save size={16} /> Save Draft</button>
            <button disabled={errors.length > 0} onClick={() => setPublished(true)} className="btn-primary disabled:cursor-not-allowed disabled:opacity-40">
              <Rocket size={16} /> Publish Event
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ n, title, color, children }) {
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-3 text-lg font-semibold">
        <span className={`h-5 w-1 rounded ${color}`} /> {n}. {title}
      </h2>
      {children}
    </section>
  )
}

function Num({ label, value, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type="number" min="1" className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

