import "./DetailInfoCard.css";

// 레스토랑 상세 정보 카드
const DetailInfoCard = ({ restaurant }) => {
  if (!restaurant) return null;

  // 레스토랑 정보
  const {
    address = "",
    description = "",
    maxPeoplePerReservation = null,
    openingHours = "",
    phone = "",
    priceRange = "",
  } = restaurant;

  // 최대 예약 인원 숫자 처리
  const maxPeopleNum =
    maxPeoplePerReservation === null || maxPeoplePerReservation === undefined
      ? null
      : Number(maxPeoplePerReservation);

  // 값이 있는 항목만 리스트로 구성
  const rows = [
    { label: "영업시간", value: openingHours?.trim?.() ? openingHours : "" },
    { label: "주소", value: address?.trim?.() ? address : "" },
    { label: "전화", value: phone?.trim?.() ? phone : "" },
    { label: "가격대", value: priceRange?.trim?.() ? priceRange : "" },
    {
      label: "최대 예약 인원",
      value:
        Number.isFinite(maxPeopleNum) && maxPeopleNum > 0
          ? `${maxPeopleNum}명`
          : "",
    },
  ].filter((r) => Boolean(r.value));

  const hasDescription = Boolean(description?.trim?.());

  return (
    <article className="detail-card">
      <header className="detail-card-header">
        <h2 className="detail-card-title">레스토랑 정보</h2>
      </header>

      {rows.length > 0 ? (
        <div className="detail-info-list">
          {rows.map(({ label, value }) => (
            <div className="detail-info-row" key={label}>
              <span className="detail-info-label">{label}</span>
              <span className="detail-info-value">{value}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="detail-description" style={{ marginTop: 0 }}>
          제공된 레스토랑 정보가 아직 없어요.
        </p>
      )}

      {hasDescription && <p className="detail-description">{description}</p>}
    </article>
  );
};

export default DetailInfoCard;
