import { useState, useEffect } from "react";
import "./FilterBar.css";

// 카테고리 필터 옵션(라벨/백엔드 값 매핑)
const CATEGORY_OPTIONS = [
  { label: "전체", value: "ALL" },
  { label: "한식", value: "KOREAN" },
  { label: "중식", value: "CHINESE" },
  { label: "일식", value: "JAPANESE" },
  { label: "양식", value: "WESTERN" },
  { label: "카페", value: "CAFE" },
  { label: "기타", value: "ETC" },
];

// 카테고리 value -> 화면 표시용 label 변환
const valueToLabel = (val) =>
  CATEGORY_OPTIONS.find((o) => o.value === val)?.label ?? "전체";

// 검색/카테고리/정렬을 한 곳에서 제어하는 필터 바
const FilterBar = ({
  keyword = "",
  selectedCategory = "ALL",
  sortOption,
  onCategoryChange = () => {},
  onSortChange = () => {},
  onKeywordSubmit = () => {},
}) => {
  // 검색 입력값(부모/URL keyword 변경 시에도 input을 동기화)
  const [input, setInput] = useState(keyword);

  // 외부 keyword가 바뀌면 입력창도 같이 갱신
  useEffect(() => {
    setInput(keyword);
  }, [keyword]);

  // 검색 폼 제출 -> trim 해서 부모로 전달
  const handleSubmit = (e) => {
    e.preventDefault();
    onKeywordSubmit(input.trim());
  };

  return (
    <div className="filter-bar">
      <div className="filter-header">
        {/* 검색 폼(키워드 입력 후 submit) */}
        <form className="filter-search" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="식당명, 지역, 키워드 검색"
            aria-label="검색어 입력"
          />
          <button type="submit">{input.trim() ? "검색" : "전체보기"}</button>
        </form>
        {/* 우측: 현재 선택 상태 요약 + 정렬 옵션 */}
        <div className="filter-top">
          <div>
            {/* 현재 검색어 표시 */}
            <div className="filter-meta">
              <span>검색어:</span>
              <span className="filter-value">{keyword || "All"}</span>
            </div>
            {/* 현재 카테고리 표시 */}
            <div className="filter-meta" style={{ marginTop: 4 }}>
              <span>카테고리:</span>
              <span className="filter-value">
                {valueToLabel(selectedCategory)}
              </span>
            </div>
          </div>
          {/* 정렬 선택(변경 시 부모로 sort 전달) */}
          <select
            className="filter-select"
            value={sortOption}
            onChange={(e) => onSortChange({ sort: e.target.value })}
            aria-label="Sort option"
          >
            <option value="recommended">추천순</option>
            <option value="distance">가까운순</option>
          </select>
        </div>
      </div>
      {/* 카테고리 칩(클릭 시 category 변경 이벤트 전달) */}
      <div className="filter-chips">
        {CATEGORY_OPTIONS.map((opt) => (
          <button
            key={`${opt.label}-${opt.value}`}
            type="button"
            className={`filter-chip ${
              selectedCategory === opt.value ? "active" : ""
            }`}
            onClick={() => onCategoryChange({ category: opt.value })}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
