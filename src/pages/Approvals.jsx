import { useState } from 'react'
import { Download, CheckCircle2, XCircle, AlertTriangle, X, Users, Ban } from 'lucide-react'
import { PageHeader, StatusBadge, SampleDataNote } from '../components/ui'
import { initialRegistrations, rosterPreview } from '../data/mockData'

const reasons = ['Ineligible semester', 'Roster size mismatch', 'Incomplete details', 'Duplicate entry']

export default function Approvals() {
  const [regs, setRegs] = useState(initialRegistrations)
  const [tab, setTab] = useState('Pending')
  const [selected, setSelected] = useState([])
  const [inspect, setInspect] = useState(initialRegistrations[0].id)
  const [remark, setRemark] = useState('')

  const counts = {
    All: regs.length,
    Pending: regs.filter((r) => r.status === 'Pending').length,
    Approved: regs.filter((r) => r.status === 'Approved').length,
    Rejected: regs.filter((r) => r.status === 'Rejected').length,
  }
  const list = regs.filter((r) => tab === 'All' || r.status === tab)
  const current = regs.find((r) => r.id === inspect)

  const update = (ids, status) => {
    setRegs(regs.map((r) => (ids.includes(r.id) ? { ...r, status } : r)))
    setSelected([])
    setRemark('')
  }

  const toggle = (id) => setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])
  const allSelected = list.length > 0 && list.every((r) => selected.includes(r.id))

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        eyebrow={`${counts.Pending} pending review`}
        title="Registration Approvals"
        description="Review submitted rosters, check eligibility and approve or reject entries."
        actions={
          <div className="flex items-center gap-3">
            <div className="card flex divide-x divide-white/10 px-2 py-2 text-center">
              {[['Total', counts.All, ''], ['Pending', counts.Pending, 'text-amber-400'], ['Approved', counts.Approved, 'text-brand-green'], ['Rejected', counts.Rejected, 'text-red-400']].map(([l, v, c]) => (
                <div key={l} className="px-4">
                  <div className={`text-[10px] font-semibold uppercase tracking-widest ${c || 'text-slate-400'}`}>{l}</div>
                  <div className={`font-display text-xl font-bold ${c}`}>{v}</div>
                </div>
              ))}
            </div>
            <button className="btn-secondary"><Download size={16} /> Export CSV</button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        <div>
          <div className="card mb-4 flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="flex rounded-xl bg-navy-950 p-1">
              {['Pending', 'Approved', 'Rejected', 'All'].map((t) => (
                <button key={t} onClick={() => { setTab(t); setSelected([]) }} className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${tab === t ? 'bg-navy-700 font-semibold text-brand-green' : 'text-slate-400'}`}>
                  {t} <span className="rounded-full bg-black/30 px-1.5 text-xs">{counts[t]}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button disabled={!selected.length} onClick={() => update(selected, 'Approved')} className="btn-primary disabled:opacity-40">
                <CheckCircle2 size={16} /> Approve Selected ({selected.length})
              </button>
              <button disabled={!selected.length} onClick={() => update(selected, 'Rejected')} className="btn-danger disabled:opacity-40">
                <Ban size={16} /> Reject
              </button>
            </div>
          </div>

          <div className="card overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">
                    <input type="checkbox" className="accent-green-500" checked={allSelected} onChange={() => setSelected(allSelected ? [] : list.map((r) => r.id))} />
                  </th>
                  <th className="px-4 py-3 text-left">Registration</th>
                  <th className="px-4 py-3 text-left">Team & event</th>
                  <th className="px-4 py-3 text-left">Captain</th>
                  <th className="px-4 py-3 text-left">Roster</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setInspect(r.id)}
                    className={`cursor-pointer border-t border-white/5 hover:bg-white/[0.03] ${inspect === r.id ? 'bg-brand-green/5' : ''}`}
                  >
                    <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="accent-green-500" checked={selected.includes(r.id)} onChange={() => toggle(r.id)} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-mono text-xs font-semibold text-blue-300">#{r.id}</div>
                      <div className="text-xs text-slate-500">{r.submitted}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold">{r.team}</div>
                      <div className="text-xs text-slate-500">{r.event}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div>{r.captain}</div>
                      <div className="text-xs text-slate-500">{r.captainRoll}</div>
                    </td>
                    <td className="px-4 py-4">
                      {r.members >= r.required ? (
                        <span className="badge bg-brand-green/15 text-brand-green"><Users size={12} /> {r.members}/{r.required}</span>
                      ) : (
                        <span className="badge bg-amber-500/15 text-amber-400"><AlertTriangle size={12} /> {r.members}/{r.required} short</span>
                      )}
                    </td>
                    <td className="px-4 py-4"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr><td colSpan="6" className="px-4 py-10 text-center text-slate-400">No registrations in this view.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inspector */}
        {current && (
          <aside className="card h-fit p-6 xl:sticky xl:top-24">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="eyebrow text-brand-green">Registration inspector</span>
                  <StatusBadge status={current.status} />
                </div>
                <h2 className="mt-2 text-2xl font-bold">{current.team}</h2>
                <div className="text-xs text-slate-400">#{current.id} · Submitted {current.submitted}</div>
              </div>
              <button onClick={() => setInspect(null)} className="text-slate-500 hover:text-white"><X size={18} /></button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-navy-950/60 p-4 text-sm">
              <Check ok={current.eligible} label="Enrolment check" value={current.eligible ? 'All members active' : 'Issues found'} />
              <Check ok={current.members >= current.required} label="Roster size" value={`${current.members}/${current.required} required`} />
              <Check ok label="Department" value={current.dept} />
              <Check ok label="Duplicate entry" value="None found" />
            </div>

            <div className="mt-5">
              <div className="eyebrow mb-2">Submitted roster (first 5)</div>
              <div className="space-y-2">
                {rosterPreview.map((p) => (
                  <div key={p.roll} className="flex items-center justify-between rounded-lg bg-navy-950/60 px-3 py-2">
                    <div>
                      <div className="text-sm font-medium">{p.name} {p.captain && <span className="badge ml-1 bg-brand-green/15 text-brand-green">Capt</span>}</div>
                      <div className="text-xs text-slate-500">Roll {p.roll} · {p.position}</div>
                    </div>
                    <CheckCircle2 size={16} className="text-brand-green" />
                  </div>
                ))}
              </div>
            </div>

            {current.status === 'Pending' && (
              <div className="mt-5">
                <div className="eyebrow mb-2">Remarks (required when rejecting)</div>
                <div className="mb-2 flex flex-wrap gap-2">
                  {reasons.map((r) => (
                    <button key={r} onClick={() => setRemark(r)} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-300 hover:border-white/30">+ {r}</button>
                  ))}
                </div>
                <textarea className="input h-20 resize-none" placeholder="Note to send to the team captain…" value={remark} onChange={(e) => setRemark(e.target.value)} />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button className="btn-primary py-3" onClick={() => update([current.id], 'Approved')}><CheckCircle2 size={18} /> Approve</button>
                  <button disabled={!remark.trim()} className="btn-danger py-3 disabled:opacity-40" onClick={() => update([current.id], 'Rejected')}><XCircle size={18} /> Reject</button>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
      <SampleDataNote />
    </div>
  )
}

function Check({ ok, label, value }) {
  return (
    <div className="flex gap-2">
      {ok ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-green" /> : <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-400" />}
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</div>
        <div className="text-sm">{value}</div>
      </div>
    </div>
  )
}
