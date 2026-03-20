'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

interface Escrow {
  id: string; buyer_id: string; seller_id: string; amount: number;
  currency: string; status: string; description: string;
  created_at: string; completed_at: string | null;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  active:    { bg: 'var(--info-bg)',    color: 'var(--info)' },
  completed: { bg: 'var(--accent-bg)', color: 'var(--accent)' },
  disputed:  { bg: 'var(--danger-bg)', color: 'var(--danger)' },
  cancelled: { bg: 'var(--bg3)',       color: 'var(--text3)' },
};

export default function EscrowsPage() {
  const { guildId } = useParams<{ guildId: string }>();
  const [escrows, setEscrows]   = useState<Escrow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(0);
  const [pages, setPages]       = useState(1);
  const [status, setStatus]     = useState('');

  const limit = 20;

  const fetch = async (p = page, s = status) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(p), limit: String(limit) };
      if (s) params.status = s;
      const data = await api.getEscrows(guildId, params);
      setEscrows(data.escrows || []);
      setTotal(data.pagination?.total || 0);
      setPages(data.pagination?.pages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(1, ''); }, [guildId]);

  const handleStatus = (s: string) => {
    setStatus(s); setPage(1); fetch(1, s);
  };

  const handlePage = (p: number) => {
    setPage(p); fetch(p, status);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const shortId = (id: string) => id.length > 12 ? id.slice(0, 8) + '…' : id;

  const statuses = ['', 'active', 'completed', 'disputed', 'cancelled'];

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4 }}>Escrows</h1>
          <p style={{ fontSize: 14, color: 'var(--text2)' }}>{total.toLocaleString()} total trades</p>
        </div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: 6 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => handleStatus(s)} style={{
              padding: '6px 12px', borderRadius: 'var(--radius)', fontSize: 12, fontWeight: 500,
              border: `1px solid ${status === s ? 'var(--accent)' : 'var(--border)'}`,
              background: status === s ? 'var(--accent-bg)' : 'var(--surface)',
              color: status === s ? 'var(--accent)' : 'var(--text2)',
              transition: 'all 0.15s',
            }}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          </div>
        ) : escrows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)', fontSize: 14 }}>No escrows found</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['ID', 'Buyer', 'Seller', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {escrows.map((e, i) => (
                  <tr key={e.id} style={{ borderBottom: i < escrows.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.1s' }}
                    onMouseOver={ev => (ev.currentTarget.style.background = 'var(--bg2)')}
                    onMouseOut={ev => (ev.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--text2)' }}>{shortId(e.id)}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{shortId(e.buyer_id)}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{shortId(e.seller_id)}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                      ${Number(e.amount).toLocaleString()} <span style={{ fontSize: 11, color: 'var(--text3)' }}>{e.currency}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', ...STATUS_COLORS[e.status] || STATUS_COLORS.cancelled }}>
                        {e.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{formatDate(e.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', fontSize: 13, color: 'var(--text2)' }}>
          <span>Page {page} of {pages}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <PagBtn label="←" disabled={page <= 1}     onClick={() => handlePage(page - 1)} />
            <PagBtn label="→" disabled={page >= pages} onClick={() => handlePage(page + 1)} />
          </div>
        </div>
      )}
    </div>
  );
}

function PagBtn({ label, disabled, onClick }: { label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '6px 14px', borderRadius: 'var(--radius)', fontSize: 13,
      border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text2)',
      opacity: disabled ? 0.4 : 1, cursor: disabled ? 'default' : 'pointer', transition: 'all 0.15s',
    }}>
      {label}
    </button>
  );
}
