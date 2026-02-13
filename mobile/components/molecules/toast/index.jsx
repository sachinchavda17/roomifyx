import * as React from "react"
import { ToastProvider, useToast } from "./context/ToastContext"
import { ToastViewport } from "./ToastViewPort"

const toastRef = {}

const ToastController = () => {
  const toast = useToast()

  toastRef.show = toast.show
  toastRef.update = toast.update
  toastRef.dismiss = toast.dismiss
  toastRef.dismissAll = toast.dismissAll

  return null
}

export const ToastProviderWithViewport = ({ children }) => {
  return (
    <ToastProvider>
      <ToastController />
      {children}
      <ToastViewport />
    </ToastProvider>
  )
}

export const Toast = {
  show: (content, options) => {
    if (!toastRef.show) {
      console.error("Toast provider not initialized. Make sure you have wrapped your app with ToastProviderWithViewport.")
      return ""
    }
    return toastRef.show(content, options)
  },
  update: (id, content, options) => {
    if (!toastRef.update) {
      console.error("Toast provider not initialized. Make sure you have wrapped your app with ToastProviderWithViewport.")
      return
    }
    return toastRef.update(id, content, options)
  },
  dismiss: (id) => {
    if (!toastRef.dismiss) {
      console.error("Toast provider not initialized. Make sure you have wrapped your app with ToastProviderWithViewport.")
      return
    }
    return toastRef.dismiss(id)
  },
  dismissAll: () => {
    if (!toastRef.dismissAll) {
      console.error("Toast provider not initialized. Make sure you have wrapped your app with ToastProviderWithViewport.")
      return
    }
    return toastRef.dismissAll()
  },
}

export { ToastProvider, useToast } from "./context/ToastContext"

