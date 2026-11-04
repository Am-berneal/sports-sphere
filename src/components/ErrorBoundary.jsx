import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

// If one page crashes, show a friendly message instead of a blank screen.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Page error:', error, info)
  }

  reset = () => {
    try {
      Object.keys(localStorage).filter((k) => k.startsWith('ss-')).forEach((k) => localStorage.removeItem(k))
    } catch { /* ignore */ }
    this.setState({ error: null })
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <AlertTriangle size={36} className="mx-auto text-amber-400" />
        <h2 className="mt-4 text-xl font-bold">Something went wrong on this page</h2>
        <p className="mt-2 text-sm text-slate-400">The rest of the app still works. You can reset the saved demo data and try again.</p>
        <button onClick={this.reset} className="btn-primary mt-6">Reset demo data & reload page</button>
      </div>
    )
  }
}
