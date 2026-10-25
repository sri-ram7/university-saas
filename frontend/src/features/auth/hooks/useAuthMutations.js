import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '@/app/providers/AuthProvider'
import {
  verifyEmailRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
} from '../services/authService'

export function useLogin() {
  const { login } = useAuth()
  return useMutation({
    mutationFn: login,
    onSuccess: (user) => toast.success(`Welcome back, ${user.name.split(' ')[0]}`),
  })
}

export function useRegister() {
  const { register } = useAuth()
  return useMutation({
    mutationFn: register,
    onSuccess: () => toast.success('Account created. You can now sign in.'),
  })
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token) => verifyEmailRequest(token),
    onSuccess: () => toast.success('Email verified. You can sign in now.'),
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: () => toast.success('If that email exists, a reset link was sent.'),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, password }) => resetPasswordRequest(token, { password }),
    onSuccess: () => toast.success('Password updated. You can sign in now.'),
  })
}
