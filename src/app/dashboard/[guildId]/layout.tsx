'use client';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Sidebar from '@/components/layout/Sidebar';

export default function GuildLayout({ children }: { children: React.ReactNode }) {
  const { guildId } = useParams<{ guildId: string }>();
  const { user } = useAuth();
  const guild = user?.adminGuilds?.find(g => g.id === guildId);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar guildId={guildId} guildName={guild?.name} guildIcon={guild?.icon} />
      <main style={{ flex: 1, minWidth: 0, marginLeft: 0, paddingTop: 'var(--topnav-h)', transition: 'margin-left 0.25s' }} className="dashboard-main">
        <div style={{ padding: '24px 20px', maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </div>
      </main>
      <style>{`
        @media (min-width: 768px) {
          .dashboard-main { margin-left: var(--sidebar-w) !important; padding-top: 0 !important; }
        }
      `}</style>
    </div>
  );
}
