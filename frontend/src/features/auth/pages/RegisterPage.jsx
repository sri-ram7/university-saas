import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiUser } from 'react-icons/fi'
import { Button, Input, Select } from '@/components/ui'
import { registerSchema } from '../schemas/authSchemas'
import { ROLE_OPTIONS } from '../constants/authConstants'
import { useRegister } from '../hooks/useAuthMutations'
import { ROUTES } from '@/app/routes/routePaths'

export default function RegisterPage() {
  const navigate = useNavigate()
  const registerMutation = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'student' },
  })

  const onSubmit = (values) => {
    const { confirmPassword, ...payload } = values
    void confirmPassword
    registerMutation.mutate(payload, {
      onSuccess: () => navigate(ROUTES.login, { replace: true }),
    })
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Create your account
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Register to access the university console.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Full name"
          placeholder="Jane Doe"
          leftIcon={<FiUser size={16} />}
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@university.edu"
          leftIcon={<FiMail size={16} />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Select
          label="Role"
          options={ROLE_OPTIONS}
          error={errors.role?.message}
          {...register('role')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<FiLock size={16} />}
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          leftIcon={<FiLock size={16} />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" className="w-full" isLoading={registerMutation.isPending}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to={ROUTES.login} className="font-medium text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </div>
  )
}
