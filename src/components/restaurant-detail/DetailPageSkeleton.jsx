import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/*
  상세 페이지 스켈레톤
*/
const DetailPageSkeleton = () => {
  return (
    <div className="detail-container">
      {/* Hero */}
      <div style={{ marginBottom: 24 }}>
        <Skeleton height={300} borderRadius={16} />
      </div>

      <section className="detail-grid">
        {/* 왼쪽 */}
        <div className="detail-left" style={{ display: "grid", gap: 20 }}>
          {/* Info 카드 */}
          <Skeleton height={160} borderRadius={16} />

          {/* Map 카드 */}
          <Skeleton height={400} borderRadius={16} />

          {/* Related */}
          <div>
            <Skeleton height={20} width={160} style={{ marginBottom: 12 }} />
            <div style={{ display: "grid", gap: 12 }}>
              <Skeleton height={100} borderRadius={12} />
              <Skeleton height={100} borderRadius={12} />
              <Skeleton height={100} borderRadius={12} />
            </div>
          </div>
        </div>

        {/* 오른쪽 (예약 패널) */}
        <aside className="detail-right">
          <Skeleton height={420} borderRadius={16} />
        </aside>
      </section>
    </div>
  );
};

export default DetailPageSkeleton;
