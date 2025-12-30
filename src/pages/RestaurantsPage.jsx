import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import FilterBar from "../components/restaurants/FilterBar";
import RestaurantGrid from "../components/restaurants/RestaurantGrid";
import Pagination from "../components/restaurants/Pagination";

/*
  Mock data for restaurant search results
  - Replace with API later
*/
const RESTAURANT_ITEMS = [
  {
    id: 1,
    name: "Mushroom Bistro",
    region: "부산",
    category: "Western",
    rating: 4.7,
    priceRange: "₩₩",
    imageUrl:
      "https://images.unsplash.com/photo-1541971875076-8f970d573be6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Cherry Table",
    region: "부산",
    category: "Cafe",
    rating: 4.5,
    priceRange: "₩₩",
    imageUrl:
      "https://images.unsplash.com/photo-1528826194825-8d3b4ee31c06?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Herb Kitchen",
    region: "부산",
    category: "Korean",
    rating: 4.6,
    priceRange: "₩",
    imageUrl:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Seoul Signature",
    region: "서울",
    category: "Korean",
    rating: 4.8,
    priceRange: "₩₩₩",
    imageUrl:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Izakaya Night",
    region: "서울",
    category: "Japanese",
    rating: 4.4,
    priceRange: "₩₩",
    imageUrl:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop",
  },
];

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
      return b.rating - a.rating; // recommended default
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
        {/* Page heading */}
        <h1 style={{ margin: "0 0 6px", letterSpacing: "-0.3px" }}>
          {regionQuery ? `"${regionQuery}" 검색 결과` : "Restaurants"}
        </h1>
        <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
          {filteredItems.length} results found
        </p>

        {/* Filters */}
        <FilterBar
          region={regionQuery}
          selectedCategory={selectedCategory}
          sortOption={sortOption}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
        />

        {/* Results grid */}
        <RestaurantGrid items={pagedItems} />

        {/* Pagination */}
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
