import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { FiLock } from 'react-icons/fi'
import { Button, Input } from '@/components/ui'
import { resetPasswordSchema } from '../schemas/authSchemas'
import { useResetPassword } from '../hooks/useAuthMutations'
import { ROUTES } from '@/app/routes/routePaths'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const resetMutation = useResetPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = ({ password }) => {
    resetMutation.mutate(
      { token, password },
      { onSuccess: () => navigate(ROUTES.login, { replace: true }) }
    )
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Set a new password
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Choose a new password for your account.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="New password"
          type="password"
          placeholder="••••••••"
          leftIcon={<FiLock size={16} />}
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm new password"
          type="password"
          placeholder="••••••••"
          leftIcon={<FiLock size={16} />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" className="w-full" isLoading={resetMutation.isPending}>
          Update password
        </Button>
      </form>
    </div>
  )
}
