import "./ProfileBanner.css";

/*
  ProfileBanner
  - Red profile area like screenshot
*/
const ProfileBanner = ({ user }) => {
  const { name, subtitle } = user;

  return (
    <section className="profile-banner">
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
