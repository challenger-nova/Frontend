'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

interface Escrow {
  id: number; escrow_id: string; seller_id: string; buyer_id: string;
  buyer_wallet: string; chain: string; amount: number; fee: number;
  total: number; deposit_address: string; status: string;
  created_at: string; updated_at: string | null;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PAID:      { bg: 'var(--accent-bg)',  color: 'var(--accent)' },
  COMPLETED: { bg: 'var(--accent-bg)',  color: 'var(--accent)' },
  PENDING:   { bg: 'var(--info-bg)',    color: 'var(--info)' },
  EXPIRED:   { bg: 'var(--bg3)',        color: 'var(--text3)' },
  DISPUTED:  { bg: 'var(--danger-bg)', color: 'var(--danger)' },
};

function shortUser(id: string) { return id ? '…' + id.slice(-6) : '—'; }
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function EscrowsPage() {
  const { guildId } = useParams<{ guildId: string }>();
  const [escrows, setEscrows]   = useState<Escrow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(0);
  const [pages, setPages]       = useState(1);
  const [status, setStatus]     = useState('');
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
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchEscrows(1, ''); }, [guildId]);

  const handleStatus = (s: string) => { setStatus(s); setPage(1); fetchEscrows(1, s); };
  const handlePage   = (p: number)  => { setPage(p); fetchEscrows(p, status); };

  const statuses = ['', 'PAID', 'PENDING', 'EXPIRED', 'DISPUTED'];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4 }}>Escrows</h1>
        <p style={{ fontSize: 14, color: 'var(--text2)' }}>{total.toLocaleString()} total trades</p>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: '1.25rem', WebkitOverflowScrolling: 'touch' as any }}>
        {statuses.map(s => (
          <button key={s} onClick={() => handleStatus(s)} style={{
            padding: '6px 12px', borderRadius: 'var(--radius)', fontSize: 12, fontWeight: 500,
            border: `1px solid ${status === s ? 'var(--accent)' : 'var(--border)'}`,
            background: status === s ? 'var(--accent-bg)' : 'var(--surface)',
            color: status === s ? 'var(--accent)' : 'var(--text2)',
            whiteSpace: 'nowrap' as any, flexShrink: 0, transition: 'all 0.15s',
          }}>{s || 'All'}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : escrows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text3)', fontSize: 14 }}>No escrows found</div>
      ) : isMobile ? (
        // ── MOBILE cards ─────────────────────────────────────
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {escrows.map(e => {
            const c = STATUS_COLORS[e.status] || { bg: 'var(--bg3)', color: 'var(--text3)' };
            return (
              <div key={e.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{e.escrow_id}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', ...c }}>{e.status}</span>
                    <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{Number(e.total).toFixed(4)} <span style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase' as any }}>{e.chain}</span></span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>
                    <span>{shortUser(e.buyer_id)}</span>
                    <span style={{ color: 'var(--text3)' }}>→</span>
                    <span>{shortUser(e.seller_id)}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text3)' }}>{formatDate(e.created_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // ── DESKTOP table ─────────────────────────────────────
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['ID', 'Buyer', 'Seller', 'Amount', 'Chain', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as any, color: 'var(--text3)', whiteSpace: 'nowrap' as any }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {escrows.map((e, i) => {
                  const c = STATUS_COLORS[e.status] || { bg: 'var(--bg3)', color: 'var(--text3)' };
                  return (
                    <tr key={e.id} style={{ borderBottom: i < escrows.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.1s' }}
                      onMouseOver={ev => (ev.currentTarget.style.background = 'var(--bg2)')}
                      onMouseOut={ev => (ev.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text)' }}>{e.escrow_id}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--text2)' }}>{shortUser(e.buyer_id)}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--text2)' }}>{shortUser(e.seller_id)}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap' as any }}>{Number(e.total).toFixed(4)}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text2)', textTransform: 'uppercase' as any, fontSize: 12 }}>{e.chain}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', ...c }}>{e.status}</span>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text3)', whiteSpace: 'nowrap' as any }}>{formatDate(e.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', fontSize: 13, color: 'var(--text2)' }}>
          <span>Page {page} of {pages}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => handlePage(page - 1)} disabled={page <= 1} style={{ padding: '6px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text2)', opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? 'default' : 'pointer' }}>←</button>
            <button onClick={() => handlePage(page + 1)} disabled={page >= pages} style={{ padding: '6px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text2)', opacity: page >= pages ? 0.4 : 1, cursor: page >= pages ? 'default' : 'pointer' }}>→</button>
          </div>
        </div>
      )}
    </div>
  );
}
