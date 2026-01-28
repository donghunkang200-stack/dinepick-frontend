import "./CategoryChips.css";

// 카테고리 옵션(label: 화면 표시, value: API 전달 값)
const CATEGORY_OPTIONS = [
  { label: "전체", value: "ALL" },
  { label: "한식", value: "KOREAN" },
  { label: "중식", value: "CHINESE" },
  { label: "일식", value: "JAPANESE" },
  { label: "양식", value: "WESTERN" },
  { label: "카페", value: "CAFE" },
  { label: "기타", value: "ETC" },
];

export default function CategoryChips({
  selectedCategory = "ALL",
  onCategoryChange = () => {},
}) {
  return (
    <div className="category-chips">
      {CATEGORY_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`chip ${selectedCategory === opt.value ? "active" : ""}`}
          onClick={() => onCategoryChange({ category: opt.value })}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
