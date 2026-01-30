export default function Home() {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      alignItems: "center",
      justifyContent: "center",
      background: "#0b0f14",
      color: "#fff",
      fontFamily: "Inter"
    }}>
      <a
        href="https://uranium-backend-19yu.onrender.com/auth/discord"
        style={{
          padding: "16px 28px",
          background: "#5865F2",
          borderRadius: 10,
          textDecoration: "none",
          color: "#fff",
          fontSize: 18
        }}
      >
        Login with Discord
      </a>
    </div>
  );
}
