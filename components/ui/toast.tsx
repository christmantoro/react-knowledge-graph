import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  onClose?: () => void
}

const Toast: React.FC<ToastProps> = ({ 
  title, 
  description, 
  variant = "default", 
  onClose 
}) => {
  const variantClasses = {
    default: "bg-background border-border",
    destructive: "bg-destructive text-destructive-foreground border-destructive",
    success: "bg-green-500 text-white border-green-500"
  }

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 w-96 rounded-lg border p-4 shadow-lg",
      variantClasses[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {title && <div className="font-semibold">{title}</div>}
          {description && <div className="text-sm mt-1">{description}</div>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// Simple toast context for basic notifications
const ToastContext = React.createContext<{
  showToast: (props: ToastProps) => void
} | null>(null)

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>([])

  const showToast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...props, id }])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 5000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  )
}

export { Toast }