import "./FilterBar.css";

const CATEGORY_OPTIONS = [
  "All",
  "Korean",
  "Chinese",
  "Japanese",
  "Western",
  "Italian",
  "Cafe",
  "Bar",
];

/*
  FilterBar
  - Category chips + sort select
*/
const FilterBar = ({
  region,
  selectedCategory,
  sortOption,
  onCategoryChange,
  onSortChange,
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-left">
        <div className="filter-title">Filters</div>
        <div className="filter-chips">
          {CATEGORY_OPTIONS.map((category) => (
            <button
              key={category}
              className={`filter-chip ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => onCategoryChange({ category })}
              type="button"
              aria-label={`Category ${category}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-right">
        <div className="filter-meta">
          <span className="filter-label">Region:</span>
          <span className="filter-value">{region || "All"}</span>
        </div>

        <select
          className="filter-select"
          value={sortOption}
          onChange={(e) => onSortChange({ sort: e.target.value })}
          aria-label="Sort option"
        >
          <option value="recommended">Recommended</option>
          <option value="rating">Rating</option>
          <option value="name">Name</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
