import { NavLink, Link } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard' },
  { to: '/pesanan', label: 'Pesanan' },
  { to: '/pelanggan', label: 'Pelanggan' },
  { to: '/layanan', label: 'Layanan' },
]

export function LogoMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="10" fill="#0e7490" />
      <circle cx="18" cy="18" r="9.5" stroke="#ffffff" strokeWidth="2.4" />
      <path
        d="M11 18C13 16 16 21 19 17.5C21 15 23.5 16.5 25 18"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="21" cy="12.5" r="1.4" fill="#ffffff" />
    </svg>
  )
}

export default function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand">
          <LogoMark />
          <div>
            <strong>WashTech</strong>
            <small>Manajemen Laundry</small>
          </div>
        </Link>
        <nav className="tabs" aria-label="Navigasi utama">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `tab${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

