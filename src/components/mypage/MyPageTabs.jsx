import "./MyPageTabs.css";

/*
  MyPageTabs
  - Tab navigation
*/
const MyPageTabs = ({ activeTab, onChangeTab }) => {
  return (
    <div className="tabs">
      <button
        type="button"
        className={`tab ${activeTab === "reservations" ? "active" : ""}`}
        onClick={() => onChangeTab("reservations")}
      >
        예약 내역
      </button>

      <button
        type="button"
        className={`tab ${activeTab === "favorites" ? "active" : ""}`}
        onClick={() => onChangeTab("favorites")}
      >
        찜한 레스토랑
      </button>

      <button
        type="button"
        className={`tab ${activeTab === "reviews" ? "active" : ""}`}
        onClick={() => onChangeTab("reviews")}
      >
        내 리뷰
      </button>
    </div>
  );
};

export default MyPageTabs;
