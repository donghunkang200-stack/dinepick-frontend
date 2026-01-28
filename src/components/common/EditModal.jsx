import { useEffect, useMemo, useState } from "react";
import "./EditModal.css";

// 예약 수정 모달
export default function EditReservationModal({
  open,
  initial,
  maxPeople = 6,
  loading = false,
  onClose,
  onSubmit,
}) {
  // 폼 상태
  const [date, setDate] = useState("");
  const [time, setTime] = useState("11:30");
  const [people, setPeople] = useState("1");

  // 날짜 input 최소값(오늘)
  const minDate = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // 열릴 때 initial 값으로 폼 초기화
  useEffect(() => {
    if (!open) return;
    setDate(initial?.date ?? "");
    setTime(initial?.time ?? "11:30");
    setPeople(String(initial?.people ?? "1"));
  }, [open, initial?.id]);

  if (!open) return null;

  // 배경 클릭 시 닫기(로딩 중 제외)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) onClose?.();
  };

  // 입력값 검증 후 수정 payload 전달
  const handleSubmit = () => {
    if (!date) return;

    const peopleCount = Number(people);
    if (!Number.isFinite(peopleCount) || peopleCount < 1) return;
    if (peopleCount > maxPeople) return;

    onSubmit?.({
      reservationDate: date,
      reservationTime: time,
      peopleCount,
    });
  };

  return (
    <div className="erm-backdrop" onMouseDown={handleBackdropClick}>
      <div className="erm-modal" role="dialog" aria-modal="true">
        <div className="erm-header">
          <h3 className="erm-title">예약 수정</h3>
          <div className="erm-sub">{initial?.title ?? "예약"}</div>
        </div>

        <div className="erm-body">
          <label className="erm-field">
            <span>날짜</span>
            <input
              type="date"
              value={date}
              min={minDate}
              onChange={(e) => setDate(e.target.value)}
              disabled={loading}
            />
          </label>

          <label className="erm-field">
            <span>시간</span>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={loading}
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
              ].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="erm-field">
            <span>인원</span>
            <select
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              disabled={loading}
            >
              {Array.from({ length: maxPeople }, (_, i) => i + 1).map((n) => (
                <option key={n} value={String(n)}>
                  {n}명
                </option>
              ))}
            </select>
          </label>

          <div className="erm-hint">
            저장 시 중복 예약/인원 제한은 서버에서 최종 검증됩니다.
          </div>
        </div>

        <div className="erm-actions">
          <button
            type="button"
            className="erm-btn ghost"
            onClick={onClose}
            disabled={loading}
          >
            취소
          </button>

          <button
            type="button"
            className="erm-btn primary"
            onClick={handleSubmit}
            disabled={loading || !date}
          >
            {loading ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
