export type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToasterToast = ToastProps & {
  id: string
  dismiss?: () => void
}

let count = 0
let toasts: ToasterToast[] = []

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

function toast({ title, description, variant = "default", ...props }: ToastProps) {
  const id = genId()

  const newToast = {
    id,
    title,
    description,
    variant,
    ...props,
  } as ToasterToast

  toasts = [...toasts, newToast]
  
  console.log("Toast:", newToast)
  
  return id
}

function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => {
      if (!toastId) {
        toasts = []
      } else {
        toasts = toasts.filter(t => t.id !== toastId)
      }
    }
  }
}

export { useToast, toast }
