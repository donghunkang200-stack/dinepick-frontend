import RestaurantGrid from "../restaurants/RestaurantGrid";
import "./DetailRelatedSection.css";

// 상세 페이지 하단 연관 레스토랑 섹션
const DetailRelatedSection = ({ items }) => {
  return (
    <section className="detail-related">
      <h2 className="detail-related-title">추천하는 레스토랑</h2>
      <RestaurantGrid items={items} />
    </section>
  );
};

export default DetailRelatedSection;
