import { useEffect, useState } from 'react'

const base = import.meta.env.BASE_URL

function getRoutePath(pathname) {
  if (base !== '/' && (pathname === base.slice(0, -1) || pathname.startsWith(base))) {
    const path = pathname.slice(base.length).replace(/^\//, '')
    return path ? `/${path}` : '/'
  }
  return pathname.replace(/\/$/, '') || '/'
}

export function resolveHref(to) {
  const destination = new URL(to, window.location.href)
  if (destination.origin !== window.location.origin) return to

  if (base !== '/' && destination.pathname !== base.slice(0, -1) && !destination.pathname.startsWith(base)) {
    destination.pathname = `${base}${destination.pathname.replace(/^\//, '')}`
  }

  return `${destination.pathname}${destination.search}${destination.hash}`
}

export function usePathname() {
  const [pathname, setPathname] = useState(() => getRoutePath(window.location.pathname))

  useEffect(() => {
    const syncPathname = () => setPathname(getRoutePath(window.location.pathname))
    window.addEventListener('popstate', syncPathname)
    return () => window.removeEventListener('popstate', syncPathname)
  }, [])

  return pathname
}

export function navigate(to) {
  const href = resolveHref(to)
  const destination = new URL(href, window.location.href)
  if (destination.origin !== window.location.origin || destination.href === window.location.href) return

  window.history.pushState({}, '', destination)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
