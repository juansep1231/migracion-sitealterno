import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { useLocation } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()

  React.useEffect(() => {
    // Dismiss all toasts when the route changes
    toast.dismiss()
  }, [location])

  return (
    <>
      {children}
      <ToastContainer />
    </>
  )
}

export const useToast = () => {
  const location = useLocation()

  const showToast = React.useCallback(
    (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
      toast[type](message, {
        toastId: location.pathname, // Use the current path as a unique ID
      })
    },
    [location]
  )

  return { showToast }
}