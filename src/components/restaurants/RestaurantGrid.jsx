import RestaurantCard from "./RestaurantCard";
import "./RestaurantGrid.css";

// - 레스토랑 카드들을 그리드 형태로 렌더링
// - 결과가 없을 경우 Empty State 표시
const RestaurantGrid = ({ items = [] }) => {
  // 검색 결과 없음
  if (items.length === 0) {
    return (
      <div className="restaurant-empty">
        <div className="restaurant-empty-title">검색 결과가 없습니다</div>
        <div className="restaurant-empty-desc">
          다른 지역을 선택하거나 필터를 변경해보세요.
        </div>
      </div>
    );
  }

  return (
    <section className="restaurant-grid" aria-label="레스토랑 목록">
      {items.map((item) => (
        <RestaurantCard key={item.id} item={item} />
      ))}
    </section>
  );
};

export default RestaurantGrid;
