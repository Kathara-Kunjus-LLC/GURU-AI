import { Link, useLocation } from 'react-router-dom'

function NavLink({ to, children }) {
  const { pathname } = useLocation()
  const active = pathname === to || (to !== '/' && pathname.startsWith(to))
  return (
    <Link
      to={to}
      className={`text-xs font-medium transition-colors ${
        active ? 'text-slate-100' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      {children}
    </Link>
  )
}

export function AppHeader({ children }) {
  return (
    <header className="bg-slate-950 border-b border-slate-800/60 px-5 py-3 flex items-center shrink-0">
      <Link to="/" className="text-slate-100 font-semibold tracking-tight text-base">
        guru
      </Link>
      <nav className="flex items-center gap-5 ml-6">
        <NavLink to="/ingest">Ingest</NavLink>
        <NavLink to="/queue">Queue</NavLink>
        <NavLink to="/review">Review</NavLink>
      </nav>
      {children && (
        <div className="ml-auto flex items-center gap-4 text-xs text-slate-600">
          {children}
        </div>
      )}
    </header>
  )
}

export default function AppShell({ children }) {
  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
      <AppHeader />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
