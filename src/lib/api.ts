const API = process.env.NEXT_PUBLIC_API_URL || 'http://urianum.eu-4.evennode.com';

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || err.message || 'Request failed');
  }

  return res.json();
}

export const api = {
  // Auth
  getMe:          () => request('/auth/me'),
  logout:         () => request('/auth/logout', { method: 'POST' }),
  refreshGuilds:  () => request('/auth/refresh-guilds', { method: 'POST' }),
  loginUrl:       () => `${API}/auth/discord`,

  // Guilds
  getGuilds:      () => request('/guilds'),
  getGuild:       (id: string) => request(`/guilds/${id}`),

  // Escrows
  getStats:       (guildId: string) => request(`/guilds/${guildId}/escrows/stats`),
  getChart:       (guildId: string) => request(`/guilds/${guildId}/escrows/chart`),
  getEscrows:     (guildId: string, params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/guilds/${guildId}/escrows${qs}`);
  },
  getLeaderboard: (guildId: string) => request(`/guilds/${guildId}/escrows/leaderboard`),
  getEscrow:      (guildId: string, escrowId: string) => request(`/guilds/${guildId}/escrows/${escrowId}`),
};
