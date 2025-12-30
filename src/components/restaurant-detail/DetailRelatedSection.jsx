import RestaurantGrid from "../restaurants/RestaurantGrid";
import "./DetailRelatedSection.css";

/*
  DetailRelatedSection
  - Related posts/restaurants grid
*/
const DetailRelatedSection = ({ items }) => {
  return (
    <section className="detail-related">
      <h2 className="detail-related-title">관련 게시물</h2>
      <RestaurantGrid items={items} />
    </section>
  );
};

export default DetailRelatedSection;
