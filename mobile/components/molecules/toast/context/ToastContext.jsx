import React, { createContext, useCallback, useContext, useEffect, useState } from "react"

const DEFAULT_TOAST_OPTIONS = {
  duration: 3000,
  type: "default",
  position: "top",
  // backgroundColor: "#262626",
  onClose: () => {},
  action: null,
  expandedContent: null,
  style: {},
}

const ToastContext = createContext(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const [expandedToasts, setExpandedToasts] = useState(new Set())

  const show = useCallback((content, options) => {
    const id = Math.random().toString(36).substring(2, 9)
    const toast = {
      id,
      content,
      options: {
        ...DEFAULT_TOAST_OPTIONS,
        ...options,
      },
    }
    setToasts((prevToasts) => [...prevToasts, toast])
    return id
  }, [])

  const update = useCallback((id, content, options) => {
    setToasts((prevToasts) =>
      prevToasts.map((toast) =>
        toast.id === id
          ? {
              ...toast,
              content,
              options: {
                ...toast.options,
                ...options,
              },
            }
          : toast,
      ),
    )
  }, [])

  const dismiss = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    setExpandedToasts((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
    setExpandedToasts(new Set())
  }, [])

  const expandToast = useCallback((id) => {
    setExpandedToasts((prev) => {
      const newSet = new Set(prev)
      if (newSet.size >= 3 && !newSet.has(id)) {
        const firstId = Array.from(newSet)[0]
        newSet.delete(firstId)
      }

      newSet.add(id)
      return newSet
    })
  }, [])

  const collapseToast = useCallback((id) => {
    setExpandedToasts((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }, [])

  useEffect(() => {
    if (toasts.length === 0) return
    const timeouts = []
    toasts.forEach((toast) => {
      if (toast.options.duration > 0) {
        const timeout = setTimeout(() => {
          dismiss(toast.id)
          toast.options.onClose?.()
        }, toast.options.duration)
        timeouts.push(timeout)
      }
    })
    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [toasts, dismiss])

  const value = {
    toasts,
    show,
    update,
    dismiss,
    dismissAll,
    expandedToasts,
    expandToast,
    collapseToast,
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

