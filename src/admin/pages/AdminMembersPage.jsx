import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  adminFetchMembers,
  adminFetchWithdrawnMembers,
  adminRestoreMember,
} from "../../api/members";

export default function AdminMembersPage() {
  const [tab, setTab] = useState("ALL"); // ALL | WITHDRAWN
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [keyword, setKeyword] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data =
        tab === "WITHDRAWN"
          ? await adminFetchWithdrawnMembers()
          : await adminFetchMembers();

      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      const status = err?.response?.status;

      if (status === 403) {
        toast.error("관리자 권한이 없습니다. (403)");
      } else {
        toast.error("회원 목록 조회 실패");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return members;

    return members.filter((m) => {
      const email = (m.email ?? "").toLowerCase();
      const name = (m.name ?? "").toLowerCase();
      const role = (m.role ?? "").toLowerCase();
      const status = (m.status ?? "").toLowerCase();
      return (
        email.includes(k) ||
        name.includes(k) ||
        role.includes(k) ||
        status.includes(k)
      );
    });
  }, [members, keyword]);

  const onRestore = async (id) => {
    if (!window.confirm("이 회원을 복구할까요?")) return;
    try {
      await adminRestoreMember(id);
      toast.success("복구 완료");
      load();
    } catch (err) {
      toast.error("복구 실패");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          gap: 12,
        }}
      >
        <div>
          <h1 className="admin-title">회원 관리</h1>
          <p className="admin-subtitle">전체 회원 조회 / 탈퇴 회원 복구</p>
        </div>
      </div>

      {/* 탭 + 검색 */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 14,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          className={`pagination-page ${tab === "ALL" ? "active" : ""}`}
          onClick={() => setTab("ALL")}
        >
          전체 회원
        </button>

        <button
          type="button"
          className={`pagination-page ${tab === "WITHDRAWN" ? "active" : ""}`}
          onClick={() => setTab("WITHDRAWN")}
        >
          탈퇴 회원
        </button>

        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="이메일/이름/ROLE/STATUS 검색"
          style={{
            flex: "1 1 320px",
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(17,24,39,0.12)",
            background: "#fff",
          }}
        />
      </div>

      {/* 테이블 */}
      <div className="admin-card" style={{ marginTop: 14, overflow: "hidden" }}>
        <div
          style={{
            padding: "12px 14px",
            borderBottom: "1px solid rgba(17,24,39,0.08)",
            fontWeight: 900,
          }}
        >
          {tab === "WITHDRAWN" ? "탈퇴 회원" : "회원 목록"} ({filtered.length})
        </div>

        {loading ? (
          <div style={{ padding: 14 }}>로딩중...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 14 }}>데이터가 없습니다.</div>
        ) : (
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 860,
              }}
            >
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={th}>ID</th>
                  <th style={th}>이메일</th>
                  <th style={th}>이름</th>
                  <th style={th}>ROLE</th>
                  <th style={th}>STATUS</th>
                  <th style={th}>액션</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id}>
                    <td style={td}>{m.id}</td>
                    <td style={td}>{m.email}</td>
                    <td style={td}>{m.name}</td>
                    <td style={td}>{m.role}</td>
                    <td style={td}>{m.status}</td>
                    <td style={{ ...td, display: "flex", gap: 8 }}>
                      {tab === "WITHDRAWN" ? (
                        <button
                          type="button"
                          className="nav-link"
                          onClick={() => onRestore(m.id)}
                          style={{
                            border: "1px solid rgba(17,24,39,0.12)",
                            borderRadius: 999,
                          }}
                        >
                          복구
                        </button>
                      ) : (
                        <span
                          style={{
                            color: "rgba(17,24,39,0.45)",
                            fontWeight: 800,
                          }}
                        >
                          -
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const th = {
  padding: "10px 14px",
  borderBottom: "1px solid rgba(17,24,39,0.08)",
  fontSize: 13,
  color: "rgba(17,24,39,0.7)",
  fontWeight: 900,
};

const td = {
  padding: "10px 14px",
  borderBottom: "1px solid rgba(17,24,39,0.06)",
  fontSize: 14,
  color: "rgba(17,24,39,0.85)",
};
