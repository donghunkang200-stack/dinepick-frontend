import { useState } from "react";
import { toast } from "react-toastify";
import {
  importRestaurantsByKeyword,
  parseSavedCount,
} from "../../api/adminRestaurants";

export default function AdminRestaurantsImportPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  const [onlyFoodCafe, setOnlyFoodCafe] = useState(true); // ✅ 추가
  const [type, setType] = useState("BOTH"); // BOTH | FOOD | CAFE ✅ 추가

  const [resultMsg, setResultMsg] = useState("");
  const [savedCount, setSavedCount] = useState(null);

  const buildKeywords = (base) => {
    const k = base.trim();
    if (!k) return [];

    if (!onlyFoodCafe) return [k];

    if (type === "FOOD") return [`${k} 음식점`];
    if (type === "CAFE") return [`${k} 카페`];

    // ✅ 둘다는 2번 호출 (정확도가 가장 좋음)
    return [`${k} 음식점`, `${k} 카페`];
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const targets = buildKeywords(keyword);
    if (targets.length === 0) return;

    setLoading(true);
    setResultMsg("");
    setSavedCount(null);

    try {
      // ✅ 여러 번 호출해서 합산
      let total = 0;
      let foodCount = 0;
      let cafeCount = 0;

      for (const k of targets) {
        const msg = await importRestaurantsByKeyword(k);
        const count = parseSavedCount(msg) || 0;

        total += count;

        if (k.includes("음식점")) foodCount = count;
        if (k.includes("카페")) cafeCount = count;
      }

      // ✅ 타입별 메시지 생성
      let finalMsg = "";

      if (type === "FOOD") {
        finalMsg = `식당 ${foodCount}건 저장 완료`;
      } else if (type === "CAFE") {
        finalMsg = `카페 ${cafeCount}건 저장 완료`;
      } else {
        finalMsg = `식당 ${foodCount}건 + 카페 ${cafeCount}건 (총 ${total}건) 저장 완료`;
      }

      setSavedCount(total);
      setResultMsg(finalMsg);
      toast.success(finalMsg, { autoClose: 1000 });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Import 실패";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <h1 style={{ marginTop: 0 }}>식당 수집</h1>
      <p style={{ marginTop: 6, color: "#777" }}>
        키워드 기반으로 카카오맵 결과를 DB에 저장합니다.
      </p>

      {/* 폼 */}
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          gap: 10,
          marginTop: 14,
          alignItems: "stretch",
        }}
      >
        {/* input + select 합친 wrapper */}
        <div
          style={{
            flex: 1,
            display: "flex",
            border: "1px solid #ddd",
            borderRadius: 12,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {/* 키워드 인풋 */}
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="예: 부산 국밥"
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px 12px",
              border: "none",
              outline: "none",
              background: "transparent",
            }}
          />

          {/* 셀렉트 바 */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={loading}
            style={{
              border: "none",
              borderLeft: "1px solid #eee",
              padding: "0 12px",
              background: "#fafafa",
              fontWeight: 700,
              cursor: "pointer",
              appearance: "none",
              width: 120,
            }}
          >
            <option value="BOTH">음식점+카페</option>
            <option value="FOOD">음식점</option>
            <option value="CAFE">카페</option>
          </select>
        </div>

        {/* 버튼 */}
        <button
          type="submit"
          disabled={loading || keyword.trim().length === 0}
          style={{
            padding: "10px 16px",
            borderRadius: 12,
            border: "1px solid #111",
            background: loading ? "#eee" : "#111",
            color: loading ? "#666" : "#fff",
            fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "수집 중..." : "수집 실행"}
        </button>
      </form>

      {(resultMsg || savedCount !== null) && (
        <div
          style={{
            marginTop: 14,
            padding: 14,
            borderRadius: 12,
            border: "1px solid #eee",
            background: "#fff",
          }}
        >
          <div style={{ fontWeight: 800 }}>결과</div>
          {resultMsg && <div style={{ marginTop: 6 }}>{resultMsg}</div>}
          {savedCount !== null && (
            <div style={{ marginTop: 6 }}>
              저장된 식당 수(합산): <b>{savedCount}</b>건
            </div>
          )}
        </div>
      )}
    </div>
  );
}
