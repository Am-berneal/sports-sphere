import { useState } from 'react'
import { Info, CheckCircle2, AlertTriangle } from 'lucide-react'
import { PageHeader, SampleDataNote } from '../components/ui'
import { notifications } from '../data/mockData'

const icon = { info: Info, success: CheckCircle2, warning: AlertTriangle }
const color = { info: 'text-blue-300 bg-brand-blue/10', success: 'text-brand-green bg-brand-green/10', warning: 'text-amber-400 bg-brand-amber/10' }

export default function Notifications() {
  const [items, setItems] = useState(notifications.map((n) => ({ ...n, read: false })))
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Notifications"
        description="Announcements, registration updates and schedule changes."
        actions={<button className="btn-secondary" onClick={() => setItems(items.map((i) => ({ ...i, read: true })))}>Mark all read</button>}
      />
      <div className="space-y-3">
        {items.map((n) => {
          const Icon = icon[n.type]
          return (
            <div key={n.id} className={`card flex items-start gap-4 p-5 ${n.read ? 'opacity-60' : ''}`}>
              <div className={`rounded-full p-2 ${color[n.type]}`}><Icon size={18} /></div>
              <div className="flex-1">
                <div className="text-sm">{n.text}</div>
                <div className="mt-1 text-xs text-slate-500">{n.time}</div>
              </div>
              {!n.read && <span className="mt-2 h-2 w-2 rounded-full bg-brand-green" />}
            </div>
          )
        })}
      </div>
      <SampleDataNote />
    </div>
  )
}
