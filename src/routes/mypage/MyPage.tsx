import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  FormField,
  FormErrorMessage,
  useToast,
} from "@wanteddev/wds";
import Header from "../../layouts/Header";
import { useAuthStore } from "../../stores/useAuthStore";

interface PasswordErrors {
  current?: string;
  next?: string;
  confirm?: string;
}

export default function MyPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, isAuthenticated } = useAuthStore();

  const [name, setName] = useState(user?.name ?? "");
  const [isEditingName, setIsEditingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwErrors, setPwErrors] = useState<PasswordErrors>({});

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const handleNameSave = () => {
    if (!name.trim()) return;
    toast({ content: "API 연동 후 사용 가능합니다.", variant: "informative", duration: "short" });
    setIsEditingName(false);
    setName(user?.name ?? "");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: PasswordErrors = {};

    if (!currentPassword) errs.current = "현재 비밀번호를 입력하세요.";
    if (newPassword.length < 8) errs.next = "새 비밀번호는 8자 이상이어야 합니다.";
    if (newPassword !== confirmPassword) errs.confirm = "비밀번호가 일치하지 않습니다.";

    if (Object.keys(errs).length > 0) {
      setPwErrors(errs);
      return;
    }

    toast({ content: "API 연동 후 사용 가능합니다.", variant: "informative", duration: "short" });
  };

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      toast({ content: "비밀번호를 입력하세요.", variant: "negative", duration: "short" });
      return;
    }
    toast({ content: "API 연동 후 사용 가능합니다.", variant: "informative", duration: "short" });
    setShowDeleteConfirm(false);
    setDeletePassword("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--semantic-background-normal-alternative)",
    }}>
      <Header />

      <div style={{
        maxWidth: "660px",
        margin: "0 auto",
        padding: "40px 24px 80px",
        animation: "fadeInUp 0.4s ease both",
      }}>
        {/* ── Page title ── */}
        <div style={{ marginBottom: "28px" }}>
          <Typography variant="title2" weight="bold" color="semantic.label.normal" style={{ display: "block" }}>
            마이페이지
          </Typography>
          <Typography variant="body2" color="semantic.label.alternative" style={{ display: "block", marginTop: "4px" }}>
            계정 정보를 확인하고 수정하세요
          </Typography>
        </div>

        {/* ── Profile card ── */}
        <div style={{
          backgroundColor: "var(--semantic-background-normal-normal)",
          borderRadius: "20px",
          padding: "28px 32px",
          marginBottom: "16px",
          border: "1px solid var(--semantic-line-solid-normal)",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          background: "linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(139,92,246,0.04) 100%), var(--semantic-background-normal-normal)",
        }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", fontWeight: "800",
            color: "white", flexShrink: 0,
            boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
          }}>
            {initials}
          </div>
          <div>
            <Typography variant="title3" weight="bold" color="semantic.label.normal" style={{ display: "block" }}>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="semantic.label.alternative" style={{ display: "block", marginTop: "4px" }}>
              {user?.email}
            </Typography>
            <div style={{
              marginTop: "10px",
              display: "inline-flex", alignItems: "center", gap: "4px",
              backgroundColor: "rgba(99,102,241,0.08)",
              borderRadius: "999px", padding: "3px 10px",
            }}>
              <span style={{ fontSize: "11px" }}>✅</span>
              <Typography variant="caption1" style={{ color: "#6366f1", fontWeight: "600" }}>
                인증된 계정
              </Typography>
            </div>
          </div>
        </div>

        {/* ── Basic info ── */}
        <Section title="기본 정보">
          {/* Name */}
          <FieldRow label="이름">
            {isEditingName ? (
              <div style={{ display: "flex", gap: "8px", flex: 1 }}>
                <TextField
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  width="100%"
                  autoFocus
                />
                <Button variant="solid" color="primary" size="small" onClick={handleNameSave}>
                  저장
                </Button>
                <Button
                  variant="outlined"
                  color="assistive"
                  size="small"
                  onClick={() => { setName(user?.name ?? ""); setIsEditingName(false); }}
                >
                  취소
                </Button>
              </div>
            ) : (
              <>
                <Typography variant="body1" color="semantic.label.normal">{user?.name}</Typography>
                <Button variant="outlined" color="assistive" size="small" onClick={() => setIsEditingName(true)}>
                  수정
                </Button>
              </>
            )}
          </FieldRow>

          <Divider />

          {/* Email */}
          <FieldRow label="이메일">
            <Typography variant="body1" color="semantic.label.normal">{user?.email}</Typography>
            <div style={{
              backgroundColor: "#f3f0ff", color: "#7c3aed",
              borderRadius: "999px", padding: "3px 12px",
              fontSize: "12px", fontWeight: "600",
              fontFamily: "Pretendard, sans-serif",
            }}>
              변경 불가
            </div>
          </FieldRow>
        </Section>

        {/* ── Password change ── */}
        <Section title="비밀번호 변경">
          <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <FormField flexDirection="column" gap="6px">
              <Typography variant="label1" weight="medium" color="semantic.label.alternative" style={{ display: "block" }}>
                현재 비밀번호
              </Typography>
              <TextField
                type="password"
                placeholder="현재 비밀번호를 입력하세요"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (pwErrors.current) setPwErrors((p) => ({ ...p, current: undefined }));
                }}
                invalid={!!pwErrors.current}
                width="100%"
              />
              {pwErrors.current && <FormErrorMessage>{pwErrors.current}</FormErrorMessage>}
            </FormField>

            <FormField flexDirection="column" gap="6px">
              <Typography variant="label1" weight="medium" color="semantic.label.alternative" style={{ display: "block" }}>
                새 비밀번호
              </Typography>
              <TextField
                type="password"
                placeholder="새 비밀번호를 입력하세요 (8자 이상)"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (pwErrors.next) setPwErrors((p) => ({ ...p, next: undefined }));
                }}
                invalid={!!pwErrors.next}
                width="100%"
              />
              {pwErrors.next && <FormErrorMessage>{pwErrors.next}</FormErrorMessage>}
            </FormField>

            <FormField flexDirection="column" gap="6px">
              <Typography variant="label1" weight="medium" color="semantic.label.alternative" style={{ display: "block" }}>
                새 비밀번호 확인
              </Typography>
              <TextField
                type="password"
                placeholder="새 비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (pwErrors.confirm) setPwErrors((p) => ({ ...p, confirm: undefined }));
                }}
                invalid={!!pwErrors.confirm}
                width="100%"
              />
              {pwErrors.confirm && <FormErrorMessage>{pwErrors.confirm}</FormErrorMessage>}
            </FormField>

            <div>
              <Button type="submit" variant="solid" color="primary" size="medium">
                비밀번호 변경
              </Button>
            </div>
          </form>
        </Section>

        {/* ── Danger zone ── */}
        <div style={{
          backgroundColor: "var(--semantic-background-normal-normal)",
          borderRadius: "20px",
          padding: "28px 32px",
          border: "1.5px solid #fecaca",
        }}>
          <Typography
            variant="title3"
            weight="bold"
            style={{ display: "block", marginBottom: "8px", color: "#dc2626" }}
          >
            위험 영역
          </Typography>
          <Typography
            variant="body2"
            color="semantic.label.alternative"
            style={{ display: "block", marginBottom: "24px" }}
          >
            계정을 삭제하면 모든 구독 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
          </Typography>

          {showDeleteConfirm ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "10px",
                padding: "12px 16px",
              }}>
                <Typography variant="body2" style={{ color: "#b91c1c" }}>
                  ⚠️ 이 작업은 되돌릴 수 없습니다. 계속하려면 비밀번호를 입력하세요.
                </Typography>
              </div>
              <FormField flexDirection="column" gap="6px">
                <Typography variant="label1" weight="medium" color="semantic.label.normal" style={{ display: "block" }}>
                  비밀번호 확인
                </Typography>
                <TextField
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  width="100%"
                />
              </FormField>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleDeleteAccount}
                  style={{
                    backgroundColor: "#dc2626", color: "white",
                    fontWeight: "600", fontSize: "14px",
                    padding: "9px 20px", borderRadius: "10px",
                    border: "none", cursor: "pointer",
                    fontFamily: "Pretendard, sans-serif",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#b91c1c";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#dc2626";
                  }}
                >
                  계정 삭제 확인
                </button>
                <Button
                  variant="outlined"
                  color="assistive"
                  size="small"
                  onClick={() => { setShowDeleteConfirm(false); setDeletePassword(""); }}
                >
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                backgroundColor: "transparent",
                color: "#dc2626",
                fontWeight: "600", fontSize: "14px",
                padding: "9px 20px", borderRadius: "10px",
                border: "1.5px solid #fca5a5",
                cursor: "pointer",
                fontFamily: "Pretendard, sans-serif",
                transition: "background 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#fef2f2";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#dc2626";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#fca5a5";
              }}
            >
              계정 삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Small layout helpers ── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: "var(--semantic-background-normal-normal)",
      borderRadius: "20px",
      padding: "28px 32px",
      marginBottom: "16px",
      border: "1px solid var(--semantic-line-solid-normal)",
    }}>
      <Typography
        variant="title3"
        weight="bold"
        color="semantic.label.normal"
        style={{ display: "block", marginBottom: "22px" }}
      >
        {title}
      </Typography>
      {children}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", minHeight: "44px" }}>
      <Typography
        variant="label1"
        weight="medium"
        color="semantic.label.alternative"
        style={{ flexShrink: 0, minWidth: "80px" }}
      >
        {label}
      </Typography>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, justifyContent: "flex-end" }}>
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div style={{
      height: "1px",
      backgroundColor: "var(--semantic-line-solid-normal)",
      margin: "16px 0",
    }} />
  );
}
