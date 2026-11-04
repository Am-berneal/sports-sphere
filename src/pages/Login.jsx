import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Zap, ClipboardList, Building2, CheckCircle2, User, Mail, IdCard, Lock, Eye, EyeOff, ArrowRight, Trophy, CalendarCheck, BarChart3 } from 'lucide-react'
import { Logo } from '../components/ui'
import { setRole } from '../components/Layout'
import { DEPARTMENTS } from '../data/mockData'

const roleCards = [
  { id: 'student', title: 'Student', text: 'Join teams, register for events, book courts', icon: Zap, approval: false },
  { id: 'coordinator', title: 'Coordinator', text: 'Host tournaments, approve entries, enter scores', icon: ClipboardList, approval: true },
  { id: 'admin', title: 'Administrator', text: 'Manage users, facilities and reports', icon: Building2, approval: true },
]

const routes = { student: '/student', coordinator: '/coordinator', admin: '/admin' }

export default function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [role, setRoleState] = useState(location.state?.role || 'student')
  const [showPw, setShowPw] = useState(false)
  const [pw, setPw] = useState('')

  const strength = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length

  const submit = (e) => {
    e.preventDefault()
    setRole(role)
    navigate(routes[role])
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left visual */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <img src="/images/basketball.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950/95 via-navy-900/85 to-navy-900/70" />
        <div className="relative">
          <Logo subtitle="Campus Athletics" />
        </div>
        <div className="relative">
          <h1 className="text-6xl font-extrabold leading-tight">
            One Campus.
            <br />
            <span className="bg-gradient-to-r from-brand-green to-teal-300 bg-clip-text text-transparent">Every Sport.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-slate-300">
            Tournaments, team coordination, court reservations and results — all on one platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              [Trophy, 'Tournament registration'],
              [CalendarCheck, 'Facility booking'],
              [BarChart3, 'Live leaderboards'],
            ].map(([Icon, t]) => (
              <div key={t} className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy-800/70 px-4 py-2 text-sm backdrop-blur">
                <Icon size={16} className="text-brand-green" /> {t}
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-slate-500">Software Engineering Project · UI Prototype</div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center bg-navy-900 p-6 md:p-12">
        <div className="card w-full max-w-xl p-6 md:p-8">
          <div className="mb-6 lg:hidden"><Logo /></div>
          <div className="mb-8 grid grid-cols-2 rounded-xl bg-navy-950 p-1">
            {['login', 'signup'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg py-2.5 text-sm font-semibold transition ${tab === t ? 'bg-brand-green text-navy-950' : 'text-slate-400 hover:text-white'}`}
              >
                {t === 'login' ? 'Log In' : 'Create Account'}
              </button>
            ))}
          </div>

          <h2 className="text-3xl font-bold">{tab === 'login' ? 'Welcome back' : 'Join Sports Sphere'}</h2>
          <p className="mt-2 text-sm text-slate-400">
            {tab === 'login'
              ? 'Log in with your college email to continue.'
              : 'Create your sports profile to register for events, join teams and book facilities.'}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="eyebrow">Select your role *</span>
                <span className="text-xs text-slate-500">Determines access permissions</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {roleCards.map(({ id, title, text, icon: Icon, approval }) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setRoleState(id)}
                    className={`relative rounded-xl border p-4 text-left transition ${
                      role === id ? 'border-brand-green bg-brand-green/5' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {role === id && <CheckCircle2 size={18} className="absolute right-3 top-3 text-brand-green" />}
                    <Icon size={18} className="text-brand-green" />
                    <div className="mt-3 text-sm font-semibold">{title}</div>
                    {tab === 'signup' && approval && (
                      <span className="badge mt-1 bg-brand-amber/15 text-amber-400">Approval req.</span>
                    )}
                    <div className="mt-1 text-xs text-slate-400">{text}</div>
                  </button>
                ))}
              </div>
            </div>

            {tab === 'signup' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field icon={User} label="Full name" placeholder="Your full name" />
                <Field icon={IdCard} label="Roll number" placeholder="e.g. 1023XXXXX" />
                <div className="sm:col-span-2">
                  <label className="label">Department</label>
                  <select className="input" defaultValue="">
                    <option value="" disabled>Select department</option>
                    {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            )}

            <Field icon={Mail} label="College email" placeholder="name@college.edu" type="email" />

            <div className={tab === 'signup' ? 'grid gap-4 sm:grid-cols-2' : ''}>
              <div>
                <div className="flex justify-between">
                  <label className="label">Password</label>
                  {tab === 'login' && <a className="text-xs text-blue-300 hover:underline" href="#">Forgot password?</a>}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input pl-9 pr-10"
                    placeholder="••••••••"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {tab === 'signup' && <Field icon={Lock} label="Confirm password" placeholder="••••••••" type="password" />}
            </div>

            {tab === 'signup' && (
              <div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`h-1.5 rounded-full ${i < strength ? 'bg-brand-green' : 'bg-navy-950'}`} />
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">Use 8+ characters with uppercase, numbers and symbols.</p>
                <label className="mt-4 flex items-start gap-3 text-sm text-slate-400">
                  <input type="checkbox" className="mt-1 accent-green-500" />
                  I agree to the college sports code of conduct and facility booking rules.
                </label>
              </div>
            )}

            <button className="btn-primary w-full py-3 text-base">
              {tab === 'login' ? 'Log In' : 'Create Account'} <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, ...props }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input className="input pl-9" {...props} />
      </div>
    </div>
  )
}
