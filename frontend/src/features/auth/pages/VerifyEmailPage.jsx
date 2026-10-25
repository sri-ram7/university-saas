import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { Spinner } from '@/components/ui'
import { useVerifyEmail } from '../hooks/useAuthMutations'
import { ROUTES } from '@/app/routes/routePaths'

export default function VerifyEmailPage() {
  const { token } = useParams()
  const verifyMutation = useVerifyEmail()
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true
    verifyMutation.mutate(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <div className="flex flex-col items-center text-center">
      {verifyMutation.isPending && <Spinner size="lg" label="Verifying your email…" />}

      {verifyMutation.isSuccess && (
        <>
          <FiCheckCircle size={36} className="text-emerald-500" />
          <h2 className="mt-3 font-display text-xl font-semibold text-slate-900 dark:text-slate-100">
            Email verified
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            You can now sign in to your account.
          </p>
        </>
      )}

      {verifyMutation.isError && (
        <>
          <FiXCircle size={36} className="text-rose-500" />
          <h2 className="mt-3 font-display text-xl font-semibold text-slate-900 dark:text-slate-100">
            Verification failed
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            This link may have expired. Try signing in or request a new link.
          </p>
        </>
      )}

      <Link
        to={ROUTES.login}
        className="mt-6 text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        Back to sign in
      </Link>
    </div>
  )
}
