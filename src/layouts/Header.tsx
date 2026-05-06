import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@wanteddev/wds";
import { useAuthStore } from "../stores/useAuthStore";
import { logout } from "../api/auth";

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout: clearAuth } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    clearAuth();
    setDropdownOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

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
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
        }}
        onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "white", fontSize: "13px", fontWeight: "800" }}>
            G
          </span>
        </div>
        <Typography
          variant="title3"
          weight="bold"
          color="semantic.label.normal"
        >
          구독 관리
        </Typography>
      </div>

      {/* Right side */}
      {isAuthenticated ? (
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
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "transparent";
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
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
            <Typography
              variant="body2"
              weight="medium"
              color="semantic.label.normal"
            >
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

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                width: "210px",
                backgroundColor: "var(--semantic-background-normal-normal)",
                borderRadius: "14px",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid var(--semantic-line-solid-normal)",
                overflow: "hidden",
                animation: "fadeInUp 0.15s ease both",
              }}
            >
              {/* User info header */}
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--semantic-line-solid-normal)",
                  background:
                    "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.06))",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
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
                      style={{
                        display: "block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {user?.name}
                    </Typography>
                    <Typography
                      variant="caption1"
                      color="semantic.label.alternative"
                      style={{
                        display: "block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {user?.email}
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div style={{ padding: "6px" }}>
                <button
                  onClick={() => {
                    navigate("/mypage");
                    setDropdownOpen(false);
                  }}
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
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor =
                      "var(--semantic-background-normal-alternative)";
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "transparent";
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ flexShrink: 0, opacity: 0.7 }}
                  >
                    <circle
                      cx="8"
                      cy="5.5"
                      r="2.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path
                      d="M2.5 13.5c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  마이페이지
                </button>

                <div
                  style={{
                    height: "1px",
                    backgroundColor: "var(--semantic-line-solid-normal)",
                    margin: "4px 0",
                  }}
                />

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
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "#fef2f2";
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "transparent";
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ flexShrink: 0 }}
                  >
                    <path
                      d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.5 11l3-3-3-3M13.5 8H6"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            variant="outlined"
            color="assistive"
            size="small"
            onClick={() => navigate("/login")}
          >
            로그인
          </Button>
          <Button
            variant="solid"
            color="primary"
            size="small"
            onClick={() => navigate("/register")}
          >
            시작하기
          </Button>
        </div>
      )}
    </header>
  );
}
