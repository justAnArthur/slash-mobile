import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState
} from "react"
import { ThemedView } from "@/components/ui/ThemedView"
import { ThemedText } from "@/components/ui/ThemedText"
import { useTheme } from "@/lib/a11y/ThemeContext"

export enum ToastType {
  INFO = "info",
  ERROR = "error"
}

export type Toast = {
  type: ToastType
  title: string
  content: ReactNode
}

type ToastContextValues = { addToast: (toast: Toast) => void }
const ToastsContext = createContext<ToastContextValues | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme()

  const [toasts, setToasts] = useState([] as (Toast & { id: string })[])

  function addToast(toast: Toast) {
    const id = new Date().getTime().toString()
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3141)
  }

  return (
    <ToastsContext.Provider value={{ addToast }}>
      {toasts.map((toast, index) => {
        let titleColor = ""
        let borderColor = ""

        switch (toast.type) {
          case ToastType.INFO:
            titleColor = theme.foreground
            borderColor = theme.border
            break
          case ToastType.ERROR:
            titleColor = theme.destructive
            borderColor = theme.destructive
            break
        }

        return (
          <ThemedView
            key={toast.id}
            style={{
              position: "absolute",
              left: 32,
              right: 32,
              bottom: 32 + index * 5,
              zIndex: 10 + index,

              padding: 10,
              borderRadius: 16,
              borderWidth: 2,
              borderColor
            }}
          >
            <ThemedText
              style={{ fontWeight: "bold", fontSize: 16, color: titleColor }}
            >
              {toast.title}
            </ThemedText>
            <ThemedText style={{ fontSize: 14 }}>{toast.content}</ThemedText>
          </ThemedView>
        )
      })}

      {children}
    </ToastsContext.Provider>
  )
}

export function useToasts() {
  const context = useContext(ToastsContext)
  if (!context) throw new Error("useToasts must be used within a ToastProvider")
  return context
}
