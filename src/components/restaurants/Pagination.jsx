import "./Pagination.css";

/*
  Pagination
  - Simple page number navigation
*/
const Pagination = ({ currentPage, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="pagination">
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`page-button ${currentPage === page ? "active" : ""}`}
          onClick={() => onChange({ nextPage: page })}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
