'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

interface Trader {
  userId?: string;
  user_id?: string;
  trades: number;
  volume: number;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const { guildId } = useParams<{ guildId: string }>();
  const [traders, setTraders] = useState<Trader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLeaderboard(guildId)
      .then(d => setTraders(d?.leaderboard || []))
      .catch(() => setTraders([]))
      .finally(() => setLoading(false));
  }, [guildId]);

  // ✅ safe max
  const maxVol = Math.max(...traders.map(t => Number(t.volume) || 0), 1);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Leaderboard</h1>
        <p>Top traders by completed volume</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>
      ) : traders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          No completed trades yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {traders.map((trader, i) => {
            // ✅ support both formats (fixes ALL crashes)
            const userId = trader.userId || trader.user_id || 'unknown';

            const safeVolume = Number(trader.volume) || 0;
            const percent = Math.min((safeVolume / maxVol) * 100, 100);

            return (
              <div
                key={userId + i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  background: 'var(--surface)',
                  border: `1px solid ${i === 0 ? 'var(--accent-border)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 18px',
                  transition: 'border-color 0.15s',
                }}
              >
                {/* Rank */}
                <div style={{
                  width: 28,
                  textAlign: 'center',
                  fontSize: i < 3 ? 18 : 13,
                  color: 'var(--text3)',
                  fontWeight: 600,
                  flexShrink: 0
                }}>
                  {i < 3 ? MEDALS[i] : `#${i + 1}`}
                </div>

                {/* Avatar */}
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text3)',
                  fontFamily: 'var(--font-mono)',
                  flexShrink: 0
                }}>
                  {(userId.slice(-2) || '--').toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 6
                  }}>
                    <span style={{
                      fontSize: 13,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text)',
                      fontWeight: 500
                    }}>
                      {userId}
                    </span>

                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>Trades</div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>
                          {trader.trades || 0}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', minWidth: 80 }}>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>Volume</div>
                        <div style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: i === 0 ? 'var(--accent)' : 'var(--text)'
                        }}>
                          {safeVolume.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bar */}
                  <div style={{
                    height: 4,
                    background: 'var(--bg3)',
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${percent}%`,
                        background: i === 0 ? 'var(--accent)' : 'var(--border2)',
                        borderRadius: 2,
                        transition: 'width 0.6s ease'
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}