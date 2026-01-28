import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1400&q=80";

// 히어로 섹션
const Hero = () => {
  const navigate = useNavigate();
  const [region, setRegion] = useState("ALL");
  const [keyword, setKeyword] = useState("");

  // 검색어 공백 제거 및 버튼 활성화 여부
  const trimmedKeyword = keyword.trim();
  const hasRegion = region !== "ALL";
  const isDisabled = !hasRegion && trimmedKeyword.length === 0; // 지역/키워드 둘 다 없으면 비활성

  // 검색 제출 시 레스토랑 목록 페이지로 이동
  const handleSubmit = (event) => {
    event.preventDefault();
    if (isDisabled) return;

    const params = new URLSearchParams();

    if (hasRegion) params.set("region", region);
    if (trimmedKeyword) params.set("keyword", trimmedKeyword);

    navigate(`/restaurants?${params.toString()}`);
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">최고의 레스토랑을 예약하세요</h1>
          <p className="hero-subtitle">전국 최고의 맛집을 한눈에</p>

          <form className="hero-search" onSubmit={handleSubmit}>
            {/* 지역 선택 */}
            <select
              className="hero-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              aria-label="지역 선택"
            >
              <option value="ALL">전체</option>
              <option value="서울">서울</option>
              <option value="부산">부산</option>
              <option value="대구">대구</option>
              <option value="인천">인천</option>
              <option value="광주">광주</option>
              <option value="대전">대전</option>
              <option value="울산">울산</option>
              <option value="세종">세종</option>
              <option value="경기">경기</option>
              <option value="강원">강원</option>
              <option value="충북">충북</option>
              <option value="충남">충남</option>
              <option value="전북">전북</option>
              <option value="전남">전남</option>
              <option value="경북">경북</option>
              <option value="경남">경남</option>
              <option value="제주">제주</option>
            </select>

            {/* 키워드 */}
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="키워드를 입력하세요 (예: 스시)"
              aria-label="레스토랑 검색"
              autoComplete="off"
              spellCheck={false}
            />

            <button type="submit" disabled={isDisabled}>
              검색
            </button>
          </form>
        </div>

        <div className="hero-image">
          <img src={HERO_IMAGE} alt="맛있는 음식 사진" loading="lazy" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
