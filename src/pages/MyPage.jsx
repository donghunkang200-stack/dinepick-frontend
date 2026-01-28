import { useCallback, useEffect, useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import ProfileBanner from "../components/mypage/ProfileBanner";

import MyPageTabs from "../components/mypage/MyPageTabs";
import ReservationsSection from "../components/mypage/ReservationsSection";
import ProfileSection from "../components/mypage/ProfileSection";
import { useAuth } from "../contexts/AuthContext";
import {
  cancelReservation,
  fetchMyReservations,
  updateReservation,
} from "../api/reservations";
import { toast } from "react-toastify";
import "./MyPage.css";
import EditModal from "../components/common/EditModal";

// ✅ 추가
import { updateMe, withdrawMe } from "../api/members";

// 서버 예약 데이터를 화면 카드용 데이터로 변환
function toCard(item) {
  return {
    id: item.reservationId,
    restaurantId: item.restaurantId,
    title: item.restaurantName,
    date: item.reservationDate,
    time: String(item.reservationTime).slice(0, 5),
    people: item.peopleCount,
    status: "",
    imageUrl: null,
    createdAt: item.createdAt,
  };
}

function sortByDateTimeAsc(list = []) {
  return [...list].sort((a, b) => {
    const aDt = new Date(`${a.date}T${a.time}`);
    const bDt = new Date(`${b.date}T${b.time}`);
    return aDt - bDt;
  });
}

function sortByDateTimeDesc(list = []) {
  return [...list].sort((a, b) => {
    const aDt = new Date(`${a.date}T${a.time}`);
    const bDt = new Date(`${b.date}T${b.time}`);
    return bDt - aDt;
  });
}

function isPast(dateStr, timeStr) {
  if (!dateStr || !timeStr) return false;
  const t = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  const dt = new Date(`${dateStr}T${t}`);
  if (Number.isNaN(dt.getTime())) return false;
  return dt.getTime() < Date.now();
}

const MyPage = () => {
  const { user, reloadMe, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("reservations");

  // ✅ 내 정보 수정 상태
  const [name, setName] = useState(user?.name ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  // user 바뀌면 name 동기화
  useEffect(() => {
    setName(user?.name ?? "");
  }, [user]);

  // 예약 목록 페이지네이션 상태
  const [page, setPage] = useState(0);
  const size = 10;

  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  const [resPage, setResPage] = useState(null);
  const [loadingReservations, setLoadingReservations] = useState(false);

  const fallbackUser = useMemo(() => ({ name: "게스트", email: "" }), []);

  const loadMyReservations = useCallback(async () => {
    setLoadingReservations(true);
    try {
      const data = await fetchMyReservations({ page, size });
      setResPage(data);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) toast.error("로그인이 필요합니다.");
      else toast.error("예약 내역을 불러오지 못했습니다.");
    } finally {
      setLoadingReservations(false);
    }
  }, [page, size]);

  useEffect(() => {
    if (activeTab !== "reservations") return;
    loadMyReservations();
  }, [activeTab, loadMyReservations]);

  const handleCancelReservation = useCallback(
    async (r) => {
      if (!r?.id) return;

      const ok = window.confirm("예약을 취소할까요?");
      if (!ok) return;

      setCancelLoadingId(r.id);
      try {
        await cancelReservation(r.id);
        toast.success("예약이 취소되었습니다.");
        await loadMyReservations();
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401) toast.error("로그인이 필요합니다.");
        else if (status === 403)
          toast.error("본인 예약 또는 관리자만 취소할 수 있습니다.");
        else if (status === 404) toast.error("예약을 찾을 수 없습니다.");
        else toast.error("예약 취소 실패");
      } finally {
        setCancelLoadingId(null);
      }
    },
    [loadMyReservations],
  );

  const { upcomingReservations, pastReservations } = useMemo(() => {
    const content = resPage?.content ?? [];
    const mapped = content.map(toCard);

    const upcoming = [];
    const past = [];

    for (const r of mapped) {
      if (isPast(r.date, r.time)) past.push({ ...r, status: "지난 예약" });
      else upcoming.push({ ...r, status: "예정 예약" });
    }

    return {
      upcomingReservations: sortByDateTimeAsc(upcoming),
      pastReservations: sortByDateTimeDesc(past),
    };
  }, [resPage]);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editLoadingId, setEditLoadingId] = useState(null);

  const handleOpenEdit = useCallback((r) => {
    setEditing(r);
    setEditOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    if (editLoadingId) return;
    setEditOpen(false);
    setEditing(null);
  }, [editLoadingId]);

  const handleSubmitEdit = useCallback(
    async (payload) => {
      if (!editing?.id) return;

      setEditLoadingId(editing.id);
      try {
        await updateReservation(editing.id, payload);
        toast.success("예약이 수정되었습니다.");

        setEditOpen(false);
        setEditing(null);

        await loadMyReservations();
      } catch (err) {
        const status = err?.response?.status;
        const msg = err?.response?.data?.message;

        if (status === 401) toast.error("로그인이 필요합니다.");
        else if (status === 403)
          toast.error("본인 예약 또는 관리자만 수정할 수 있습니다.");
        else if (status === 404) toast.error("예약을 찾을 수 없습니다.");
        else toast.error(msg || "예약 수정에 실패했습니다.");
      } finally {
        setEditLoadingId(null);
      }
    },
    [editing, loadMyReservations],
  );

  const totalPages = Math.max(resPage?.totalPages ?? 1, 1);

  // 내 정보 저장
  const handleSaveProfile = useCallback(async () => {
    const nextName = name.trim();
    if (!nextName) return toast.error("이름을 입력해주세요.");

    setSavingProfile(true);
    try {
      await updateMe({ name: nextName });
      toast.success("회원정보가 수정되었습니다.");
      await reloadMe?.();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) toast.error("로그인이 필요합니다.");
      else toast.error("회원정보 수정 실패");
    } finally {
      setSavingProfile(false);
    }
  }, [name, reloadMe]);

  // 탈퇴
  const handleWithdraw = useCallback(async () => {
    const ok = window.confirm(
      "정말 탈퇴할까요? (탈퇴 후 복구는 관리자만 가능)",
    );
    if (!ok) return;

    setWithdrawing(true);
    try {
      await withdrawMe(); // 204
      toast.success("탈퇴 처리되었습니다.");
      await logout?.("manual");
      window.location.hash = "#/"; // HashRouter 기준
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) toast.error("로그인이 필요합니다.");
      else toast.error("탈퇴 실패");
    } finally {
      setWithdrawing(false);
    }
  }, [logout]);

  return (
    <Layout>
      <div className="container mypage">
        <ProfileBanner user={user ?? fallbackUser} />

        <MyPageTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* 내 정보 탭 */}
        {activeTab === "profile" && (
          <ProfileSection
            user={user ?? fallbackUser}
            name={name}
            onChangeName={setName}
            saving={savingProfile}
            withdrawing={withdrawing}
            onSave={handleSaveProfile}
            onWithdraw={handleWithdraw}
          />
        )}

        {/* 예약 탭 */}
        {activeTab === "reservations" && (
          <>
            {loadingReservations && (
              <div style={{ padding: 12 }}>예약 내역 로딩중...</div>
            )}

            <ReservationsSection
              upcomingReservations={upcomingReservations}
              pastReservations={pastReservations}
              onCancel={handleCancelReservation}
              cancelLoadingId={cancelLoadingId}
              onEdit={handleOpenEdit}
              editLoadingId={editLoadingId}
            />

            <EditModal
              open={editOpen}
              initial={editing}
              maxPeople={6}
              loading={!!editLoadingId}
              onClose={handleCloseEdit}
              onSubmit={handleSubmitEdit}
            />

            {resPage && (
              <nav className="pager-minimal" aria-label="예약 페이지네이션">
                <button
                  className="pager-btn"
                  disabled={resPage.first || page <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  이전
                </button>

                <span className="pager-text">
                  {page + 1} / {totalPages}
                </span>

                <button
                  className="pager-btn"
                  disabled={resPage.last || page + 1 >= totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                >
                  다음
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default MyPage;
