import { createPortal } from "react-dom";
import "./ConfirmModal.css";

/**
 * 확인 / 취소를 받기 위한 공용 모달 컴포넌트
 */
export default function ConfirmModal({
  open,
  title = "확인",
  message = "",
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onClose,
  loading = false,
}) {
  // open이 false면 모달을 렌더링하지 않는다
  if (!open) return null;

  // 모달 바깥(백드롭)을 클릭했을 때 닫기 처리
  // 로딩 중에는 실수로 닫히는 것을 방지
  const handleBackdropMouseDown = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose?.();
    }
  };

  const node = (
    <div className="cm-backdrop" onMouseDown={handleBackdropMouseDown}>
      <div
        className="cm-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="cm-header">
          <h3 className="cm-title">{title}</h3>
        </div>

        <div className="cm-body">
          {/* 줄바꿈 포함 메시지를 그대로 보여주기 위해 pre 사용 */}
          <pre className="cm-message">{message}</pre>
        </div>

        <div className="cm-actions">
          <button
            type="button"
            className="cm-btn cm-cancel"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="cm-btn cm-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "처리 중..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  // Portal을 사용해 body에 직접 렌더링하여
  // 부모 요소의 영향에서 벗어나게 한다
  return createPortal(node, document.body);
}
