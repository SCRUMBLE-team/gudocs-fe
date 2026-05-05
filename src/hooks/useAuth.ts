import { useNavigate } from 'react-router-dom'
import { useToast } from '@wanteddev/wds'
import { useAuthStore } from '../stores/useAuthStore'
import type { LoginRequest, SignUpRequest } from '../type/auth'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useAuth() {
  const navigate = useNavigate()
  const toast = useToast()
  const { login, logout } = useAuthStore()

  const validateEmail = (email: string) => EMAIL_REGEX.test(email)
  const validatePassword = (password: string) => password.length >= 8
  const validatePasswordMatch = (password: string, confirm: string) => password === confirm

  const handleLogin = ({ email, password: _password }: LoginRequest) => {
    // TODO: 실제 API 연동 시 교체
    login({ userId: 1, name: '테스트 사용자', email })
    navigate('/dashboard')
  }

  const handleRegister = (_data: SignUpRequest) => {
    // TODO: 실제 API 연동 시 교체
    toast({ content: '회원가입이 완료되었습니다.', variant: 'positive', duration: 'short' })
    navigate('/login')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return {
    handleLogin,
    handleRegister,
    handleLogout,
    validateEmail,
    validatePassword,
    validatePasswordMatch,
  }
}
