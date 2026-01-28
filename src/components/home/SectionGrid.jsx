import { useEffect, useState } from "react";
import "./SectionGrid.css";
import { fetchRestaurants } from "../../api/restaurants";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMG = "/sushi.jpg";

const SectionGrid = ({ title, category = "ALL", size = 6 }) => {
  const navigate = useNavigate();

  // 상태
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 홈 추천 식당 로드(카테고리/사이즈 변경 시)
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchRestaurants({
          category,
          page: 0,
          size,
        });

        if (!alive) return;
        setItems(Array.isArray(data?.content) ? data.content : []);
      } catch (e) {
        console.error(e);
        if (!alive) return;

        setError("레스토랑을 불러오지 못했어요.");
        setItems([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [category, size]);

  return (
    <section className="section-grid">
      <div className="container">
        <div className="section-head">
          <h2 className="section-title">{title}</h2>
        </div>

        {loading && <p className="section-grid-state">불러오는 중...</p>}
        {!loading && error && <p className="section-grid-state">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="section-grid-state">표시할 레스토랑이 없습니다.</p>
        )}

        <div className="grid">
          {items.map((r) => {
            // 썸네일 fallback 처리
            const imgSrc = r.thumbnailUrl || FALLBACK_IMG;

            const goDetail = () => navigate(`/restaurants/${r.id}`);

            return (
              <article
                key={r.id}
                className="card"
                role="button"
                tabIndex={0}
                onClick={goDetail}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") goDetail();
                }}
              >
                <img
                  src={imgSrc}
                  alt={r.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                />

                <div className="card-body">
                  <h3 className="card-title">{r.name}</h3>
                  <p className="card-description">{r.description}</p>
                  <p className="card-meta">
                    {r.address} · 최대 {r.maxPeoplePerReservation}명
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SectionGrid;
