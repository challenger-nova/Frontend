'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { api } from '@/lib/api';
import { useTheme } from '@/lib/theme';

interface Stats { totalEscrows: number; totalVolume: number; activeEscrows: number; completedEscrows: number; disputedEscrows: number; }
interface ChartPoint { day: string; volume: number; count: number; }

function StatCard({ label, value, sub, color, icon }: { label: string; value: string | number; sub?: string; color?: string; icon: string }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 22px', boxShadow: 'var(--shadow-sm)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color || 'var(--accent)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{label}</span>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: color ? `${color}15` : 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color || 'var(--accent)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={icon}/></svg>
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export default function GuildOverviewPage() {
  const { guildId } = useParams<{ guildId: string }>();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [stats, setStats]   = useState<Stats | null>(null);
  const [chart, setChart]   = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const guild = user?.adminGuilds?.find(g => g.id === guildId);

  useEffect(() => {
    Promise.all([api.getStats(guildId), api.getChart(guildId)])
      .then(([s, c]) => { setStats(s); setChart(c.chart || []); })
      .finally(() => setLoading(false));
  }, [guildId]);

  const isDark = theme === 'dark';
  const mutedColor  = isDark ? '#4A5568' : '#9BA3BF';
  const gridColor   = isDark ? '#1E2D40' : '#E8EAF0';
  const tooltipBg   = isDark ? '#111827' : '#FFFFFF';
  const shortDay    = (day: string) => new Date(day).toLocaleDateString('en-US', { weekday: 'short' });
  const formatDay   = (day: string) => new Date(day).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const weekTotal   = chart.reduce((s, d) => s + d.volume, 0);

  return (
    <div className="fade-in">
      {/* Page header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          {guild?.icon ? (
            <img src={guild.icon} alt="" style={{ width: 32, height: 32, borderRadius: 9, objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>
              {guild?.name?.[0]?.toUpperCase() || 'S'}
            </div>
          )}
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>{guild?.name || 'Overview'}</h1>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text3)' }}>Escrow activity and performance metrics</p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
          <StatCard label="Total escrows" value={stats?.totalEscrows ?? 0} icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          <StatCard label="Total volume" value={`${Number(stats?.totalVolume ?? 0).toFixed(4)}`} icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <StatCard label="Active" value={stats?.activeEscrows ?? 0} color="var(--accent)" icon="M13 10V3L4 14h7v7l9-11h-7z" />
          <StatCard label="Completed" value={stats?.completedEscrows ?? 0} color="var(--success)" icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          <StatCard label="Disputed" value={stats?.disputedEscrows ?? 0} color="var(--danger)" icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </div>
      )}

      {/* Chart */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>7-day volume</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>Daily escrow volume over the last 7 days</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>{weekTotal.toFixed(4)}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>7-day total</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chart} barSize={28} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke={gridColor} strokeDasharray="3 3" />
            <XAxis dataKey="day" tickFormatter={shortDay} tick={{ fontSize: 11, fill: mutedColor, fontFamily: 'Plus Jakarta Sans' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: mutedColor, fontFamily: 'Plus Jakarta Sans' }} axisLine={false} tickLine={false} width={45} />
            <Tooltip
              cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', radius: 6 }}
              contentStyle={{ background: tooltipBg, border: `1px solid var(--border)`, borderRadius: 10, fontSize: 12, fontFamily: 'Plus Jakarta Sans', boxShadow: 'var(--shadow)' }}
              labelFormatter={formatDay}
              formatter={(v: number) => [v.toFixed(4), 'Volume']}
            />
            <Bar dataKey="volume" fill="var(--accent)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
