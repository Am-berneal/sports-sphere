import { useState } from 'react'
import { Sparkles, CornerDownLeft, Lightbulb, Code2, Lock, Copy, Download, FilePlus, ShieldCheck, History, ChevronDown, ChevronUp, AlertTriangle, Ban } from 'lucide-react'
import { PageHeader, AIBadge, BarList, SampleDataNote, useToast } from '../components/ui'
import { ask, SUGGESTIONS } from '../lib/askEngine'
import { copyText, storage } from '../lib/storage'

export default function AskSportsSphere() {
  const [q, setQ] = useState(SUGGESTIONS[0])
  const [result, setResult] = useState(() => ask(SUGGESTIONS[0]))
  const [asked, setAsked] = useState(SUGGESTIONS[0])
  const [showSql, setShowSql] = useState(true)
  const [history, setHistory] = useState(() => {
    const h = storage.get('ss-ask-history', [])
    return Array.isArray(h) ? h : []
  })
  const [thinking, setThinking] = useState(false)
  const [toast, showToast] = useToast()

  const run = (question) => {
    const text = (question ?? q).trim()
    if (!text) return
    setQ(text)
    setThinking(true)
    // small delay so it feels like a real request; result is computed locally
    setTimeout(() => {
      const r = ask(text)
      setResult(r)
      setAsked(text)
      setThinking(false)
      if (!r.error) {
        const next = [{ q: text, at: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }, ...history.filter((h) => h.q !== text)].slice(0, 6)
        setHistory(next)
        storage.set('ss-ask-history', next)
      }
    }, 350)
  }

  const exportCsv = () => {
    if (!result?.rows) return
    try {
      const csv = ['label,value', ...result.rows.map((r) => `"${r.label}",${r.value}`)].join('\n')
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
      const a = document.createElement('a')
      a.href = url
      a.download = 'sports-sphere-query.csv'
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      showToast('CSV downloaded')
    } catch {
      showToast('Could not create the CSV in this browser', 'error')
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title={<span className="flex flex-wrap items-center gap-3">Ask Sports Sphere <AIBadge label="AI · Natural language" /></span>}
        description="Ask questions about sports participation, facilities and events in plain English."
        actions={<div className="card flex items-center gap-2 px-4 py-2.5 text-sm"><ShieldCheck size={16} className="text-brand-green" /> Administrator view</div>}
      />

      {/* Question box */}
      <form
        onSubmit={(e) => { e.preventDefault(); run() }}
        className="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center"
      >
        <Sparkles size={20} className="ml-2 hidden shrink-0 text-brand-green sm:block" />
        <input
          className="flex-1 bg-transparent px-2 py-2 text-base outline-none placeholder-slate-500"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. How many Mechanical students played football this semester?"
          aria-label="Your question"
        />
        <span className="hidden items-center gap-1 text-xs text-slate-500 sm:flex">Enter <CornerDownLeft size={12} /></span>
        <button disabled={thinking || !q.trim()} className="btn-primary px-6 py-2.5 disabled:opacity-50">{thinking ? 'Thinking…' : 'Ask'}</button>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs uppercase tracking-widest text-slate-500"><Lightbulb size={13} /> Try:</span>
        {SUGGESTIONS.slice(1).map((s) => (
          <button key={s} onClick={() => run(s)} className="rounded-full border border-white/10 bg-navy-800 px-3 py-1.5 text-xs text-slate-300 hover:border-brand-green/40">
            {s}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          {thinking && <div className="card animate-pulse p-8 text-center text-slate-400">Reading the database…</div>}

          {!thinking && result?.error && (
            <div className={`card flex gap-3 p-6 ${result.blocked ? 'border-red-500/30' : 'border-amber-500/30'}`}>
              {result.blocked ? <Ban className="shrink-0 text-red-400" /> : <AlertTriangle className="shrink-0 text-amber-400" />}
              <div>
                <div className="font-semibold">{result.blocked ? 'Query blocked' : 'Not sure how to answer that'}</div>
                <p className="mt-1 text-sm text-slate-300">{result.error}</p>
              </div>
            </div>
          )}

          {!thinking && result && !result.error && (
            <>
              <section className="card p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <AIBadge label="AI answer" />
                  <button onClick={async () => showToast((await copyText(result.answer)) ? 'Answer copied' : 'Copy not allowed in this browser', 'success')} className="text-slate-400 hover:text-white" aria-label="Copy answer">
                    <Copy size={16} />
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">“{asked}”</p>
                <p className="mt-3 text-lg leading-relaxed">{result.answer}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <Mini label="Top" value={result.rows[0].label} sub={`${result.rows[0].value} ${result.unit}`} />
                  <Mini label="Total" value={result.rows.reduce((a, r) => a + r.value, 0)} sub={result.unit} />
                  <Mini label="Groups compared" value={result.rows.length} sub="rows returned" />
                </div>
              </section>

              <section className="card p-6">
                <h3 className="mb-5 font-semibold">{result.title}</h3>
                <BarList rows={result.rows} unit={result.unit} highlight={result.highlight} />
              </section>

              <section className="card overflow-hidden">
                <button onClick={() => setShowSql(!showSql)} className="flex w-full items-center justify-between px-6 py-4 text-left">
                  <span className="flex items-center gap-2 font-semibold"><Code2 size={18} /> Generated SQL query <span className="badge bg-brand-green/10 text-brand-green"><Lock size={11} /> Read-only</span></span>
                  <span className="flex items-center gap-2 text-xs text-slate-400">MySQL {showSql ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
                </button>
                {showSql && (
                  <div className="relative border-t border-white/5 bg-navy-950 p-5">
                    <button onClick={async () => showToast((await copyText(result.sql)) ? 'SQL copied' : 'Copy not allowed in this browser')} className="btn-secondary absolute right-4 top-4 px-2.5 py-1 text-xs"><Copy size={13} /> Copy</button>
                    <pre className="overflow-x-auto pr-20 font-mono text-[13px] leading-relaxed text-slate-200">{result.sql}</pre>
                  </div>
                )}
              </section>

              <div className="flex flex-wrap gap-3">
                <button onClick={exportCsv} className="btn-secondary"><Download size={16} /> Export CSV</button>
                <button onClick={() => showToast('Added to the monthly participation report')} className="btn-primary"><FilePlus size={16} /> Add to Report</button>
              </div>
            </>
          )}
        </div>

        <aside className="space-y-6">
          <div className="card p-5">
            <h3 className="flex items-center gap-2 font-semibold"><ShieldCheck size={18} className="text-brand-green" /> Data guardrails</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>• Only read-only <code className="text-slate-200">SELECT</code> queries are run.</li>
              <li>• <code className="text-red-300">INSERT</code>, <code className="text-red-300">UPDATE</code>, <code className="text-red-300">DELETE</code> and <code className="text-red-300">DROP</code> are blocked.</li>
              <li>• Available to administrators only.</li>
              <li>• Only aggregated counts are returned, not personal details.</li>
            </ul>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-semibold"><History size={18} /> Recent questions</h3>
              {history.length > 0 && <button onClick={() => { setHistory([]); storage.remove('ss-ask-history') }} className="text-xs text-slate-400 hover:text-white">Clear</button>}
            </div>
            <div className="mt-3 space-y-2">
              {history.length === 0 && <p className="text-sm text-slate-500">Your questions will appear here.</p>}
              {history.map((h) => (
                <button key={h.q} onClick={() => run(h.q)} className="block w-full rounded-lg bg-navy-950/60 p-3 text-left text-sm hover:bg-navy-950">
                  {h.q}
                  <span className="mt-1 block text-xs text-slate-500">{h.at}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="card p-5 text-sm text-slate-400">
            <h3 className="mb-2 font-semibold text-white">How it works</h3>
            Your question and the database structure are sent to the AI, which writes a SQL query. The server checks the query is read-only, runs it on MySQL and shows the result.
          </div>
        </aside>
      </div>
      {toast}
      <SampleDataNote />
    </div>
  )
}

function Mini({ label, value, sub }) {
  return (
    <div className="rounded-lg bg-navy-950/60 p-4">
      <div className="eyebrow">{label}</div>
      <div className="mt-1 truncate font-display text-lg font-bold text-brand-green">{value}</div>
      <div className="text-xs text-slate-500">{sub}</div>
    </div>
  )
}
