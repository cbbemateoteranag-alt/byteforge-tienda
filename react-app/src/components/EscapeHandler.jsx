import { useEffect } from 'react'

export default function EscapeHandler({ onEscape }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onEscape()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onEscape])

  return null
}
