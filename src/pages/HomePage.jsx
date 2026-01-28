import { useState } from "react";
import Layout from "../components/layout/Layout";
import Hero from "../components/home/Hero";
import CategoryChips from "../components/home/CategoryChips";
import SectionGrid from "../components/home/SectionGrid";
import NearMeMap from "../components/common/NearMeMap";

/*
  홈 페이지
  - 메인 배너 + 카테고리별 추천 식당
  - 내 주변 맛집 지도 표시
*/
const HomePage = () => {
  // 홈 카테고리 상태
  const [homeCategory, setHomeCategory] = useState("ALL");

  return (
    <Layout>
      {/* 메인 히어로 영역 */}
      <Hero />

      {/* 카테고리 선택 */}
      <CategoryChips
        selectedCategory={homeCategory}
        onCategoryChange={({ category }) => setHomeCategory(category)}
      />

      {/* 추천 식당 섹션 */}
      <div className="section-header">
        <h2>추천 식당</h2>
      </div>

      <SectionGrid category={homeCategory} />

      {/* 내 주변 맛집 섹션 */}
      <div className="section-header">
        <h3>내 주변 맛집</h3>
        <div className="section-subtitle">
          지금 위치 기준으로 주변 맛집을 찾아보세요
        </div>
      </div>

      {/* 지도 */}
      <div className="container" style={{ padding: "0 0 22px" }}>
        <NearMeMap radiusKm={10} keyword="" category="ALL" height={420} />
      </div>
    </Layout>
  );
};

export default HomePage;
