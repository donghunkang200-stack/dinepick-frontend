import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RestaurantsPage from "./pages/RestaurantsPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/restaurants" element={<RestaurantsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
