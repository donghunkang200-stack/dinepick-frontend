import "./Pagination.css";

export default function Pagination({
  page, // 0-based
  totalPages, // number
  onChange, // (nextPage0) => void
  windowSize = 5, // 가운데 몇 개 보여줄지(홀수 추천)
}) {
  if (!totalPages || totalPages <= 1) return null;

  const current = page + 1; // 1-based 표시용
  const half = Math.floor(windowSize / 2);

  let start = Math.max(1, current - half);
  let end = Math.min(totalPages, current + half);

  // windowSize 유지 보정
  const shown = end - start + 1;
  if (shown < windowSize) {
    const 부족 = windowSize - shown;
    start = Math.max(1, start - 부족);
    end = Math.min(totalPages, end + (windowSize - (end - start + 1)));
  }

  const go = (p1) => onChange(p1 - 1); // 1-based -> 0-based

  const Btn = ({ children, disabled, onClick }) => (
    <button
      type="button"
      className="pagination-btn"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );

  const PageBtn = ({ p1 }) => {
    const active = p1 === current;
    return (
      <button
        type="button"
        className={`pagination-page ${active ? "active" : ""}`}
        onClick={() => go(p1)}
        disabled={active}
      >
        {p1}
      </button>
    );
  };

  return (
    <div className="pagination">
      <Btn disabled={page === 0} onClick={() => go(1)}>
        «
      </Btn>
      <Btn disabled={page === 0} onClick={() => go(current - 1)}>
        ‹
      </Btn>

      <PageBtn p1={1} />

      {start > 2 && <span className="pagination-ellipsis">…</span>}

      {Array.from({ length: end - start + 1 }, (_, i) => start + i)
        .filter((p1) => p1 !== 1 && p1 !== totalPages)
        .map((p1) => (
          <PageBtn key={p1} p1={p1} />
        ))}

      {end < totalPages - 1 && <span className="pagination-ellipsis">…</span>}

      {totalPages > 1 && <PageBtn p1={totalPages} />}

      <Btn disabled={page >= totalPages - 1} onClick={() => go(current + 1)}>
        ›
      </Btn>
      <Btn disabled={page >= totalPages - 1} onClick={() => go(totalPages)}>
        »
      </Btn>
    </div>
  );
}
