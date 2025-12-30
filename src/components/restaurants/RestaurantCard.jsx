import { useNavigate } from "react-router-dom";
import "./RestaurantCard.css";

/*
  RestaurantCard
  - Single restaurant preview card
  - Navigates to detail page on click
*/
const RestaurantCard = ({ item }) => {
  const navigate = useNavigate();
  const { id, name, region, category, rating, priceRange, imageUrl } = item;

  const handleOpenDetail = () => {
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
      aria-label={`Open ${name} details`}
    >
      <div className="restaurant-image">
        <img src={imageUrl} alt={name} />
      </div>

      <div className="restaurant-body">
        <div className="restaurant-name-row">
          <h3 className="restaurant-name">{name}</h3>

          <div className="restaurant-rating-badge" aria-label="Rating badge">
            <span className="restaurant-rating-dot" />
            {rating.toFixed(1)}
          </div>
        </div>

        <div className="restaurant-meta">
          <span className="restaurant-pill">{region}</span>
          <span className="restaurant-pill">{category}</span>
          <span className="restaurant-pill">{priceRange}</span>
        </div>

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
