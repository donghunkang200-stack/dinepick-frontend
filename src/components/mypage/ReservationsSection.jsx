import "./ReservationsSection.css";

/*
  ReservationsSection
  - Upcoming and past reservations list
*/
const ReservationsSection = ({ upcomingReservations, pastReservations }) => {
  return (
    <section className="reservations">
      <div className="reservations-block">
        <h3 className="reservations-title">예정된 예약</h3>

        {upcomingReservations.length === 0 ? (
          <div className="empty">No upcoming reservations.</div>
        ) : (
          <div className="reservation-list">
            {upcomingReservations.map(
              ({ id, title, date, time, people, status, imageUrl }) => (
                <article key={id} className="reservation-card">
                  <img
                    className="reservation-image"
                    src={imageUrl}
                    alt={title}
                  />
                  <div className="reservation-body">
                    <div className="reservation-name">{title}</div>
                    <div className="reservation-meta">
                      {date} · {time} · {people}명
                    </div>
                    <div className="reservation-status">{status}</div>
                  </div>
                  <div className="reservation-arrow">›</div>
                </article>
              )
            )}
          </div>
        )}
      </div>

      <div className="reservations-block">
        <h3 className="reservations-title">지난 예약</h3>

        {pastReservations.length === 0 ? (
          <div className="empty">No past reservations.</div>
        ) : (
          <div className="reservation-list">
            {pastReservations.map(
              ({ id, title, date, time, people, status, imageUrl }) => (
                <article key={id} className="reservation-card">
                  <img
                    className="reservation-image"
                    src={imageUrl}
                    alt={title}
                  />
                  <div className="reservation-body">
                    <div className="reservation-name">{title}</div>
                    <div className="reservation-meta">
                      {date} · {time} · {people}명
                    </div>
                    <div className="reservation-status muted">{status}</div>
                  </div>

                  <button type="button" className="review-button">
                    리뷰 작성
                  </button>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReservationsSection;
