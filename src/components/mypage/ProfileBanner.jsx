import "./ProfileBanner.css";

// 프로필 배너
const ProfileBanner = ({ user }) => {
  // 표시용 이름/서브텍스트
  const name = user?.name?.trim?.() ? user.name : "회원";
  const subtitle = user?.email?.trim?.()
    ? user.email
    : "오늘도 맛있는 하루 보내세요!";

  return (
    <section className="profile-banner" aria-label="프로필 배너">
      {/* 추후 프로필 사진 추가 */}
      <div className="profile-avatar" aria-hidden="true">
        🙂
      </div>

      <div className="profile-text">
        <h1 className="profile-name">{name}</h1>
        <p className="profile-subtitle">{subtitle}</p>
      </div>
    </section>
  );
};

export default ProfileBanner;
