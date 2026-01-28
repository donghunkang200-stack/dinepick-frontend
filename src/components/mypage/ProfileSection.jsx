import "./ProfileSection.css";

export default function ProfileSection(props) {
  const user = props?.user ?? null;

  const name = props?.name ?? "";
  const onChangeName =
    typeof props?.onChangeName === "function" ? props.onChangeName : null;

  const onSave = typeof props?.onSave === "function" ? props.onSave : null;
  const onWithdraw =
    typeof props?.onWithdraw === "function" ? props.onWithdraw : null;

  const saving = !!props?.saving;
  const withdrawing = !!props?.withdrawing;

  return (
    <section className="profile-sec">
      <header className="profile-header">
        <h2 className="profile-title">내 정보</h2>
        <p className="profile-sub">
          회원정보 수정 및 탈퇴를 진행할 수 있습니다.
        </p>
      </header>

      <div className="profile-card">
        <div className="profile-row">
          <div className="profile-label">이메일</div>
          <div className="profile-value">{user?.email ?? "-"}</div>
        </div>
        <form
          className="profile-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSave?.();
          }}
        >
          <div className="profile-label">이름</div>

          <div className="profile-form-row">
            <input
              className="profile-input"
              value={name}
              onChange={(e) => onChangeName?.(e.target.value)}
              disabled={saving || withdrawing}
              placeholder="이름"
            />

            <button
              className="profile-save"
              type="submit"
              disabled={!onSave || saving || withdrawing}
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>

        <div className="profile-danger">
          <div className="danger-title">회원 탈퇴</div>
          <div className="danger-desc">
            탈퇴 시 계정이 비활성화됩니다. (복구는 관리자만 가능)
          </div>

          <button
            type="button"
            className="danger-btn"
            onClick={() => onWithdraw?.()}
            disabled={!onWithdraw || saving || withdrawing}
          >
            {withdrawing ? "탈퇴 처리 중..." : "탈퇴하기"}
          </button>
        </div>
      </div>
    </section>
  );
}
