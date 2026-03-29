'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

interface Trader {
  userId: string;
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

  const maxVol = traders[0]?.volume || 1;

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
            const userId = trader.userId || 'unknown';

            return (
              <div key={userId} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 18px'
              }}>
                
                {/* Rank */}
                <div>
                  {i < 3 ? MEDALS[i] : `#${i + 1}`}
                </div>

                {/* Avatar */}
                <div>
                  {(userId.slice(-2) || '--').toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div>
                    {userId}
                  </div>

                  <div>
                    Trades: {trader.trades}
                  </div>

                  <div>
                    Volume: {Number(trader.volume || 0).toFixed(4)}
                  </div>

                  {/* Bar */}
                  <div style={{ height: 4, background: '#333' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${(trader.volume / maxVol) * 100}%`,
                        background: '#6366f1'
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