import "./DetailReviewsCard.css";

const DetailReviewsCard = ({ restaurant }) => {
  const reviews = restaurant?.reviews ?? []; // ✅ undefined 방지

  return (
    <article className="detail-card">
      <header className="detail-card-header">
        <h2 className="detail-card-title">리뷰</h2>
      </header>

      {reviews.length === 0 ? (
        <p className="detail-empty">아직 리뷰가 없습니다.</p>
      ) : (
        <ul className="detail-reviews">
          {reviews.map((r, idx) => (
            <li key={r.id ?? idx} className="detail-review-item">
              <div className="detail-review-top">
                <strong className="detail-review-name">
                  {r.name ?? "익명"}
                </strong>
                {r.date && <span className="detail-review-date">{r.date}</span>}
              </div>
              {r.rating != null && (
                <div className="detail-review-rating">⭐ {r.rating}</div>
              )}
              <p className="detail-review-text">{r.text ?? r.comment ?? ""}</p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
};

export default DetailReviewsCard;
