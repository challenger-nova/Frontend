const COLORS: Record<string, { bg: string; color: string }> = {
  active:    { bg: 'var(--info-bg)',    color: 'var(--info)' },
  completed: { bg: 'var(--accent-bg)', color: 'var(--accent)' },
  disputed:  { bg: 'var(--danger-bg)', color: 'var(--danger)' },
  cancelled: { bg: 'var(--bg3)',       color: 'var(--text3)' },
};

export default function StatusBadge({ status }: { status: string }) {
  const c = COLORS[status] || COLORS.cancelled;
  return (
    <span style={{
      padding: '3px 8px', borderRadius: 4,
      fontSize: 11, fontWeight: 600,
      letterSpacing: '0.04em', textTransform: 'uppercase' as const,
      background: c.bg, color: c.color,
    }}>
      {status}
    </span>
  );
}
