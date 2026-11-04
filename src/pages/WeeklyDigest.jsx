import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SlidersHorizontal, Clock, CalendarDays, MapPin, AlertTriangle, UserPlus, Compass, Trophy, Save, Send, X, Plus, ShieldCheck, Mail, PauseCircle } from 'lucide-react'
import { PageHeader, AIBadge, SampleDataNote, useToast } from '../components/ui'
import { events, upcomingMatches, teamInvites, SPORTS } from '../data/mockData'
import { loadFixtures } from './Matches'
import { digestText } from '../lib/smartText'
import { storage } from '../lib/storage'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TIMES = ['7:00 AM', '9:00 AM', '12:00 PM', '5:00 PM', '7:00 PM', '9:00 PM']
const INCLUDE = [
  ['matches', 'My matches', 'Upcoming fixtures for my teams'],
  ['deadlines', 'Registration deadlines', 'Closing dates and roster cut-offs'],
  ['invites', 'Team invites', 'Requests from captains'],
  ['newEvents', 'New events for my sports', 'Tournaments and friendlies picked for me'],
  ['results', 'Results of my teams', 'Scores from the past 7 days'],
]
const DEFAULTS = {
  enabled: true,
  day: 'Sunday',
  time: '7:00 PM',
  include: { matches: true, deadlines: true, invites: true, newEvents: true, results: true },
  sports: ['Football', 'Badminton', 'Basketball'],
  tone: 'Smart Brief',
}

const fmtDate = (s) => new Date(`${s}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

function loadSettings() {
  const saved = storage.get('ss-digest', null)
  if (!saved || typeof saved !== 'object') return DEFAULTS
  return { ...DEFAULTS, ...saved, include: { ...DEFAULTS.include, ...(saved.include || {}) }, sports: Array.isArray(saved.sports) ? saved.sports : DEFAULTS.sports }
}

export default function WeeklyDigest() {
  const [settings, setSettings] = useState(loadSettings)
  const [savedAt, setSavedAt] = useState(null)
  const [adding, setAdding] = useState(false)
  const [inviteState, setInviteState] = useState({})
  const [toast, showToast] = useToast()
  const set = (patch) => setSettings((s) => ({ ...s, ...patch }))
  const inc = settings.include

  const content = useMemo(() => {
    const sports = settings.sports
    const matches = inc.matches
      ? upcomingMatches
          .filter((m) => !sports.length || sports.includes(m.sport))
          .map((m) => ({ id: m.id, title: m.teamB ? `${m.teamA} vs ${m.teamB}` : m.teamA, sport: m.sport, round: m.round, when: `${m.date}, ${m.time}`, venue: m.venue, status: m.status }))
      : []
    const open = events.filter((e) => e.status === 'Open' && (!sports.length || sports.includes(e.sport))).sort((a, b) => a.deadline.localeCompare(b.deadline))
    const deadlines = inc.deadlines ? open.slice(0, 1).map((e) => ({ id: e.id, title: e.name, date: fmtDate(e.deadline) })) : []
    const picks = inc.newEvents ? open.slice(inc.deadlines ? 1 : 0, (inc.deadlines ? 1 : 0) + 2) : []
    const invites = inc.invites ? teamInvites.filter((i) => !inviteState[i.id]) : []
    const results = inc.results ? loadFixtures().filter((f) => f.status === 'Completed' && (f.teamA === 'Thunderbolts FC' || f.teamB === 'Thunderbolts FC')) : []
    const text = digestText({ name: 'Amberneal Singh', matches, deadlines, invites, picks, tone: settings.tone === 'Smart Brief' ? 'Smart' : settings.tone })
    return { matches, deadlines, picks, invites, results, ...text }
  }, [settings, inc, inviteState])

  const save = () => {
    storage.set('ss-digest', settings)
    setSavedAt(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
    showToast('Preferences saved')
  }
  const toggleSport = (s) => set({ sports: settings.sports.includes(s) ? settings.sports.filter((x) => x !== s) : [...settings.sports, s] })
  const activeCount = Object.values(inc).filter(Boolean).length

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title={<span className="flex flex-wrap items-center gap-3">Smart Weekly Digest <AIBadge /></span>}
        description="One personalized sports email every week, instead of many emails that get lost in your inbox."
        actions={
          <>
            <div className="card flex items-center gap-3 px-4 py-2.5 text-sm">
              <span className={`h-2 w-2 rounded-full ${settings.enabled ? 'bg-brand-green' : 'bg-slate-500'}`} />
              {settings.enabled ? <>Next dispatch: <b className="text-brand-green">{settings.day}, {settings.time}</b></> : <span className="text-slate-400">Digest paused</span>}
            </div>
            <button
              disabled={!settings.enabled}
              onClick={() => showToast('Test digest sent to your college email (demo)')}
              className="btn-secondary disabled:opacity-40"
            >
              <Send size={16} /> Send Test Email
            </button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* ---------- Settings ---------- */}
        <div className="space-y-6">
          <section className="card space-y-6 p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="rounded-lg bg-navy-950 p-2.5 text-brand-green"><SlidersHorizontal size={20} /></div>
                <div>
                  <h2 className="text-lg font-semibold">Digest Settings</h2>
                  <p className="text-xs text-slate-400">Configure your weekly delivery</p>
                </div>
              </div>
              <button
                role="switch"
                aria-checked={settings.enabled}
                aria-label="Weekly digest on or off"
                onClick={() => set({ enabled: !settings.enabled })}
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${settings.enabled ? 'bg-brand-green' : 'bg-navy-600'}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${settings.enabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <fieldset disabled={!settings.enabled} className="space-y-6 disabled:opacity-50">
              <div>
                <div className="eyebrow mb-2">Delivery schedule</div>
                <div className="grid grid-cols-2 gap-3">
                  <select className="input" value={settings.day} onChange={(e) => set({ day: e.target.value })} aria-label="Day">
                    {DAYS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                  <select className="input" value={settings.time} onChange={(e) => set({ time: e.target.value })} aria-label="Time">
                    {TIMES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-navy-950/60 px-3 py-2 text-xs text-slate-400">
                  <Mail size={14} /> Sent to: <span className="text-slate-200">your college email</span>
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between">
                  <span className="eyebrow">What to include</span>
                  <span className="text-xs text-brand-green">{activeCount} active</span>
                </div>
                <div className="space-y-2">
                  {INCLUDE.map(([key, label, hint]) => (
                    <label key={key} className="flex cursor-pointer gap-3 rounded-lg bg-navy-950/50 p-3 hover:bg-navy-950">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-green-500"
                        checked={inc[key]}
                        onChange={() => set({ include: { ...inc, [key]: !inc[key] } })}
                      />
                      <span>
                        <span className="block text-sm font-medium">{label}</span>
                        <span className="block text-xs text-slate-400">{hint}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between">
                  <span className="eyebrow">My sports</span>
                  <span className="text-xs text-slate-400">{settings.sports.length} selected</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.sports.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 rounded-full border border-brand-green/40 bg-brand-green/10 px-3 py-1 text-xs text-brand-green">
                      {s}
                      <button type="button" onClick={() => toggleSport(s)} aria-label={`Remove ${s}`}><X size={12} /></button>
                    </span>
                  ))}
                  {!adding ? (
                    <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                      <Plus size={12} /> Add sport
                    </button>
                  ) : (
                    SPORTS.filter((s) => !settings.sports.includes(s)).map((s) => (
                      <button type="button" key={s} onClick={() => { toggleSport(s); setAdding(false) }} className="rounded-full border border-dashed border-white/20 px-3 py-1 text-xs text-slate-300 hover:border-brand-green/40">
                        + {s}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="eyebrow mb-2">AI summary style</div>
                <div className="grid grid-cols-3 rounded-lg bg-navy-950 p-1">
                  {['Concise', 'Smart Brief', 'Detailed'].map((t) => (
                    <button type="button" key={t} onClick={() => set({ tone: t })} className={`rounded-md py-2 text-xs font-semibold ${settings.tone === t ? 'bg-brand-blue text-white' : 'text-slate-400'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </fieldset>

            <div>
              <button onClick={save} className="btn-primary w-full py-3"><Save size={16} /> Save Preferences</button>
              {savedAt && <p className="mt-2 text-center text-xs text-slate-500">Saved at {savedAt}</p>}
            </div>
          </section>

          <div className="card flex gap-3 p-4 text-xs text-slate-400">
            <ShieldCheck size={18} className="shrink-0 text-brand-green" />
            Only your sports schedule, teams and selected sports are used to write the digest. No passwords, phone numbers or roll numbers are sent to the AI.
          </div>
        </div>

        {/* ---------- Email preview ---------- */}
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/5 bg-navy-950/60 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-brand-green" />
              <span className="ml-3 font-mono text-xs text-slate-400">Email preview</span>
            </div>
            <span className="badge bg-brand-green/10 text-brand-green">Live preview</span>
          </div>

          {!settings.enabled ? (
            <div className="p-12 text-center">
              <PauseCircle size={40} className="mx-auto text-slate-500" />
              <p className="mt-3 font-semibold">Your weekly digest is paused</p>
              <p className="mt-1 text-sm text-slate-400">Turn it on to receive one summary email every week.</p>
            </div>
          ) : (
            <>
              <div className="space-y-1 border-b border-white/5 px-6 py-4 text-sm">
                <div className="flex flex-wrap items-center gap-2 font-semibold">Subject: ⚡ {content.subject} <AIBadge label="AI subject" /></div>
                <div className="text-xs text-slate-400">{settings.day} · {settings.time} &nbsp;|&nbsp; From: Sports Sphere Digest &nbsp;|&nbsp; To: your college email</div>
              </div>

              <div className="space-y-7 p-6">
                <div className="flex items-center gap-3">
                  <img src="/images/logo-icon.png" alt="" className="h-9 w-9 rounded-lg object-cover" />
                  <div>
                    <div className="font-display font-bold">SPORTS SPHERE</div>
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-brand-green">Weekly sports digest</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold">Hi Amberneal,</h3>
                  <div className="mt-3 rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-4">
                    <AIBadge label="Personalized AI brief" />
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">{content.summary}</p>
                  </div>
                </div>

                {inc.matches && (
                  <Block icon={Trophy} title="This week's matches" count={`${content.matches.length} fixtures`}>
                    {content.matches.length === 0 && <Empty text="No matches for your selected sports this week." />}
                    {content.matches.map((m) => (
                      <div key={m.id} className="rounded-lg bg-navy-950/60 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="font-semibold">{m.title}</div>
                            <div className="text-xs text-slate-400">{m.sport} · {m.round}</div>
                          </div>
                          <span className="badge bg-brand-green/10 text-brand-green">{m.status}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1"><Clock size={13} /> {m.when}</span>
                          <span className="flex items-center gap-1"><MapPin size={13} /> {m.venue}</span>
                        </div>
                      </div>
                    ))}
                  </Block>
                )}

                {inc.deadlines && content.deadlines.length > 0 && (
                  <Block icon={AlertTriangle} title="Deadlines" iconColor="text-amber-400">
                    {content.deadlines.map((d) => (
                      <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                        <div>
                          <div className="font-semibold">{d.title}</div>
                          <div className="text-xs text-slate-400">Team registration closes on {d.date}</div>
                        </div>
                        <span className="badge bg-amber-500/20 text-amber-300">Closes {d.date}</span>
                      </div>
                    ))}
                  </Block>
                )}

                {inc.invites && (
                  <Block icon={UserPlus} title="Team invites">
                    {teamInvites.map((i) => (
                      <div key={i.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-navy-950/60 p-4">
                        <div>
                          <div className="font-semibold">{i.team}</div>
                          <div className="text-xs text-slate-400">{i.sport} · Role: {i.role} · Capt. {i.captain}</div>
                        </div>
                        {inviteState[i.id] ? (
                          <span className={`badge ${inviteState[i.id] === 'Accepted' ? 'bg-brand-green/15 text-brand-green' : 'bg-slate-500/20 text-slate-300'}`}>{inviteState[i.id]}</span>
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => setInviteState({ ...inviteState, [i.id]: 'Accepted' })} className="btn-primary px-3 py-1.5">Accept</button>
                            <button onClick={() => setInviteState({ ...inviteState, [i.id]: 'Declined' })} className="btn-secondary px-3 py-1.5">Decline</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </Block>
                )}

                {inc.results && content.results.length > 0 && (
                  <Block icon={Trophy} title="Your team's results">
                    {content.results.map((r) => (
                      <div key={r.id} className="flex items-center justify-between rounded-lg bg-navy-950/60 p-4 text-sm">
                        <span>{r.teamA} <b className="mx-2 text-brand-green">{r.scoreA} – {r.scoreB}</b> {r.teamB}</span>
                        <span className="text-xs text-slate-400">{r.round}</span>
                      </div>
                    ))}
                  </Block>
                )}

                {inc.newEvents && (
                  <Block icon={Compass} title="Picked for you" right={<AIBadge label="AI curated" />}>
                    {content.picks.length === 0 && <Empty text="No new events for your sports right now." />}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {content.picks.map((e) => (
                        <div key={e.id} className="rounded-lg bg-navy-950/60 p-4">
                          <div className="text-xs font-semibold uppercase text-brand-green">{e.sport}</div>
                          <div className="mt-1 font-semibold">{e.name}</div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-slate-400"><CalendarDays size={13} /> Starts {fmtDate(e.startDate)} · {e.venue}</div>
                          <Link to={`/events/${e.id}`} className="mt-3 inline-block text-xs font-semibold text-blue-300">View event →</Link>
                        </div>
                      ))}
                    </div>
                  </Block>
                )}

                <div className="border-t border-white/5 pt-6 text-center">
                  <Link to="/student" className="btn-blue px-6 py-2.5">Open Sports Sphere</Link>
                  <p className="mt-3 text-xs text-slate-500">You receive this because Weekly Digest is on. Change preferences anytime in Sports Sphere.</p>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
      {toast}
      <SampleDataNote />
    </div>
  )
}

function Block({ icon: Icon, title, count, right, iconColor = 'text-brand-green', children }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-semibold"><Icon size={18} className={iconColor} /> {title}</h4>
        {count && <span className="font-mono text-xs text-slate-400">{count}</span>}
        {right}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Empty({ text }) {
  return <p className="rounded-lg bg-navy-950/40 p-4 text-sm text-slate-400">{text}</p>
}
