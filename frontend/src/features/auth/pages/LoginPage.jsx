import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiMail, FiLock } from 'react-icons/fi'
import { Button, Input } from '@/components/ui'
import { loginSchema } from '../schemas/authSchemas'
import { useLogin } from '../hooks/useAuthMutations'
import { ROUTES } from '@/app/routes/routePaths'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const onSubmit = (values) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        const redirectTo = location.state?.from?.pathname || ROUTES.dashboard
        navigate(redirectTo, { replace: true })
      },
    })
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Sign in
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Welcome back — enter your credentials to continue.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@university.edu"
          leftIcon={<FiMail size={16} />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<FiLock size={16} />}
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex justify-end">
          <Link
            to={ROUTES.forgotPassword}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.register} className="font-medium text-brand-600 hover:text-brand-700">
          Create one
        </Link>
      </p>
    </div>
  )
}
