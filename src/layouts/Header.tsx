import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@wanteddev/wds";
import { IconBell } from "@wanteddev/wds-icon";
import { useAuthStore } from "../stores/useAuthStore";
import { logout } from "../api/auth";
import type { UpcomingNotification } from "../type/dashboard";

interface HeaderProps {
  notifications?: UpcomingNotification[];
}

export default function Header({ notifications = [] }: HeaderProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout: clearAuth } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    clearAuth();
    setDropdownOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const upcomingNotifications = notifications.filter(
    (n) => n.daysUntilBilling >= 0 && n.daysUntilBilling <= 7,
  );

  const getDDayLabel = (days: number) =>
    days === 0 ? "D-Day" : `D-${days}`;

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header
      style={{
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: isAuthenticated ? "flex-end" : "space-between",
        padding: "0 24px",
        backgroundColor: "var(--semantic-background-normal-normal)",
        borderBottom: "1px solid var(--semantic-line-solid-normal)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo — 미인증 상태에서만 표시 (인증 시 Sidebar가 담당) */}
      {!isAuthenticated && (
        <div
          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #0066FF 0%, #4D94FF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "white", fontSize: "13px", fontWeight: "800" }}>S</span>
          </div>
          <Typography variant="title3" weight="bold" color="semantic.label.normal">
            Gudocs
          </Typography>
        </div>
      )}

      {/* Right side */}
      {isAuthenticated ? (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Bell */}
          <div ref={bellRef} style={{ position: "relative" }}>
            <button
              onClick={() => setBellOpen((prev) => !prev)}
              style={{
                position: "relative",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748d",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--semantic-background-normal-alternative)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              <IconBell width={20} height={20} />
              {upcomingNotifications.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    minWidth: "16px",
                    height: "16px",
                    borderRadius: "9999px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                    lineHeight: 1,
                  }}
                >
                  {upcomingNotifications.length}
                </span>
              )}
            </button>

            {bellOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  width: "280px",
                  backgroundColor: "var(--semantic-background-normal-normal)",
                  borderRadius: "14px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                  border: "1px solid #e3e8ee",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--semantic-line-solid-normal)",
                  }}
                >
                  <Typography variant="label1" weight="bold" color="semantic.label.normal">
                    결제 예정 알림
                  </Typography>
                </div>
                {upcomingNotifications.length === 0 ? (
                  <div style={{ padding: "20px 16px", textAlign: "center" }}>
                    <Typography variant="body2" color="semantic.label.alternative">
                      7일 내 결제 예정 없음
                    </Typography>
                  </div>
                ) : (
                  <ul style={{ listStyle: "none", margin: 0, padding: "6px" }}>
                    {upcomingNotifications.map((n) => (
                      <li
                        key={n.subscriptionId}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 10px",
                          borderRadius: "8px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: "#0066FF",
                              backgroundColor: "rgba(0,102,255,0.08)",
                              padding: "2px 6px",
                              borderRadius: "9999px",
                              letterSpacing: "-0.2px",
                            }}
                          >
                            {getDDayLabel(n.daysUntilBilling)}
                          </span>
                          <Typography variant="body2" color="semantic.label.normal">
                            {n.serviceName}
                          </Typography>
                        </div>
                        <Typography
                          variant="caption1"
                          color="semantic.label.alternative"
                        >
                          {n.nextBillingDate}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* User dropdown */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "1px solid transparent",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "10px",
                transition: "background 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--semantic-background-normal-alternative)";
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--semantic-line-solid-normal)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #0066FF 0%, #4D94FF 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "14px",
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <Typography variant="body2" weight="medium" color="semantic.label.normal">
                {user?.name}
              </Typography>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                style={{
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  opacity: 0.45,
                }}
              >
                <path
                  d="M2.5 5l4.5 4.5L11.5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  width: "210px",
                  backgroundColor: "var(--semantic-background-normal-normal)",
                  borderRadius: "14px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                  border: "1px solid var(--semantic-line-solid-normal)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid var(--semantic-line-solid-normal)",
                    background: "linear-gradient(135deg, rgba(0,102,255,0.06), rgba(77,148,255,0.06))",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #0066FF, #4D94FF)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "700",
                        fontSize: "15px",
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>
                    <div style={{ overflow: "hidden" }}>
                      <Typography
                        variant="label1"
                        weight="bold"
                        color="semantic.label.normal"
                        style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {user?.name}
                      </Typography>
                      <Typography
                        variant="caption1"
                        color="semantic.label.alternative"
                        style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {user?.email}
                      </Typography>
                    </div>
                  </div>
                </div>

                <div style={{ padding: "6px" }}>
                  <button
                    onClick={() => { navigate("/mypage"); setDropdownOpen(false); }}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "14px",
                      color: "var(--semantic-label-normal)",
                      borderRadius: "8px",
                      transition: "background 0.1s",
                      fontFamily: "Pretendard, sans-serif",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--semantic-background-normal-alternative)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.7 }}>
                      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
                      <path d="M2.5 13.5c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                    마이페이지
                  </button>

                  <div style={{ height: "1px", backgroundColor: "var(--semantic-line-solid-normal)", margin: "4px 0" }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "14px",
                      color: "#dc2626",
                      borderRadius: "8px",
                      transition: "background 0.1s",
                      fontFamily: "Pretendard, sans-serif",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#fef2f2"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M10.5 11l3-3-3-3M13.5 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button variant="outlined" color="assistive" size="small" onClick={() => navigate("/login")}>
            로그인
          </Button>
        </div>
      )}
    </header>
  );
}
