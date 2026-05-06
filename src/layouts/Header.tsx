import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@wanteddev/wds";
import { useAuthStore } from "../stores/useAuthStore";
import { logout } from "../api/auth";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout: initializeUser } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    initializeUser();
    navigate("/login");
  };

  return (
    <header
      style={{
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        backgroundColor: "var(--semantic-background-normal-normal)",
        borderBottom: "1px solid var(--semantic-line-solid-normal)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Typography
        variant="title3"
        weight="bold"
        color="semantic.label.normal"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        구독 관리
      </Typography>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {user && (
          <Typography variant="body2" color="semantic.label.alternative">
            {user.name}
          </Typography>
        )}
        <Button
          variant="outlined"
          color="assistive"
          size="small"
          onClick={handleLogout}
        >
          로그아웃
        </Button>
      </div>
    </header>
  );
}
