import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import {
  createReservation,
  checkReservationAvailability,
} from "../../api/reservations";
import ConfirmModal from "../common/ConfirmModal";
import "./DetailReservationPanel.css";
import { useNavigate, useLocation } from "react-router-dom";

// 상세 페이지 예약 패널(가용성 체크 → 확인 모달 → 예약 생성)
const DetailReservationPanel = ({ restaurant }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!restaurant) return null;

  const {
    id: restaurantId,
    name = "",
    maxPeoplePerReservation = 6,
  } = restaurant;

  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("11:30");
  const [reservationPeople, setReservationPeople] = useState("1");
  const [submitting, setSubmitting] = useState(false);

  // 확인 모달 상태(최종 승인 후 실제 예약 생성)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [pendingPayload, setPendingPayload] = useState(null);

  // 날짜 input에서 오늘 이전 선택 방지
  const minDate = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // 예약 버튼: (1) 로그인 확인 → (2) 입력 검증 → (3) 예약 가능 여부 조회 → (4) 확인 모달 오픈
  const handleReserve = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      toast.info("예약하려면 로그인이 필요합니다.");
      return;
    }

    if (!restaurantId) {
      toast.error("레스토랑 정보를 찾을 수 없습니다.");
      return;
    }

    if (!reservationDate) {
      toast.error("날짜를 선택해주세요.");
      return;
    }

    const peopleCount = Number(reservationPeople);
    if (!Number.isFinite(peopleCount) || peopleCount < 1) {
      toast.error("인원을 확인해주세요.");
      return;
    }

    if (peopleCount > maxPeoplePerReservation) {
      toast.error(`최대 ${maxPeoplePerReservation}명까지 예약 가능합니다.`);
      return;
    }

    setSubmitting(true);
    try {
      const availability = await checkReservationAvailability({
        restaurantId,
        date: reservationDate,
        time: reservationTime,
        peopleCount,
      });

      if (!availability?.available) {
        toast.error(availability?.message || "예약이 불가능합니다.");
        return;
      }

      const payload = {
        restaurantId,
        reservationDate,
        reservationTime,
        peopleCount,
      };

      setPendingPayload(payload);

      setConfirmMessage(
        `${availability?.message || "예약 가능합니다."}\n\n` +
          `레스토랑: ${name || "레스토랑"}\n` +
          `날짜: ${reservationDate}\n` +
          `시간: ${reservationTime}\n` +
          `인원: ${peopleCount}명\n\n` +
          `이대로 예약을 진행할까요?`
      );

      setConfirmOpen(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "예약 가능 여부 확인에 실패했습니다.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // 확인 모달 "예약 진행": 실제 예약 생성 API 호출
  const handleConfirmReserve = async () => {
    if (!pendingPayload) return;

    setSubmitting(true);
    try {
      await createReservation(pendingPayload);
      toast.success(`${name || "레스토랑"} 예약 요청이 접수되었습니다!`);

      setReservationDate("");

      setConfirmOpen(false);
      setPendingPayload(null);
      setConfirmMessage("");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "예약 요청에 실패했습니다.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // 모달 닫기: 처리 중이면 닫기 방지 + 임시 payload/메시지 정리
  const handleCloseModal = () => {
    if (submitting) return;
    setConfirmOpen(false);
    setPendingPayload(null);
    setConfirmMessage("");
  };

  return (
    <div className="detail-reservation">
      <div className="detail-reservation-title">예약하기</div>

      <label className="detail-field">
        <span className="detail-field-label">날짜</span>
        <input
          className="detail-input"
          type="date"
          value={reservationDate}
          min={minDate}
          onChange={(e) => setReservationDate(e.target.value)}
          disabled={submitting}
        />
      </label>

      <label className="detail-field">
        <span className="detail-field-label">시간</span>
        <select
          className="detail-select"
          value={reservationTime}
          onChange={(e) => setReservationTime(e.target.value)}
          disabled={submitting}
        >
          {[
            "11:30",
            "12:00",
            "12:30",
            "13:00",
            "18:00",
            "18:30",
            "19:00",
            "19:30",
          ].map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </label>

      <label className="detail-field">
        <span className="detail-field-label">인원</span>
        <select
          className="detail-select"
          value={reservationPeople}
          onChange={(e) => setReservationPeople(e.target.value)}
          disabled={submitting}
        >
          {Array.from({ length: maxPeoplePerReservation }, (_, i) => i + 1).map(
            (count) => (
              <option key={count} value={String(count)}>
                {count}명
              </option>
            )
          )}
        </select>
      </label>

      <button
        type="button"
        className="detail-primary-button"
        onClick={handleReserve}
        disabled={submitting}
      >
        {submitting ? "확인 중..." : "예약 문의하기"}
      </button>

      <p className="detail-reservation-note">
        예약 확정은 레스토랑 확인 후 진행됩니다.
      </p>

      <ConfirmModal
        open={confirmOpen}
        title="예약 확인"
        message={confirmMessage}
        confirmText="예약 진행"
        cancelText="취소"
        loading={submitting}
        onConfirm={handleConfirmReserve}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default DetailReservationPanel;
