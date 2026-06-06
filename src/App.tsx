import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./components/AuthProvider";
import LoginPage from "./routes/login/LoginPage";
import RegisterPage from "./routes/register/RegisterPage";
import DashboardPage from "./routes/dashboard/DashboardPage";
import MyPage from "./routes/mypage/MyPage";
import SubscriptionDetailPage from "./routes/subscriptions/SubscriptionDetailPage";
import AnalyticsPage from "./routes/analytics/AnalyticsPage";
import LandingPage from "./routes/landing/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard/*" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route
            path="/subscriptions/:subscriptionId"
            element={<SubscriptionDetailPage />}
          />
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
