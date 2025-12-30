import RestaurantCard from "./RestaurantCard";
import "./RestaurantGrid.css";

/*
  RestaurantGrid
  - Grid layout for restaurant cards
*/
const RestaurantGrid = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="restaurant-empty">
        <div className="restaurant-empty-title">No results</div>
        <div className="restaurant-empty-desc">
          Try a different region or adjust filters.
        </div>
      </div>
    );
  }

  return (
    <section className="restaurant-grid">
      {items.map((item) => (
        <RestaurantCard key={item.id} item={item} />
      ))}
    </section>
  );
};

export default RestaurantGrid;
