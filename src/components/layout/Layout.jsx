import Header from "./Header";
import Footer from "./Footer";
import "./Layout.css";
import CtaSection from "./CTASection";
import { useLocation } from "react-router-dom";

// 공통 레이아웃
const Layout = ({ children }) => {
  const location = useLocation();

  // CTA 비활성화 페이지 경로
  const hideCta =
    location.pathname.startsWith("/me") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/restaurants");

  return (
    <div className="app-shell">
      <Header />

      <main className="app-main">{children}</main>

      {!hideCta && <CtaSection />}
      <Footer />
    </div>
  );
};

export default Layout;
