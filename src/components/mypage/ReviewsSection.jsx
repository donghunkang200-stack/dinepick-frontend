import "./ReviewsSection.css";

/*
  ReviewsSection
  - User review list
*/
const ReviewsSection = ({ reviews }) => {
  return (
    <section className="reviews">
      {reviews.map(({ id, restaurant, rating, date, content }) => (
        <article key={id} className="review-card">
          <div className="review-top">
            <div className="review-title">{restaurant}</div>
            <div className="review-rating">
              {"★".repeat(rating)}
              <span className="review-rating-muted">
                {"★".repeat(5 - rating)}
              </span>
            </div>
          </div>

          <div className="review-date">{date}</div>
          <p className="review-content">{content}</p>
        </article>
      ))}
    </section>
  );
};

export default ReviewsSection;
