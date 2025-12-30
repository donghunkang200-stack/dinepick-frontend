import "./DetailHero.css";

/*
  DetailHero
  - Banner image with overlay title area
*/
const DetailHero = ({ restaurant }) => {
  const { name, category, rating, region, priceRange, imageUrl } = restaurant;

  return (
    <section className="detail-hero">
      <img className="detail-hero-image" src={imageUrl} alt={name} />

      <div className="detail-hero-overlay">
        <div className="detail-hero-top">
          <div className="detail-hero-title-group">
            <div className="detail-hero-category">{category}</div>
            <h1 className="detail-hero-title">{name}</h1>
            <div className="detail-hero-sub">
              <span>⭐ {rating.toFixed(1)}</span>
              <span className="detail-hero-dot">•</span>
              <span>{region}</span>
              <span className="detail-hero-dot">•</span>
              <span>{priceRange}</span>
            </div>
          </div>

          <div className="detail-hero-actions">
            <button type="button" className="icon-button" aria-label="Like">
              ♡
            </button>
            <button type="button" className="icon-button" aria-label="Share">
              ↗
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailHero;
