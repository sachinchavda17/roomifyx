import { useContext } from "react"

export const useToast = (ReactContext) => {
  const context = useContext(ReactContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

