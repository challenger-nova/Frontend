'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

interface Escrow {
  id: number;
  escrowId: string;
  sellerId: string;
  buyerId: string;
  buyerWallet: string;
  chain: string;
  amount: number;
  fee: number;
  total: number;
  depositAddress: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PAID:      { bg: 'var(--accent-bg)',  color: 'var(--accent)' },
  COMPLETED: { bg: 'var(--accent-bg)',  color: 'var(--accent)' },
  PENDING:   { bg: 'var(--info-bg)',    color: 'var(--info)' },
  EXPIRED:   { bg: 'var(--bg3)',        color: 'var(--text3)' },
  DISPUTED:  { bg: 'var(--danger-bg)',  color: 'var(--danger)' },
};

function shortUser(id?: string) {
  return id ? '…' + id.slice(-6) : '—';
}

function formatDate(d?: string) {
  if (!d) return '—';
  const date = new Date(d);
  return isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function EscrowsPage() {
  const { guildId } = useParams<{ guildId: string }>();
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const fetchEscrows = async (p = page, s = status) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(p), limit: '20' };
      if (s) params.status = s;

      const data = await api.getEscrows(guildId, params);

      setEscrows(data.escrows || []);
      setTotal(data.pagination?.total || 0);
      setPages(data.pagination?.pages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscrows(1, '');
  }, [guildId]);

  const handleStatus = (s: string) => {
    setStatus(s);
    setPage(1);
    fetchEscrows(1, s);
  };

  const handlePage = (p: number) => {
    setPage(p);
    fetchEscrows(p, status);
  };

  const statuses = ['', 'PAID', 'PENDING', 'EXPIRED', 'DISPUTED'];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Escrows</h1>
        <p>{total.toLocaleString()} total trades</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem' }}>
        {statuses.map(s => (
          <button key={s} onClick={() => handleStatus(s)}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : escrows.length === 0 ? (
        <div>No escrows found</div>
      ) : isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {escrows.map(e => {
            const c = STATUS_COLORS[e.status] || { bg: 'var(--bg3)', color: 'var(--text3)' };

            return (
              <div key={e.id} style={{ padding: 12 }}>
                
                {/* ID */}
                <div>{e.escrowId}</div>

                {/* STATUS + AMOUNT */}
                <div>
                  <span style={c}>{e.status}</span>

                  {/* ✅ FIXED: amount instead of total */}
                  <span>
                    {Number(e.amount || 0).toFixed(4)} {e.chain}
                  </span>
                </div>

                {/* USERS */}
                <div>
                  {shortUser(e.buyerId)} → {shortUser(e.sellerId)}
                </div>

                {/* DATE */}
                <div>
                  {formatDate(e.createdAt)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <table>
          <tbody>
            {escrows.map(e => (
              <tr key={e.id}>
                <td>{e.escrowId}</td>
                <td>{shortUser(e.buyerId)}</td>
                <td>{shortUser(e.sellerId)}</td>

                {/* ✅ FIXED */}
                <td>{Number(e.amount || 0).toFixed(4)}</td>

                <td>{e.chain}</td>
                <td>{e.status}</td>

                {/* ✅ FIXED */}
                <td>{formatDate(e.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}