'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { api } from '@/lib/api';

function CallbackContent() {
  const router = useRouter();
    const params = useSearchParams();
      const sid    = params.get('sid');

        useEffect(() => {
            if (!sid) {
                  router.replace('/login?error=oauth_failed');
                        return;
                            }

                                // Verify session with backend using the sid
                                    api.getMeBySid(sid)
                                          .then(() => router.replace('/dashboard'))
                                                .catch(() => router.replace('/login?error=oauth_failed'));
                                                  }, [sid, router]);

                                                    return (
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16 }}>
                                                              <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                                                    <p style={{ fontSize: 14, color: 'var(--text2)' }}>Logging you in...</p>
                                                                        </div>
                                                                          );
                                                                          }

                                                                          export default function AuthCallbackPage() {
                                                                            return (
                                                                                <Suspense fallback={
                                                                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                                                                                              <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                                                                                    </div>
                                                                                                        }>
                                                                                                              <CallbackContent />
                                                                                                                  </Suspense>
                                                                                                                    );
                                                                                                                    }
                                                                                                                    