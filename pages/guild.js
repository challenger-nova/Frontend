import { useEffect, useState } from "react";

export default function Guilds() {
  const [guilds, setGuilds] = useState([]);

  useEffect(() => {
    fetch("https://api.lectos.net/auth/guilds", {
      credentials: "include"
    })
      .then(r => r.json())
      .then(data => {
        // admin-only guilds
        setGuilds(data.filter(g => (g.permissions & 0x8) === 0x8));
      });
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "Inter" }}>
      <h2>Select a Server</h2>

      {guilds.map(g => (
        <a
          key={g.id}
          href={`/guild?guild=${g.id}`}
          style={{
            display: "block",
            padding: 16,
            marginBottom: 12,
            background: "#111827",
            color: "#fff",
            borderRadius: 10,
            textDecoration: "none"
          }}
        >
          {g.name}
        </a>
      ))}
    </div>
  );
}
