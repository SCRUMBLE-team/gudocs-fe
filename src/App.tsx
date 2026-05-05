import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Typography } from "@wanteddev/wds";
import LoginPage from "./domain/auth/pages/LoginPage";
import RegisterPage from "./domain/auth/pages/RegisterPage";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./layouts/Header";

function DashboardPage() {
  return (
    <div style={{ padding: "32px 24px" }}>
      <Typography variant="title2" weight="bold">
        대시보드
      </Typography>
    </div>
  );
}

function DashboardLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--semantic-background-normal-alternative)",
      }}
    >
      <Header />
      <main>
        <Routes>
          <Route index element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
