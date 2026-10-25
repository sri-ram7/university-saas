import { RouterProvider } from 'react-router-dom'
import QueryProvider from '@/app/providers/QueryProvider'
import { AuthProvider } from '@/app/providers/AuthProvider'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import ToastProvider from '@/app/providers/ToastProvider'
import { router } from '@/app/routes/router'

export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}
