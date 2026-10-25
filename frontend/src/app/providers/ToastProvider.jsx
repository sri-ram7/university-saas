import { Toaster } from 'react-hot-toast'

export default function ToastProvider({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--toast-bg, #111827)',
            color: '#fff',
            fontSize: '13px',
            borderRadius: '10px',
          },
          success: { iconTheme: { primary: '#0EA5A0', secondary: '#fff' } },
          error: { iconTheme: { primary: '#E11D48', secondary: '#fff' } },
        }}
      />
    </>
  )
}
