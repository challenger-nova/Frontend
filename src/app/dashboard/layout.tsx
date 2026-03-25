'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ width: 22, height: 22, border: '2.5px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );

  if (!user) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{
        flex: 1, minWidth: 0,
        marginLeft: 0,
        paddingTop: 'var(--topnav-h)',
        transition: 'margin-left 0.25s',
      }} className="dashboard-main">
        <div style={{ padding: '24px 20px', maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </div>
      </main>
      <style>{`
        @media (min-width: 768px) {
          .dashboard-main {
            margin-left: var(--sidebar-w) !important;
            padding-top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
