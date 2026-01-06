import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SectionGrid.css";
import { fetchRestaurants } from "../../api/restaurants";

/*
  SectionGrid
  - Reusable card grid section
  - props:
      title: 섹션 제목
      keyword?: 검색어(선택)
      page?: 페이지(기본 0)
      size?: 불러올 개수(기본 6)
      onCardClick?: (restaurant) => void   // 있으면 이게 우선
*/
const SectionGrid = ({
  title,
  keyword = "",
  page = 0,
  size = 6,
  onCardClick,
  imageUrl = "/sushi.jpg",
}) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const pageData = await fetchRestaurants({ keyword, page, size });
        if (!alive) return;

        const content = Array.isArray(pageData?.content)
          ? pageData.content
          : [];
        setItems(content);
      } catch (e) {
        if (!alive) return;
        console.error(e);
        setError("레스토랑을 불러오지 못했어요.");
        setItems([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [keyword, page, size]);

  // 카드 클릭 시: onCardClick이 있으면 실행, 없으면 상세로 이동
  const handleCardClick = (restaurant) => {
    if (onCardClick) return onCardClick(restaurant);

    const id = restaurant.id ?? restaurant.restaurantId;
    if (!id) return;

    navigate(`/restaurants/${id}`);
  };

  return (
    <section className="section-grid">
      <div className="container">
        <h2 className="section-title">{title}</h2>

        {loading && <p className="section-grid-state">불러오는 중...</p>}
        {!loading && error && <p className="section-grid-state">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="section-grid-state">표시할 레스토랑이 없습니다.</p>
        )}

        <div className="grid">
          {items.map((restaurant, index) => {
            const id = restaurant.id ?? restaurant.restaurantId ?? index;

            const name =
              restaurant.name ??
              restaurant.title ??
              restaurant.restaurantName ??
              "레스토랑";

            const description =
              restaurant.description ??
              restaurant.summary ??
              restaurant.address ??
              "레스토랑 정보를 확인해보세요.";

            // public/sushi.jpg 사용
            const imageUrl = "/sushi.jpg";

            // const imageUrl =
            //   restaurant.imageUrl ??
            //   restaurant.thumbnailUrl ??
            //   restaurant.mainImageUrl ??
            //   "API 이미지 주소 ";

            return (
              <article
                key={id}
                className="card"
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(restaurant)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCardClick(restaurant);
                  }
                }}
              >
                {/* "이미지 클릭" 카드 전체 클릭이 UX 더 좋아서 카드에 걸어둠 */}
                <img src={imageUrl} alt={name} loading="lazy" />

                <div className="card-body">
                  <h3 className="card-title">{name}</h3>
                  <p className="card-description">{description}</p>
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
