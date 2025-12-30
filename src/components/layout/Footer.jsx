import "./Layout.css";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #eee", marginTop: 60 }}>
      <div className="container" style={{ padding: "24px 0" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
            gap: 24,
          }}
        >
          <div>
            <div style={{ fontWeight: 800, marginBottom: 10 }}>사이트 이름</div>
            <div style={{ display: "flex", gap: 10, opacity: 0.7 }}>
              <span>ⓕ</span>
              <span>ⓧ</span>
              <span>ⓘ</span>
              <span>ⓩ</span>
            </div>
          </div>

          <FooterCol title="회사" items={["소개", "채용", "문의"]} />
          <FooterCol title="서비스" items={["예약", "리뷰", "찜"]} />
          <FooterCol
            title="정책"
            items={["이용약관", "개인정보", "환불규정"]}
          />
        </div>

        <div style={{ marginTop: 20, fontSize: 12, opacity: 0.6 }}>
          © {new Date().getFullYear()} DINE PICK. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>{title}</div>
      <div style={{ display: "grid", gap: 8, fontSize: 13, opacity: 0.75 }}>
        {items.map((t) => (
          <a key={t} href="#" style={{ color: "#111", textDecoration: "none" }}>
            {t}
          </a>
        ))}
      </div>
    </div>
  );
}
