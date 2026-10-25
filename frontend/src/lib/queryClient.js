import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'
import toast from 'react-hot-toast'

function extractMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.errors?.[0]?.msg ||
    error?.message ||
    'Something went wrong'
  )
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Silent queries (e.g. background refetches with cached data already shown)
      // still surface a toast once per failure so users aren't left guessing.
      if (query.state.data !== undefined) return
      toast.error(extractMessage(error))
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(extractMessage(error))
    },
  }),
})
