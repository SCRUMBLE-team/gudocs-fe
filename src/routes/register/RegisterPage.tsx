import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  FormField,
  FormErrorMessage,
} from "@wanteddev/wds";
import { useAuth } from "../../hooks/useAuth";
import { useAuthStore } from "../../stores/useAuthStore";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

export default function RegisterPage() {
  const {
    handleRegister,
    validateEmail,
    validatePassword,
    validatePasswordMatch,
  } = useAuth();

  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!name.trim()) newErrors.name = "이름을 입력하세요.";
    if (!validateEmail(email))
      newErrors.email = "유효한 이메일 형식을 입력하세요.";
    if (!validatePassword(password))
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    if (!validatePasswordMatch(password, passwordConfirm))
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    handleRegister({ name, email, password, passwordConfirm });
  };

  const clearError = (field: keyof FormErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--semantic-background-normal-alternative)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "var(--semantic-background-normal-normal)",
          borderRadius: "16px",
          padding: "48px 40px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}
      >
        <Typography
          variant="title2"
          weight="bold"
          align="center"
          style={{ marginBottom: "8px", display: "block" }}
        >
          회원가입
        </Typography>
        <Typography
          variant="body2"
          color="semantic.label.alternative"
          align="center"
          style={{ marginBottom: "32px", display: "block" }}
        >
          구독 관리를 시작해보세요
        </Typography>

        <form
          noValidate
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <FormField flexDirection="column" gap="4px">
            <Typography
              variant="label1"
              weight="medium"
              color="semantic.label.normal"
              style={{ display: "block" }}
            >
              이름
            </Typography>
            <TextField
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("name");
              }}
              invalid={!!errors.name}
              width="100%"
            />
            {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
          </FormField>

          <FormField flexDirection="column" gap="4px">
            <Typography
              variant="label1"
              weight="medium"
              color="semantic.label.normal"
              style={{ display: "block" }}
            >
              이메일
            </Typography>
            <TextField
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError("email");
              }}
              invalid={!!errors.email}
              width="100%"
            />
            {errors.email && (
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            )}
          </FormField>

          <FormField flexDirection="column" gap="4px">
            <Typography
              variant="label1"
              weight="medium"
              color="semantic.label.normal"
              style={{ display: "block" }}
            >
              비밀번호
            </Typography>
            <TextField
              type="password"
              placeholder="비밀번호를 입력하세요 (8자 이상)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError("password");
              }}
              invalid={!!errors.password}
              width="100%"
            />
            {errors.password && (
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            )}
          </FormField>

          <FormField flexDirection="column" gap="4px">
            <Typography
              variant="label1"
              weight="medium"
              color="semantic.label.normal"
              style={{ display: "block" }}
            >
              비밀번호 확인
            </Typography>
            <TextField
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                clearError("passwordConfirm");
              }}
              invalid={!!errors.passwordConfirm}
              width="100%"
            />
            {errors.passwordConfirm && (
              <FormErrorMessage>{errors.passwordConfirm}</FormErrorMessage>
            )}
          </FormField>

          <Button
            type="submit"
            variant="solid"
            color="primary"
            size="large"
            fullWidth
            style={{ marginTop: "8px" }}
          >
            회원가입
          </Button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Typography variant="body2" color="semantic.label.alternative">
            이미 계정이 있으신가요?
            <Link
              to="/login"
              style={{
                color: "var(--semantic-primary-normal)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              로그인
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
}
