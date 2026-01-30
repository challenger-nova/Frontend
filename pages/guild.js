import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

export default function Guild() {
  const chartRef = useRef();
  const [stats, setStats] = useState(null);

  // TEMP: hardcode a guild ID for testing
  const GUILD_ID = "PUT_GUILD_ID_HERE";

  useEffect(() => {
    fetch(`https://uranium-backend-19yu.onrender.com/api/stats/${GUILD_ID}`)
      .then(res => res.json())
      .then(data => {
        setStats(data);

        new Chart(chartRef.current, {
          type: "bar",
          data: {
            labels: data.chart.map(x => x.day),
            datasets: [{
              data: data.chart.map(x => x.total),
              backgroundColor: "#4f46e5"
            }]
          },
          options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
          }
        });
      });
  }, []);

  if (!stats) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div style={{ padding: 40, fontFamily: "Inter" }}>
      <h2>Server Dashboard</h2>

      <div style={{ display: "flex", gap: 40 }}>
        <div>
          <h4>Total Escrows</h4>
          <b>{stats.total}</b>
        </div>

        <div>
          <h4>Total Balance</h4>
          <b>{stats.balance}</b>
        </div>
      </div>

      <h3 style={{ marginTop: 40 }}>Balance (Last 7 Days)</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
