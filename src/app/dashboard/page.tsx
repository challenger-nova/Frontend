'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';

interface Guild { id: string; name: string; icon: string | null; botInstalled?: boolean; memberCount?: number | null; }

export default function DashboardPage() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [guilds, setGuilds]         = useState<Guild[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    api.getGuilds()
      .then(d => setGuilds(d.guilds || []))
      .catch(() => setGuilds((user?.adminGuilds as Guild[]) || []))
      .finally(() => setLoading(false));
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try { await api.refreshGuilds(); await refresh(); const d = await api.getGuilds(); setGuilds(d.guilds || []); }
    finally { setRefreshing(false); }
  };

  const botGuilds = guilds.filter(g => g.botInstalled);
  const noBot     = guilds.filter(g => !g.botInstalled);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 3 }}>Your servers</h1>
          <p style={{ fontSize: 13, color: 'var(--text3)' }}>Select a server to manage its escrow dashboard</p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 500, color: 'var(--text2)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', transition: 'all 0.15s' }}
          onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }}>
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      ) : (
        <>
          {botGuilds.length > 0 && (
            <section style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text3)' }}>Bot installed</div>
                <div style={{ padding: '2px 8px', background: 'var(--success-bg)', color: 'var(--success)', fontSize: 11, fontWeight: 600, borderRadius: 20 }}>{botGuilds.length}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
                {botGuilds.map(g => <GuildCard key={g.id} guild={g} onClick={() => router.push(`/dashboard/${g.id}`)} />)}
              </div>
            </section>
          )}
          {noBot.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text3)' }}>Bot not installed</div>
                <div style={{ padding: '2px 8px', background: 'var(--bg3)', color: 'var(--text3)', fontSize: 11, fontWeight: 600, borderRadius: 20 }}>{noBot.length}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
                {noBot.map(g => <GuildCard key={g.id} guild={g} disabled />)}
              </div>
            </section>
          )}
          {guilds.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>No servers found</div>
              <div style={{ fontSize: 13, color: 'var(--text3)' }}>You need to be an admin of a server to see it here</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function GuildCard({ guild, onClick, disabled }: { guild: Guild; onClick?: () => void; disabled?: boolean }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={disabled ? undefined : onClick} onMouseOver={() => setH(true)} onMouseOut={() => setH(false)} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
      background: h && !disabled ? 'var(--bg3)' : 'var(--surface)',
      border: `1px solid ${h && !disabled ? 'var(--accent-border)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)', cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.45 : 1, transition: 'all 0.15s', boxShadow: h && !disabled ? 'var(--shadow-sm)' : 'none',
    }}>
      {guild.icon ? (
        <img src={guild.icon} alt="" style={{ width: 42, height: 42, borderRadius: 11, objectFit: 'cover', flexShrink: 0 }} />
      ) : (
        <div style={{ width: 42, height: 42, borderRadius: 11, background: 'linear-gradient(135deg, var(--accent-bg), var(--bg3))', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
          {guild.name[0]?.toUpperCase()}
        </div>
      )}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{guild.name}</div>
        <div style={{ fontSize: 12, color: 'var(--text3)' }}>
          {guild.memberCount ? `${guild.memberCount.toLocaleString()} members` : disabled ? 'Install bot to access' : 'Open dashboard'}
        </div>
      </div>
      {!disabled && (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={h ? 'var(--accent)' : 'var(--text3)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.15s', flexShrink: 0 }}>
          <path d="M9 18l6-6-6-6"/>
        </svg>
      )}
    </div>
  );
}
