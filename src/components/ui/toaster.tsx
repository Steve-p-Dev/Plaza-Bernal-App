
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-white/80 backdrop-blur-sm border-bernal-200/50 shadow-sm">
            <div className="grid gap-1">
              {title && <ToastTitle className="text-xs font-medium text-bernal-700">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-xs text-gray-500">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport className="fixed bottom-4 right-4 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-[280px]" />
    </ToastProvider>
  )
}
