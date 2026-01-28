import "./MyPageTabs.css";

// 마이페이지 탭(추후 기능추가 시 확장 가능)
const TABS = [
  { key: "reservations", label: "예약 내역" },
  { key: "profile", label: "내 정보" },
];

const DEFAULT_TAB = "reservations";

const MyPageTabs = ({ activeTab = DEFAULT_TAB, onChangeTab }) => {
  const safeTab = TABS.some((t) => t.key === activeTab)
    ? activeTab
    : DEFAULT_TAB;

  const currentIndex = TABS.findIndex((t) => t.key === safeTab);

  const handleChange = (key) => {
    if (typeof onChangeTab === "function") onChangeTab(key);
  };

  const handleKeyDown = (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

    e.preventDefault();

    const nextIndex =
      e.key === "ArrowRight"
        ? Math.min(TABS.length - 1, currentIndex + 1)
        : Math.max(0, currentIndex - 1);

    const nextTab = TABS[nextIndex]?.key;
    if (nextTab) handleChange(nextTab);
  };

  return (
    <nav
      className="tabs"
      role="tablist"
      aria-label="마이페이지 탭"
      onKeyDown={handleKeyDown}
    >
      {TABS.map((t) => {
        const isActive = safeTab === t.key;

        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            className={`tab ${isActive ? "active" : ""}`}
            aria-selected={isActive}
            aria-current={isActive ? "page" : undefined}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleChange(t.key)}
          >
            {t.label}
          </button>
        );
      })}
    </nav>
  );
};

export default MyPageTabs;
