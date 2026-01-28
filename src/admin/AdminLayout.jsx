import { NavLink, Outlet } from "react-router-dom";
import "./admin.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function AdminLayout() {
  const NavItem = ({ to, children, disabled }) => {
    if (disabled) {
      return (
        <div className="admin-link admin-link-disabled">
          {children}
          <span className="admin-badge">준비중</span>
        </div>
      );
    }

    return (
      <NavLink to={to} className="admin-link">
        {children}
      </NavLink>
    );
  };

  return (
    <>
      <Header />

      <div className="admin-wrap">
        <aside className="admin-side">
          <nav className="admin-nav">
            <NavItem to="/admin">대시보드</NavItem>
            <NavItem to="/admin/restaurants/import">식당 수집</NavItem>
            <NavItem to="/admin/members">회원 관리</NavItem>

            {/* 추후 구현 */}
            <NavItem disabled>식당 관리</NavItem>

            <NavItem disabled>통계</NavItem>
          </nav>
        </aside>

        <main className="admin-main">
          <div className="admin-page">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
