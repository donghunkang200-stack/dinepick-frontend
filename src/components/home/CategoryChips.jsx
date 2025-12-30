import "./CategoryChips.css";

const CHIPS = [
  "전체",
  "한식",
  "중식",
  "일식",
  "양식",
  "이탈리안",
  "카페",
  "바",
];

export default function CategoryChips() {
  return (
    <section className="chips">
      <div className="container">
        <div className="chips-row">
          {CHIPS.map((c, idx) => (
            <button key={c} className={`chip ${idx === 0 ? "active" : ""}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
