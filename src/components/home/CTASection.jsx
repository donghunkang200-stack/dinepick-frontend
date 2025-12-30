import "./CTASection.css";

export default function CTASection() {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-box">
          <h2 className="cta-title">섹션 제목</h2>
          <div className="cta-actions">
            <button className="cta-primary">버튼</button>
            <button className="cta-ghost">보조 버튼</button>
          </div>
        </div>
      </div>
    </section>
  );
}
