import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-top">
          <div>
            <h1 className="hero-title">최고의 레스토랑을 예약하세요</h1>
            <p className="hero-sub">전국 최고의 맛집을 한눈에</p>

            <div className="hero-search">
              <input placeholder="지역 / 레스토랑 검색" />
              <button>버튼</button>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <img
            alt="hero"
            src="https://images.unsplash.com/photo-1541544181074-e2df4c25d221?q=80&w=1600&auto=format&fit=crop"
          />
        </div>
      </div>
    </section>
  );
}
