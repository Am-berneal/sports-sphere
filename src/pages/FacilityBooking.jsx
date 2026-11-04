import { useMemo, useState } from 'react'
import { AlertTriangle, CalendarPlus, CheckCircle2, ChevronLeft, ChevronRight, Info, Users, Search } from 'lucide-react'
import { PageHeader, SampleDataNote } from '../components/ui'
import { facilities, initialBookings, findConflict } from '../data/mockData'
import { getRole } from '../components/Layout'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const HOURS = [6, 8, 10, 12, 14, 16, 18, 20]
const fmt = (h) => `${((h + 11) % 12) + 1}:00 ${h < 12 ? 'AM' : 'PM'}`

const slotStyle = {
  Approved: 'border-brand-green/40 bg-brand-green/15 text-brand-green',
  Pending: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
  Closed: 'border-white/10 bg-slate-600/30 text-slate-300',
  Mine: 'border-brand-blue/50 bg-brand-blue/20 text-blue-200',
}

export default function FacilityBooking() {
  const role = getRole()
  const [facility, setFacility] = useState('football')
  const [bookings, setBookings] = useState(initialBookings)
  const [form, setForm] = useState({ day: 3, start: 17, end: 19, purpose: 'Team practice', people: 22 })
  const [type, setType] = useState('All')
  const [message, setMessage] = useState(null)

  const current = facilities.find((f) => f.id === facility)
  const req = { facility, day: Number(form.day), start: Number(form.start), end: Number(form.end) }
  const invalid = req.end <= req.start
  const conflict = invalid ? null : findConflict(bookings, req)

  const nextFree = useMemo(() => {
    if (!conflict) return null
    const len = req.end - req.start
    for (let d = req.day; d < 5; d++) {
      for (let s = d === req.day ? conflict.end : 6; s + len <= 22; s++) {
        if (!findConflict(bookings, { facility, day: d, start: s, end: s + len })) return { day: d, start: s, end: s + len }
      }
    }
    return null
  }, [conflict, bookings, facility, req.day, req.start, req.end])

  const submit = () => {
    if (conflict || invalid) return
    setBookings([...bookings, { id: Date.now(), ...req, title: form.purpose, by: 'You', status: 'Pending', mine: true }])
    setMessage('Booking requested. Status: Pending coordinator approval.')
  }

  const approve = (id, status) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)))
  }

  const cellBookings = (day, hour) =>
    // show each booking in the 2-hour row where it starts
    bookings.filter((b) => b.facility === facility && b.day === day && b.start >= hour && b.start < hour + 2)

  const filteredFacilities = facilities.filter((f) => type === 'All' || f.type === type)
  const pending = bookings.filter((b) => b.status === 'Pending')

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow={`${facilities.length} facilities listed`}
        title="Sports Facility Booking"
        description="Check availability and request a slot. Overlapping requests with approved bookings are blocked automatically."
        actions={
          <div className="flex rounded-xl bg-navy-950 p-1">
            {['All', 'Indoor', 'Outdoor'].map((t) => (
              <button key={t} onClick={() => setType(t)} className={`rounded-lg px-4 py-1.5 text-sm ${type === t ? 'bg-brand-green font-semibold text-navy-950' : 'text-slate-400'}`}>
                {t === 'All' ? 'All Sports' : t}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px] 2xl:grid-cols-[250px_1fr_320px]">
        {/* Facility list */}
        <div className="grid gap-3 sm:grid-cols-2 xl:col-span-2 xl:grid-cols-6 2xl:col-span-1 2xl:block 2xl:space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input pl-9" placeholder="Search courts, grounds…" />
          </div>
          {filteredFacilities.map((f) => (
            <button
              key={f.id}
              onClick={() => { setFacility(f.id); setMessage(null) }}
              className={`card flex w-full gap-3 p-3 text-left transition ${facility === f.id ? 'border-brand-green' : 'hover:border-white/20'}`}
            >
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                <img src={f.image} alt="" className="h-full w-full object-cover" />
                <span className="absolute bottom-1 left-1 rounded bg-navy-950/80 px-1.5 text-[9px] font-semibold uppercase">{f.type}</span>
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{f.name}</div>
                <div className="text-xs text-slate-400">Capacity {f.capacity}</div>
                {facility === f.id && <span className="badge mt-1 bg-brand-green/15 text-brand-green">Selected</span>}
              </div>
            </button>
          ))}
        </div>

        {/* Calendar */}
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 p-5">
            <div>
              <h2 className="text-lg font-semibold">{current.name} · Weekly Availability</h2>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                {[['bg-slate-500', 'Closed'], ['bg-amber-500', 'Pending'], ['bg-brand-green', 'Approved'], ['bg-brand-blue', 'Your booking'], ['bg-red-500', 'Conflict']].map(([c, l]) => (
                  <span key={l} className="flex items-center gap-1.5"><span className={`h-2.5 w-2.5 rounded-sm ${c}`} /> {l}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <button className="btn-secondary px-2 py-1"><ChevronLeft size={16} /></button>
              <span className="text-slate-300">Week of Nov 9</span>
              <button className="btn-secondary px-2 py-1"><ChevronRight size={16} /></button>
            </div>
          </div>
          <div className="overflow-x-auto p-4">
            <div className="grid min-w-[640px] grid-cols-[70px_repeat(5,1fr)] gap-2">
              <div />
              {DAYS.map((d, i) => (
                <div key={d} className={`rounded-lg py-2 text-center text-sm font-semibold ${i === Number(form.day) ? 'border border-brand-green/50 bg-brand-green/10 text-brand-green' : 'bg-navy-950/60'}`}>
                  {d}
                </div>
              ))}
              {HOURS.map((h) => (
                <Row key={h} hour={h} days={DAYS} cellBookings={cellBookings} req={req} conflict={conflict} invalid={invalid} />
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold"><CalendarPlus size={20} className="text-brand-green" /> Request Facility Slot</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="label">Selected facility</label>
                <select className="input" value={facility} onChange={(e) => setFacility(e.target.value)}>
                  {facilities.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Day</label>
                <select className="input" value={form.day} onChange={(e) => { setForm({ ...form, day: e.target.value }); setMessage(null) }}>
                  {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['start', 'end'].map((k) => (
                  <div key={k}>
                    <label className="label">{k === 'start' ? 'Start time' : 'End time'}</label>
                    <select className="input" value={form[k]} onChange={(e) => { setForm({ ...form, [k]: e.target.value }); setMessage(null) }}>
                      {Array.from({ length: 17 }, (_, i) => i + 6).map((h) => <option key={h} value={h}>{fmt(h)}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {invalid && <p className="text-xs text-red-400">End time must be after start time.</p>}

              {conflict && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-red-300"><AlertTriangle size={18} /> Conflict detected</div>
                  <p className="mt-2 text-red-200/90">
                    This slot overlaps with an existing booking: <b>"{conflict.title}"</b> ({fmt(conflict.start)} – {fmt(conflict.end)}).
                  </p>
                  {nextFree && (
                    <button
                      onClick={() => setForm({ ...form, day: nextFree.day, start: nextFree.start, end: nextFree.end })}
                      className="mt-3 text-xs font-semibold text-brand-green hover:underline"
                    >
                      Next available: {DAYS[nextFree.day]} {fmt(nextFree.start)} – {fmt(nextFree.end)} → use this
                    </button>
                  )}
                </div>
              )}

              <div>
                <label className="label">Purpose</label>
                <input className="input" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
              </div>
              <div>
                <label className="label">Expected attendees</label>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-500" />
                  <input type="number" min="1" max={current.capacity} className="input" value={form.people} onChange={(e) => setForm({ ...form, people: e.target.value })} />
                </div>
                {Number(form.people) > current.capacity && <p className="mt-1 text-xs text-amber-400">Exceeds facility capacity ({current.capacity}).</p>}
              </div>

              <div className="flex gap-2 rounded-lg bg-navy-950/60 p-3 text-xs text-slate-400">
                <Info size={16} className="shrink-0" /> Bookings require coordinator approval.
              </div>

              {message ? (
                <div className="flex items-center gap-2 rounded-lg border border-brand-green/30 bg-brand-green/10 p-3 text-sm text-brand-green">
                  <CheckCircle2 size={18} /> {message}
                </div>
              ) : (
                <button onClick={submit} disabled={!!conflict || invalid} className="btn-primary w-full py-3 disabled:cursor-not-allowed disabled:opacity-40">
                  {conflict ? 'Slot unavailable' : 'Request Booking'}
                </button>
              )}
            </div>
          </div>

          {role !== 'student' && (
            <div className="card p-5">
              <h3 className="font-semibold">Pending requests ({pending.length})</h3>
              <div className="mt-3 space-y-3">
                {pending.length === 0 && <p className="text-sm text-slate-400">Nothing to review.</p>}
                {pending.map((b) => (
                  <div key={b.id} className="rounded-lg bg-navy-950/60 p-3 text-sm">
                    <div className="font-medium">{b.title}</div>
                    <div className="text-xs text-slate-400">
                      {facilities.find((f) => f.id === b.facility).name} · {DAYS[b.day]} {fmt(b.start)}–{fmt(b.end)} · {b.by}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button className="btn-primary py-1" onClick={() => approve(b.id, 'Approved')}>Approve</button>
                      <button className="btn-danger py-1" onClick={() => approve(b.id, 'Rejected')}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <SampleDataNote />
    </div>
  )
}

function Row({ hour, days, cellBookings, req, conflict, invalid }) {
  return (
    <>
      <div className="pt-3 text-xs text-slate-500">{fmt(hour)}</div>
      {days.map((_, d) => {
        const list = cellBookings(d, hour).filter((b) => b.status !== 'Rejected')
        const isReq = !invalid && req.day === d && req.start >= hour && req.start < hour + 2
        return (
          <div key={d} className="relative min-h-[58px] rounded-lg border border-white/5 bg-navy-950/40 p-1">
            {list.map((b) => (
              <div key={b.id} className={`mb-1 rounded-md border px-2 py-1 text-[11px] leading-tight ${slotStyle[b.mine ? 'Mine' : b.status]}`}>
                <div className="truncate font-semibold">{b.title}</div>
                <div className="opacity-80">{fmt(b.start)}–{fmt(b.end)}</div>
              </div>
            ))}
            {isReq && !list.some((b) => b.mine) && (
              <div className={`rounded-md border border-dashed px-2 py-1 text-[11px] ${conflict ? 'border-red-400 bg-red-500/15 text-red-300' : 'border-brand-blue bg-brand-blue/10 text-blue-200'}`}>
                {conflict ? 'Conflict' : 'Your request'}
              </div>
            )}
            {list.length === 0 && !isReq && <div className="pt-3 text-center text-[11px] text-slate-600">Available</div>}
          </div>
        )
      })}
    </>
  )
}
