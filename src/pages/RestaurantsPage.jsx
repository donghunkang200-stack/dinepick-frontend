import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import FilterBar from "../components/restaurants/FilterBar";
import RestaurantGrid from "../components/restaurants/RestaurantGrid";
import Pagination from "../components/restaurants/Pagination";
import { RESTAURANT_ITEMS } from "../data/restaurants";

const PAGE_SIZE = 6;

/*
  RestaurantsPage
  - Displays search results by region
  - Includes filter bar, grid, and pagination
*/
const RestaurantsPage = () => {
  const [searchParams] = useSearchParams();

  const regionQuery = searchParams.get("region") ?? "";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("recommended");
  const [page, setPage] = useState(1);

  const filteredItems = useMemo(() => {
    const byRegion = RESTAURANT_ITEMS.filter(({ region }) =>
      regionQuery.trim().length === 0
        ? true
        : region.includes(regionQuery.trim())
    );

    const byCategory =
      selectedCategory === "All"
        ? byRegion
        : byRegion.filter(({ category }) => category === selectedCategory);

    const sorted = [...byCategory].sort((a, b) => {
      if (sortOption === "rating") return b.rating - a.rating;
      if (sortOption === "name") return a.name.localeCompare(b.name);
      return b.rating - a.rating;
    });

    return sorted;
  }, [regionQuery, selectedCategory, sortOption]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  }, [filteredItems.length]);

  const pagedItems = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, page, totalPages]);

  const handleCategoryChange = ({ category }) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleSortChange = ({ sort }) => {
    setSortOption(sort);
    setPage(1);
  };

  const handlePageChange = ({ nextPage }) => {
    setPage(nextPage);
  };

  return (
    <Layout>
      <div className="container" style={{ padding: "22px 0" }}>
        <h1 style={{ margin: "0 0 6px", letterSpacing: "-0.3px" }}>
          {regionQuery ? `"${regionQuery}" 검색 결과` : "Restaurants"}
        </h1>
        <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
          {filteredItems.length} results found
        </p>

        <FilterBar
          region={regionQuery}
          selectedCategory={selectedCategory}
          sortOption={sortOption}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
        />

        <RestaurantGrid items={pagedItems} />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={handlePageChange}
        />
      </div>
    </Layout>
  );
};

export default RestaurantsPage;
