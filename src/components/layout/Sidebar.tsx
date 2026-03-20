'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';

interface SidebarProps { guildId?: string; guildName?: string; guildIcon?: string | null; }

const Icon = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

export default function Sidebar({ guildId, guildName, guildIcon }: SidebarProps) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const pathname = usePathname();

  const navItems = guildId ? [
    { href: `/dashboard/${guildId}`,             label: 'Overview',    icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
    { href: `/dashboard/${guildId}/escrows`,     label: 'Escrows',     icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2' },
    { href: `/dashboard/${guildId}/leaderboard`, label: 'Leaderboard', icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
  ] : [];

  const isActive = (href: string) => pathname === href;

  return (
    <aside style={{ width: 'var(--sidebar-w)', minHeight: '100vh', background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, zIndex: 50 }}>

      {/* Logo */}
      <div style={{ padding: '18px 16px', borderBottom: '1px solid var(--border)' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--bg)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z"/>
            </svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>Uranium Escrow</span>
        </Link>
      </div>

      {/* Guild context */}
      {guildId && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text3)', marginBottom: 8, transition: 'color 0.15s' }}
            onMouseOver={e => (e.currentTarget.style.color = 'var(--text2)')}
            onMouseOut={e => (e.currentTarget.style.color = 'var(--text3)')}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            All servers
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {guildIcon ? (
              <img src={guildIcon} alt="" style={{ width: 24, height: 24, borderRadius: 6, objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: 'var(--accent)' }}>
                {guildName?.[0]?.toUpperCase() || 'S'}
              </div>
            )}
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{guildName || 'Server'}</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(item => (
          <Link key={item.href} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px',
            borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 500,
            color: isActive(item.href) ? 'var(--accent)' : 'var(--text2)',
            background: isActive(item.href) ? 'var(--accent-bg)' : 'transparent',
            transition: 'all 0.15s',
          }}
          onMouseOver={e => { if (!isActive(item.href)) { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.color = 'var(--text)'; }}}
          onMouseOut={e => { if (!isActive(item.href)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)'; }}}>
            <Icon d={item.icon} />
            {item.label}
          </Link>
        ))}

        {!guildId && (
          <Link href="/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px',
            borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 500,
            color: 'var(--accent)', background: 'var(--accent-bg)',
          }}>
            <Icon d="M4 6h16M4 10h16M4 14h8" />
            Servers
          </Link>
        )}
      </nav>

      {/* Bottom: theme + profile */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>

        {/* Theme toggle */}
        <button onClick={toggle} style={{
          display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px',
          borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--text2)',
          background: 'transparent', border: 'none', width: '100%', transition: 'all 0.15s',
        }}
        onMouseOver={e => { e.currentTarget.style.background = 'var(--bg2)'; e.currentTarget.style.color = 'var(--text)'; }}
        onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)'; }}>
          {theme === 'dark'
            ? <Icon d="M12 3v1m0 16v1m8.66-13l-.87.5M4.21 17.5l-.87.5M20.66 17.5l-.87-.5M4.21 6.5l-.87-.5M21 12h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
            : <Icon d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          }
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        {/* Profile */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 'var(--radius)' }}>
            <img src={user.avatarUrl} alt="" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.username}</div>
            </div>
            <button onClick={logout} title="Logout" style={{ background: 'none', border: 'none', color: 'var(--text3)', padding: 2, borderRadius: 4, transition: 'color 0.15s', flexShrink: 0 }}
              onMouseOver={e => (e.currentTarget.style.color = 'var(--danger)')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--text3)')}>
              <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" size={15} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
