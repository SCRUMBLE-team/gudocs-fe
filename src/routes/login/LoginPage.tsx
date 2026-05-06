import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  FormField,
  FormErrorMessage,
} from "@wanteddev/wds";
import { useAuth } from "../../hooks/useAuth";
import { getUser } from "../../api/auth";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const { handleLogin, validateEmail, validatePassword } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!validateEmail(email))
      newErrors.email = "유효한 이메일 형식을 입력하세요.";
    if (!validatePassword(password))
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    handleLogin({ email, password });
  };

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser();
      console.log(user);
    }

    fetchUser();
  }, []);

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
          로그인
        </Typography>
        <Typography
          variant="body2"
          color="semantic.label.alternative"
          align="center"
          style={{ marginBottom: "32px", display: "block" }}
        >
          구독 관리 대시보드에 오신 걸 환영합니다
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
              이메일
            </Typography>
            <TextField
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email)
                  setErrors((prev) => ({ ...prev, email: undefined }));
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
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              invalid={!!errors.password}
              width="100%"
            />
            {errors.password && (
              <FormErrorMessage>{errors.password}</FormErrorMessage>
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
            로그인
          </Button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Typography variant="body2">
            계정이 없으신가요?{" "}
            <Link
              to="/register"
              style={{
                color: "var(--semantic-primary-normal)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              회원가입
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
}
