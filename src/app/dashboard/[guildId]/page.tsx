'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { api } from '@/lib/api';
import { useTheme } from '@/lib/theme';

interface Stats { totalEscrows: number; totalVolume: number; activeEscrows: number; completedEscrows: number; disputedEscrows: number; }
interface ChartPoint { day: string; volume: number; count: number; }

export default function GuildOverviewPage() {
  const { guildId } = useParams<{ guildId: string }>();
  const { theme } = useTheme();
  const [stats, setStats]   = useState<Stats | null>(null);
  const [chart, setChart]   = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getStats(guildId), api.getChart(guildId)])
      .then(([s, c]) => { setStats(s); setChart(c.chart || []); })
      .finally(() => setLoading(false));
  }, [guildId]);

  const mutedColor  = theme === 'dark' ? '#6f6e69' : '#a8a49e';
  const gridColor   = theme === 'dark' ? '#2a2a27' : '#e4e4e1';
  const tooltipBg   = theme === 'dark' ? '#1e1e1b' : '#ffffff';

  const formatDay = (day: string) => {
    const d = new Date(day);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const shortDay = (day: string) => new Date(day).toLocaleDateString('en-US', { weekday: 'short' });

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '1.75rem' }}>Overview</h1>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
        <StatCard label="Total escrows"   value={stats?.totalEscrows ?? 0} />
        <StatCard label="Total volume"    value={`$${Number(stats?.totalVolume ?? 0).toLocaleString()}`} />
        <StatCard label="Active"          value={stats?.activeEscrows ?? 0} color="var(--info)" />
        <StatCard label="Completed"       value={stats?.completedEscrows ?? 0} color="var(--accent)" />
        <StatCard label="Disputed"        value={stats?.disputedEscrows ?? 0} color="var(--danger)" />
      </div>

      {/* Chart */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>7-day volume</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>Daily escrow volume over the last 7 days</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            ${chart.reduce((s, d) => s + d.volume, 0).toLocaleString()}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chart} barSize={28} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke={gridColor} strokeDasharray="3 3" />
            <XAxis dataKey="day" tickFormatter={shortDay} tick={{ fontSize: 12, fill: mutedColor }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: mutedColor }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} width={48} />
            <Tooltip
              cursor={{ fill: 'var(--bg2)' }}
              contentStyle={{ background: tooltipBg, border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }}
              labelFormatter={formatDay}
              formatter={(v: number) => [`$${v.toLocaleString()}`, 'Volume']}
            />
            <Bar dataKey="volume" fill="var(--accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ background: 'var(--bg2)', borderRadius: 'var(--radius)', padding: '1rem', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: color || 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
    </div>
  );
}
