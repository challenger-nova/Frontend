'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';

interface Guild {
  id: string; name: string; icon: string | null;
  botInstalled: boolean; memberCount: number | null; ownerId: string | null;
}

export default function DashboardPage() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [guilds, setGuilds]       = useState<Guild[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    api.getGuilds()
      .then(d => setGuilds(d.guilds || []))
      .catch(() => setGuilds(user?.adminGuilds || []))
      .finally(() => setLoading(false));
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await api.refreshGuilds();
      await refresh();
      const d = await api.getGuilds();
      setGuilds(d.guilds || []);
    } finally {
      setRefreshing(false);
    }
  };

  const botGuilds  = guilds.filter(g => g.botInstalled);
  const noBot      = guilds.filter(g => !g.botInstalled);

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Your servers
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text2)' }}>
            Select a server to view its escrow dashboard
          </p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
          background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
          fontSize: 13, color: 'var(--text2)', transition: 'all 0.15s',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }}>
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : (
        <>
          {/* Servers with bot */}
          {botGuilds.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.75rem' }}>
                Bot installed — {botGuilds.length} server{botGuilds.length !== 1 ? 's' : ''}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
                {botGuilds.map(guild => (
                  <GuildCard key={guild.id} guild={guild} onClick={() => router.push(`/dashboard/${guild.id}`)} />
                ))}
              </div>
            </section>
          )}

          {/* Servers without bot */}
          {noBot.length > 0 && (
            <section>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '0.75rem' }}>
                Bot not installed — {noBot.length} server{noBot.length !== 1 ? 's' : ''}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
                {noBot.map(guild => (
                  <GuildCard key={guild.id} guild={guild} disabled />
                ))}
              </div>
            </section>
          )}

          {guilds.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text2)' }}>
              <div style={{ fontSize: 32, marginBottom: '1rem' }}>🔍</div>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>No servers found</div>
              <div style={{ fontSize: 13 }}>You need to be an admin of a server to see it here</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function GuildCard({ guild, onClick, disabled }: { guild: Guild; onClick?: () => void; disabled?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={disabled ? undefined : onClick}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
        background: hovered && !disabled ? 'var(--bg2)' : 'var(--surface)',
        border: `1px solid ${hovered && !disabled ? 'var(--border2)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)', cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1, transition: 'all 0.15s',
      }}>
      {guild.icon ? (
        <img src={guild.icon} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
      ) : (
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>
          {guild.name[0]?.toUpperCase()}
        </div>
      )}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{guild.name}</div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
          {guild.memberCount ? `${guild.memberCount.toLocaleString()} members` : disabled ? 'Add bot to access' : 'Click to open'}
        </div>
      </div>
      {!disabled && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      )}
    </div>
  );
}
