import "./Testimonials.css";

const REVIEWS = [
  { text: "“훌륭한 감성 레이아웃”", name: "이름", role: "설명" },
  { text: "“밸런스적인 UI도 좋다”", name: "이름", role: "설명" },
  { text: "“진정으로 빛나는 리뷰”", name: "이름", role: "설명" },
];

export default function Testimonials() {
  return (
    <section className="t-section">
      <div className="container">
        <h2 className="t-title">섹션 제목</h2>

        <div className="t-grid">
          {REVIEWS.map((r, i) => (
            <div key={i} className="t-card">
              <div className="t-text">{r.text}</div>
              <div className="t-user">
                <div className="t-avatar" />
                <div>
                  <div className="t-name">{r.name}</div>
                  <div className="t-role">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
