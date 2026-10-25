import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { FiMail } from 'react-icons/fi'
import { Button, Input, Alert } from '@/components/ui'
import { forgotPasswordSchema } from '../schemas/authSchemas'
import { useForgotPassword } from '../hooks/useAuthMutations'
import { ROUTES } from '@/app/routes/routePaths'

export default function ForgotPasswordPage() {
  const forgotMutation = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = (values) => forgotMutation.mutate(values)

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Reset your password
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Enter your email and we&apos;ll send a reset link.
      </p>

      {forgotMutation.isSuccess && (
        <Alert tone="success" className="mt-4">
          Check your inbox for a password reset link.
        </Alert>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@university.edu"
          leftIcon={<FiMail size={16} />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" className="w-full" isLoading={forgotMutation.isPending}>
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Remembered it?{' '}
        <Link to={ROUTES.login} className="font-medium text-brand-600 hover:text-brand-700">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
