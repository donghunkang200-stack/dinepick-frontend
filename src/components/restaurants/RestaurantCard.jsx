import { useNavigate } from "react-router-dom";
import "./RestaurantCard.css";

// 레스토랑 카드 (클릭 시 상세 페이지 이동)
const RestaurantCard = ({ item }) => {
  const navigate = useNavigate();
  const fallbackImage = "/sushi.jpg";

  // 카드에 필요한 레스토랑 정보
  const { id, name = "", category = "", thumbnailUrl = "" } = item || {};

  // 썸네일 없을 경우 기본 이미지 사용
  const imageSrc = thumbnailUrl || fallbackImage;

  // 카드 클릭 → 상세 페이지 이동
  const handleOpenDetail = () => {
    if (!id) return;
    navigate(`/restaurants/${id}`);
  };

  return (
    <article
      className="restaurant-card"
      role="button"
      tabIndex={0}
      onClick={handleOpenDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleOpenDetail();
      }}
      aria-label={`Open ${name || "restaurant"} details`}
    >
      {/* 썸네일 이미지 */}
      <div className="restaurant-image">
        <img
          src={imageSrc}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
      </div>

      {/* 카드 본문 */}
      <div className="restaurant-body">
        {/* 레스토랑 이름 */}
        <div className="restaurant-name-row">
          <h3 className="restaurant-name">{name || " "}</h3>
        </div>

        {/* 카테고리 */}
        <div className="restaurant-meta">
          {category && (
            <span className="restaurant-chip" aria-label="Category">
              {category}
            </span>
          )}
        </div>

        {/* 액션 버튼 (카드 클릭 전파 방지) */}
        <div
          className="restaurant-actions"
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" className="restaurant-action">
            Details
          </button>
          <button type="button" className="restaurant-action primary">
            Reserve
          </button>
        </div>
      </div>
    </article>
  );
};

export default RestaurantCard;
