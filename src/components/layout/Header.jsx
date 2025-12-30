import { Link } from "react-router-dom";
import "./Layout.css";

/*
  Header
  - Global navigation bar
*/
const Header = () => {
  return (
    <header className="header">
      <div className="container header-inner">
        {/* Logo → Home */}
        <Link to="/" className="logo">
          DINE PICK
        </Link>

        <nav className="nav">
          <Link to="/restaurants" className="nav-link">
            레스토랑
          </Link>

          <Link to="/me" className="nav-link">
            마이페이지
          </Link>

          <Link to="/me" className="nav-button">
            내정보
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
