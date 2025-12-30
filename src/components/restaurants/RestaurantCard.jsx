import "./RestaurantCard.css";

/*
  RestaurantCard
  - Single restaurant preview card
*/
const RestaurantCard = ({ item }) => {
  const { name, region, category, rating, priceRange, imageUrl } = item;

  return (
    <article className="restaurant-card">
      <div className="restaurant-image">
        <img src={imageUrl} alt={name} />
      </div>

      <div className="restaurant-body">
        <div className="restaurant-name">{name}</div>

        <div className="restaurant-meta">
          <span className="restaurant-pill">{region}</span>
          <span className="restaurant-pill">{category}</span>
          <span className="restaurant-pill">{priceRange}</span>
        </div>

        <div className="restaurant-rating">
          <span className="restaurant-rating-label">Rating</span>
          <span className="restaurant-rating-value">{rating.toFixed(1)}</span>
        </div>
      </div>
    </article>
  );
};

export default RestaurantCard;
