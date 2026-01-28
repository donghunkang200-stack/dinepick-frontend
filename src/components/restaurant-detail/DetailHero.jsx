import "./DetailHero.css";

// 상세 페이지 상단 히어로 영역
const DetailHero = ({ restaurant }) => {
  if (!restaurant) return null;

  // 레스토랑 기본 정보
  const {
    name = "",
    address = "",
    category = "",
    rating = null,

    region = "",
    priceRange = "",

    imageUrls = [],
    imageUrl = "",
  } = restaurant;

  const fallbackImage = "/sushi.jpg";

  // 대표 이미지 선택
  const heroImage =
    (Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls[0] : "") ||
    imageUrl ||
    fallbackImage;

  // 메타 정보 (있는 값만)
  const metaItems = [];
  if (typeof rating === "number") metaItems.push(`⭐ ${rating.toFixed(1)}`);
  if (region) metaItems.push(region);
  else if (address) metaItems.push(address);
  if (priceRange) metaItems.push(priceRange);

  return (
    <section className="detail-hero">
      <img
        className="detail-hero-image"
        src={heroImage}
        alt={name ? `${name} 대표 사진` : "레스토랑 대표 사진"}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = fallbackImage;
        }}
      />

      <div className="detail-hero-overlay">
        <div className="detail-hero-top">
          <div className="detail-hero-title-group">
            {category && <div className="detail-hero-category">{category}</div>}

            <h1 className="detail-hero-title">{name || "레스토랑"}</h1>

            {metaItems.length > 0 && (
              <div className="detail-hero-sub">
                {metaItems.map((text, idx) => (
                  <span key={`${text}-${idx}`}>
                    {idx > 0 && <span className="detail-hero-dot">•</span>}
                    {text}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailHero;
