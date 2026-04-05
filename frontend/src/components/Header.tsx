import { NavLink } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

const NAV = [
  { to: '/',          label: 'Inicio' },
  { to: '/victimas',  label: 'Víctimas' },
  { to: '/violencia', label: 'Violencia' },
  { to: '/autoria',   label: 'Autoría' },
  { to: '/geografia', label: 'Geografía' },
  { to: '/acerca',    label: 'Acerca de' },
]

export function Header() {
  return (
    <header className="border-b border-zinc-800 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
      <div className="flex items-center justify-between sm:contents">
        <span className="text-violet-500 font-semibold tracking-tight text-sm uppercase shrink-0">
          Monitor LGBT+ Argentina 🏳️‍🌈
        </span>
        <a
          href="https://falgbt.org/crimenes-de-odio/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex sm:hidden items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Fuente
          <ExternalLink size={10} />
        </a>
      </div>

      <nav className="flex items-center gap-0.5 sm:gap-1 flex-1 flex-wrap">
        {NAV.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${
                isActive
                  ? 'bg-violet-500/15 text-violet-400'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <a
        href="https://falgbt.org/crimenes-de-odio/"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors shrink-0"
      >
        Fuente: ONCO LGBT+
        <ExternalLink size={11} />
      </a>
    </header>
  )
}
