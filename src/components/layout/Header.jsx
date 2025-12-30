import "./Layout.css";

export default function Header() {
  return (
    <header style={{ borderBottom: "1px solid #eee" }}>
      <div
        className="container"
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontWeight: 800, letterSpacing: 0.3 }}>DINE PICK</div>

        <nav style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <a href="#" style={linkStyle}>
            레스토랑
          </a>
          <a href="#" style={linkStyle}>
            마이페이지
          </a>
          <button style={primaryBtn}>예약하기</button>
        </nav>
      </div>
    </header>
  );
}

const linkStyle = {
  color: "#111",
  textDecoration: "none",
  fontSize: 14,
};

const primaryBtn = {
  border: "none",
  background: "#111",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: 10,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 700,
};
