import { useState } from 'react'
import { Users, Trophy, CalendarDays, ClipboardList, FileText, Download, UserPlus, Search, Activity, MoreVertical } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, CartesianGrid } from 'recharts'
import { PageHeader, StatCard, StatusBadge, Avatar, SampleDataNote } from '../components/ui'
import { participationBySport, registrationsOverTime, participationByDept, users as initialUsers, activityLog } from '../data/mockData'

const PIE = ['#22C55E', '#3B82F6', '#A78BFA', '#F59E0B', '#64748B']
const tooltipStyle = { background: '#0B1426', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }

export default function AdminDashboard() {
  const [users, setUsers] = useState(initialUsers)
  const [filter, setFilter] = useState('All')
  const [q, setQ] = useState('')
  const [range, setRange] = useState('This semester')

  const shown = users.filter((u) => (filter === 'All' || u.role === filter || u.status === filter) && (u.name + u.email).toLowerCase().includes(q.toLowerCase()))

  const changeRole = (email, role) => setUsers(users.map((u) => (u.email === email ? { ...u, role } : u)))
  const toggleStatus = (email) =>
    setUsers(users.map((u) => (u.email === email ? { ...u, status: u.status === 'Active' ? 'Deactivated' : 'Active' } : u)))

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Admin console"
        title="Institution Athletics Administration"
        description="Users, roles, events, facilities and participation reports across the platform."
        actions={
          <>
            <button className="btn-secondary"><UserPlus size={16} /> Invite User</button>
            <button className="btn-primary"><FileText size={16} /> Generate Report</button>
          </>
        }
      />

      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Registered users" value="616" hint="Sample figure" icon={Users} />
        <StatCard label="Active events" value="5" hint="2 starting this month" icon={Trophy} accent="blue" />
        <StatCard label="Facility bookings (30d)" value="84" hint="Across 5 facilities" icon={CalendarDays} accent="amber" />
        <StatCard label="Tournament entries" value="142" hint="Teams + individual" icon={ClipboardList} />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <div className="eyebrow">Distribution</div>
          <h2 className="mb-4 text-lg font-semibold">Participation by Sport</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={participationBySport}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="sport" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="count" name="Participants" fill="#22C55E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <div className="eyebrow">Trend</div>
          <h2 className="mb-4 text-lg font-semibold">Registrations Over Time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={registrationsOverTime}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="regs" name="Registrations" stroke="#3B82F6" strokeWidth={3} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="card p-5">
          <div className="eyebrow">Breakdown</div>
          <h2 className="text-lg font-semibold">Participation by Department</h2>
          <div className="relative h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={participationByDept} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={3} stroke="none">
                  {participationByDept.map((_, i) => <Cell key={i} fill={PIE[i]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {participationByDept.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE[i] }} /> {d.name}</span>
                <span className="text-slate-400">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div id="reports" className="card p-5 lg:col-span-2">
          <div className="eyebrow">Reports</div>
          <h2 className="text-lg font-semibold">Generate Report</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="label">Report type</label>
              <select className="input"><option>Participation summary</option><option>Facility utilization</option><option>Event results</option></select>
            </div>
            <div>
              <label className="label">Date range</label>
              <select className="input" value={range} onChange={(e) => setRange(e.target.value)}><option>This semester</option><option>Last 30 days</option><option>Academic year</option></select>
            </div>
            <div>
              <label className="label">Format</label>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn-secondary">PDF</button>
                <button className="btn-secondary">CSV</button>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {['Participation summary', 'Facility utilization', 'Eligibility & registrations'].map((r) => (
              <div key={r} className="flex items-center justify-between rounded-lg bg-navy-950/60 px-4 py-3">
                <div className="flex items-center gap-3"><FileText size={18} className="text-brand-green" /><span className="text-sm">{r} · {range}</span></div>
                <button className="text-slate-400 hover:text-brand-green"><Download size={18} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users */}
      <div id="users" className="card mb-8 overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-white/5 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="eyebrow text-brand-green">Access control</div>
            <h2 className="text-lg font-semibold">Users & Roles</h2>
          </div>
          <div className="relative md:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input pl-9" placeholder="Search name or email" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 px-5 pt-4">
          {['All', 'Student', 'Coordinator', 'Administrator', 'Pending'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3 py-1 text-xs ${filter === f ? 'bg-brand-green font-semibold text-navy-950' : 'bg-navy-950 text-slate-300'}`}>
              {f === 'Pending' ? 'Pending verification' : f}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="mt-2 w-full min-w-[720px] text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-3 text-left">User</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Role</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Last active</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((u) => (
                <tr key={u.email} className="border-t border-white/5">
                  <td className="px-5 py-3"><div className="flex items-center gap-3"><Avatar name={u.name} size="sm" /> {u.name}</div></td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-400">{u.email}</td>
                  <td className="px-5 py-3">
                    <select value={u.role} onChange={(e) => changeRole(u.email, e.target.value)} className="rounded-md border border-white/10 bg-navy-950 px-2 py-1 text-xs">
                      <option>Student</option><option>Coordinator</option><option>Administrator</option>
                    </select>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={u.status === 'Deactivated' ? 'Rejected' : u.status}>{u.status}</StatusBadge></td>
                  <td className="px-5 py-3 text-slate-400">{u.last}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {u.status === 'Pending' ? (
                        <button onClick={() => toggleStatus(u.email)} className="btn-primary px-3 py-1 text-xs">Verify</button>
                      ) : (
                        <button onClick={() => toggleStatus(u.email)} className="btn-secondary px-3 py-1 text-xs">{u.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                      )}
                      <MoreVertical size={16} className="text-slate-500" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div id="activity" className="card p-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><Activity size={18} className="text-brand-green" /> Audit & Activity Log</h2>
        <div className="mt-4 space-y-3">
          {activityLog.map((a) => (
            <div key={a.text} className="flex items-start justify-between gap-4 rounded-lg bg-navy-950/60 px-4 py-3 text-sm">
              <span>{a.text}</span>
              <span className="shrink-0 text-xs text-slate-500">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
      <SampleDataNote />
    </div>
  )
}
