import { useNavigate } from "react-router-dom";

export default function AdminHomePage() {
  const navigate = useNavigate();

  const Card = ({ title, desc, onClick, disabled }) => (
    <div
      onClick={!disabled ? onClick : undefined}
      style={{
        padding: 20,
        borderRadius: 16,
        background: "#fff",
        border: "1px solid #e5e5e5",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      <h3 style={{ margin: "0 0 8px" }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 14, color: "#666" }}>{desc}</p>

      {disabled && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#999" }}>준비중</div>
      )}
    </div>
  );

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <Card
          title="식당 수집"
          desc="카카오맵 키워드 검색 → DB 저장"
          onClick={() => navigate("/admin/restaurants/import")}
        />
        <Card
          title="회원 관리"
          desc="회원 목록 및 권한 관리"
          onClick={() => navigate("/admin/members")}
        />
        {/* 추후 구현 */}
        <Card title="식당 관리" desc="등록된 식당 조회/수정/삭제" disabled />

        <Card title="통계" desc="서비스 사용 통계 확인" disabled />
      </div>
    </div>
  );
}
