'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

interface Trader { user_id: string; trades: number; volume: number; }

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const { guildId } = useParams<{ guildId: string }>();
  const [traders, setTraders] = useState<Trader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLeaderboard(guildId)
      .then(d => setTraders(d.leaderboard || []))
      .finally(() => setLoading(false));
  }, [guildId]);

  const maxVol = traders[0]?.volume || 1;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4 }}>Leaderboard</h1>
        <p style={{ fontSize: 14, color: 'var(--text2)' }}>Top traders by completed volume</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : traders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text3)', fontSize: 14 }}>
          No completed trades yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {traders.map((trader, i) => (
            <div key={trader.user_id} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: 'var(--surface)', border: `1px solid ${i === 0 ? 'var(--accent-border)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)', padding: '14px 18px',
              transition: 'border-color 0.15s',
            }}>
              {/* Rank */}
              <div style={{ width: 28, textAlign: 'center', fontSize: i < 3 ? 18 : 13, color: 'var(--text3)', fontWeight: 600, flexShrink: 0 }}>
                {i < 3 ? MEDALS[i] : `#${i + 1}`}
              </div>

              {/* Avatar placeholder */}
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text3)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                {trader.user_id.slice(-2).toUpperCase()}
              </div>

              {/* ID + bar */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text)', fontWeight: 500 }}>
                    {trader.user_id}
                  </span>
                  <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 1 }}>Trades</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{trader.trades}</div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 80 }}>
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 1 }}>Volume</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: i === 0 ? 'var(--accent)' : 'var(--text)' }}>
                        ${Number(trader.volume).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Volume bar */}
                <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(trader.volume / maxVol) * 100}%`, background: i === 0 ? 'var(--accent)' : 'var(--border2)', borderRadius: 2, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
