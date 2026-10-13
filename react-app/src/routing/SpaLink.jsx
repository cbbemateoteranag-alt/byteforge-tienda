import { navigate, resolveHref } from './router.js'

export default function SpaLink({ to, children, onClick, ...props }) {
  const href = resolveHref(to)

  function handleClick(event) {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (props.target && props.target !== '_self') return
    if (props.download) return

    const destination = new URL(href, window.location.href)
    if (destination.origin !== window.location.origin) return
    if (destination.pathname === window.location.pathname && destination.search === window.location.search && destination.hash) return

    event.preventDefault()
    navigate(href)
  }

  return <a href={href} onClick={handleClick} {...props}>{children}</a>
}
