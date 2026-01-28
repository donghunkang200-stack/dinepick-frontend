import Skeleton from "react-loading-skeleton";
import "./RestaurantCard.css"; // 경로는 너 구조에 맞게
// (skeleton.css 전역 import는 main/App에서 1번만 하면 됨)

const SkeletonRestaurantCard = () => {
  return (
    <article className="restaurant-card" aria-label="Loading restaurant card">
      {/* 이미지 래퍼 */}
      <div className="restaurant-image">
        <Skeleton height={220} style={{ width: "100%", display: "block" }} />
      </div>

      {/* 카드 내부 콘텐츠 */}
      <div className="restaurant-body">
        <div className="restaurant-name-row">
          <h3 className="restaurant-name" style={{ width: "100%" }}>
            <Skeleton height={14} width="72%" />
          </h3>
        </div>

        <div className="restaurant-meta">
          <Skeleton
            className="restaurant-chip"
            aria-hidden="true"
            height={11}
            width={48}
          />
        </div>

        <div className="restaurant-actions">
          <button type="button" className="restaurant-action" disabled>
            <Skeleton height={12} width={44} />
          </button>
          <button type="button" className="restaurant-action primary" disabled>
            <Skeleton height={12} width={54} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default SkeletonRestaurantCard;
