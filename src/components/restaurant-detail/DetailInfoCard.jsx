import "./DetailInfoCard.css";

/*
  DetailInfoCard
  - Restaurant info summary
*/
const DetailInfoCard = ({ restaurant }) => {
  const { openingHours, address, phone, priceRange, description } = restaurant;

  return (
    <article className="detail-card">
      <header className="detail-card-header">
        <h2 className="detail-card-title">레스토랑 정보</h2>
      </header>

      <div className="detail-info-list">
        <div className="detail-info-row">
          <span className="detail-info-label">영업시간</span>
          <span className="detail-info-value">{openingHours}</span>
        </div>
        <div className="detail-info-row">
          <span className="detail-info-label">주소</span>
          <span className="detail-info-value">{address}</span>
        </div>
        <div className="detail-info-row">
          <span className="detail-info-label">전화</span>
          <span className="detail-info-value">{phone}</span>
        </div>
        <div className="detail-info-row">
          <span className="detail-info-label">가격대</span>
          <span className="detail-info-value">{priceRange}</span>
        </div>
      </div>

      <p className="detail-description">{description}</p>
    </article>
  );
};

export default DetailInfoCard;
