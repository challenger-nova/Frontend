'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { useState } from 'react';

interface SidebarProps { guildId?: string; guildName?: string; guildIcon?: string | null; }

function NavIcon({ path, size = 18 }: { path: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={path}/>
    </svg>
  );
}

export default function Sidebar({ guildId, guildName, guildIcon }: SidebarProps) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = guildId ? [
    { href: `/dashboard/${guildId}`,             label: 'Overview',    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: `/dashboard/${guildId}/escrows`,     label: 'Escrows',     icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { href: `/dashboard/${guildId}/leaderboard`, label: 'Leaderboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ] : [
    { href: '/dashboard', label: 'Servers', icon: 'M4 6h16M4 10h16M4 14h8' },
  ];

  const isActive = (href: string) => pathname === href;

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid var(--border)` }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => setMobileOpen(false)}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(14,165,233,0.35)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>Uranium</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Escrow</div>
          </div>
        </Link>
      </div>

      {/* Guild context */}
      {guildId && (
        <div style={{ padding: '12px 16px', borderBottom: `1px solid var(--border)` }}>
          <button onClick={() => { router.push('/dashboard'); setMobileOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text3)', background: 'none', border: 'none', padding: '4px 0', marginBottom: 10, cursor: 'pointer', transition: 'color 0.15s' }}
            onMouseOver={e => (e.currentTarget.style.color = 'var(--text2)')}
            onMouseOut={e => (e.currentTarget.style.color = 'var(--text3)')}>
            <NavIcon path="M19 12H5M12 5l-7 7 7 7" size={12} /> All servers
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--bg3)', borderRadius: 'var(--radius)' }}>
            {guildIcon ? (
              <img src={guildIcon} alt="" style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent-bg)', border: `1px solid var(--accent-border)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                {guildName?.[0]?.toUpperCase() || 'S'}
              </div>
            )}
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{guildName || 'Server'}</div>
              <div style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 500 }}>Active</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', padding: '4px 10px 8px' }}>
          {guildId ? 'Menu' : 'Navigation'}
        </div>
        {navItems.map(item => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              borderRadius: 'var(--radius)', fontSize: 13, fontWeight: active ? 600 : 500,
              color: active ? 'var(--accent)' : 'var(--text2)',
              background: active ? 'var(--accent-bg)' : 'transparent',
              transition: 'all 0.15s', position: 'relative',
            }}
            onMouseOver={e => { if (!active) { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text)'; }}}
            onMouseOut={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)'; }}}>
              {active && <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, background: 'var(--accent)', borderRadius: '0 3px 3px 0' }} />}
              <NavIcon path={item.icon} size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px 10px', borderTop: `1px solid var(--border)`, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <button onClick={toggle} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 500, color: 'var(--text2)', background: 'none', border: 'none', width: '100%', transition: 'all 0.15s', textAlign: 'left' }}
          onMouseOver={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text2)'; }}>
          <NavIcon path={theme === 'dark' ? 'M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M20.66 17.5l-.87-.5M4.21 6.5l-.87-.5M21 12h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z' : 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z'} size={16} />
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 'var(--radius)', background: 'var(--bg3)', marginTop: 4 }}>
            <img src={user.avatarUrl} alt="" style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, border: `2px solid var(--border)` }} />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.username}</div>
              <div style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 500 }}>Admin</div>
            </div>
            <button onClick={logout} title="Logout" style={{ background: 'none', border: 'none', color: 'var(--text3)', padding: 4, borderRadius: 6, cursor: 'pointer', transition: 'color 0.15s', flexShrink: 0 }}
              onMouseOver={e => (e.currentTarget.style.color = 'var(--danger)')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--text3)')}>
              <NavIcon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside style={{
        width: 'var(--sidebar-w)', minHeight: '100vh',
        background: 'var(--surface)', borderRight: `1px solid var(--border)`,
        position: 'fixed', top: 0, left: 0, zIndex: 50,
        display: 'none',
      }} className="desktop-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile top nav */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 'var(--topnav-h)',
        background: 'var(--surface)', borderBottom: `1px solid var(--border)`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
      }} className="mobile-header">
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z"/>
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
            {guildName ? guildName : 'Uranium Escrow'}
          </span>
        </Link>

        {/* Mobile nav pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navItems.map(item => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 36, height: 36, borderRadius: 9,
                color: active ? 'var(--accent)' : 'var(--text3)',
                background: active ? 'var(--accent-bg)' : 'transparent',
                transition: 'all 0.15s',
              }}>
                <NavIcon path={item.icon} size={17} />
              </Link>
            );
          })}
          <button onClick={toggle} style={{ width: 36, height: 36, borderRadius: 9, border: 'none', background: 'var(--bg3)', color: 'var(--text2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <NavIcon path={theme === 'dark' ? 'M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M20.66 17.5l-.87-.5M4.21 6.5l-.87-.5M21 12h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z' : 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z'} size={16} />
          </button>
          {user && (
            <img src={user.avatarUrl} alt="" style={{ width: 32, height: 32, borderRadius: '50%', border: `2px solid var(--border)`, cursor: 'pointer' }} onClick={logout} title="Logout" />
          )}
        </div>
      </header>

      <style>{`
        @media (min-width: 768px) {
          .desktop-sidebar { display: block !important; }
          .mobile-header { display: none !important; }
        }
      `}</style>
    </>
  );
}
