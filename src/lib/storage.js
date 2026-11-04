// Safe wrapper around localStorage. Browsers can block storage
// (private mode, disabled site data), so every call is guarded.
export const storage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return fallback
      try {
        return JSON.parse(raw)
      } catch {
        return raw
      }
    } catch {
      return fallback
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
    } catch {
      /* ignore */
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  },
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // fallback for browsers without clipboard permission
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}
