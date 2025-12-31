import "./StatsCards.css";

/*
  StatsCards
  - Summary cards row
*/
const StatsCards = ({ stats }) => {
  const { reservations, favorites, reviews } = stats;

  return (
    <section className="stats">
      <div className="stats-card">
        <div className="stats-icon">⏱</div>
        <div className="stats-value">{reservations}</div>
        <div className="stats-label">예약</div>
      </div>

      <div className="stats-card">
        <div className="stats-icon">♡</div>
        <div className="stats-value">{favorites}</div>
        <div className="stats-label">찜</div>
      </div>

      <div className="stats-card">
        <div className="stats-icon">★</div>
        <div className="stats-value">{reviews}</div>
        <div className="stats-label">리뷰</div>
      </div>
    </section>
  );
};

export default StatsCards;
