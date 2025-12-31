import "./FavoritesSection.css";

/*
  FavoritesSection
  - Favorite restaurants grid
*/
const FavoritesSection = ({ favorites }) => {
  return (
    <section className="favorites">
      {favorites.map(({ id, name, region, category, rating, imageUrl }) => (
        <article key={id} className="favorite-card">
          <img className="favorite-image" src={imageUrl} alt={name} />
          <div className="favorite-body">
            <div className="favorite-name">{name}</div>
            <div className="favorite-meta">
              {region} · {category} · ⭐ {rating.toFixed(1)}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
};

export default FavoritesSection;
