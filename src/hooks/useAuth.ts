import { useNavigate } from "react-router-dom";
import { useToast } from "@wanteddev/wds";
import { useAuthStore } from "../stores/useAuthStore";
import type { LoginRequest, SignUpRequest } from "../type/auth";
import { getUser, login, logout, signUp } from "../api/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useAuth() {
  const navigate = useNavigate();
  const toast = useToast();
  const { setUser } = useAuthStore();

  const validateEmail = (email: string) => EMAIL_REGEX.test(email);
  const validatePassword = (password: string) => password.length >= 8;
  const validatePasswordMatch = (password: string, confirm: string) =>
    password === confirm;

  const handleLogin = async ({ email, password }: LoginRequest) => {
    try {
      await login({ email, password });
      const result = await getUser();
      setUser(result.data);
      navigate("/dashboard");
      toast({
        content: `${result.data.name}님, 어서오세요!`,
        variant: "positive",
        duration: "short",
      });
    } catch {
      toast({
        content: "로그인에 실패했습니다",
        variant: "negative",
        duration: "short",
      });
    }
  };

  const handleRegister = async (data: SignUpRequest) => {
    try {
      await signUp(data);
      toast({
        content: "회원가입이 완료되었습니다.",
        variant: "positive",
        duration: "short",
      });
      navigate("/login");
    } catch {
      toast({
        content: "회원가입에 실패했습니다",
        variant: "negative",
        duration: "short",
      });
    }
  };

  const handleLogout = () => {
    logout();
  };

  return {
    handleLogin,
    handleRegister,
    handleLogout,
    validateEmail,
    validatePassword,
    validatePasswordMatch,
  };
}
