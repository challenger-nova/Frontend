'use client';
import { useEffect, useState } from 'react';
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
      <main style={{ marginLeft: 'var(--sidebar-w)', flex: 1, minWidth: 0, padding: '2rem 2.5rem' }}>
        {children}
      </main>
    </div>
  );
}
