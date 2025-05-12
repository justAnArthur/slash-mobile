<<<<<<< HEAD
import { useFonts } from "expo-font"
import { Slot } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import { ThemeProvider } from "@/lib/a11y/ThemeContext"
import { I18nProvider } from "@/lib/i18n/Context"
import { ToastProvider } from "@/components/layout/Toasts"

// Prevent the splash screen from auto-hiding before asset loading is complete.
// noinspection JSIgnoredPromiseFromCall
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded] = useFonts({
    JetBrainsMono: require("../assets/fonts/JetBrainsMono/JetBrainsMonoNL-Regular.ttf")
  })

  useEffect(() => {
    if (!loaded) return

    // noinspection JSIgnoredPromiseFromCall
    SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) return null

  return (
    <I18nProvider>
      <ThemeProvider>
        <ToastProvider>
          <Slot />
        </ToastProvider>
      </ThemeProvider>
    </I18nProvider>
  )
}
=======
import { useFonts } from "expo-font"
import { Slot } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import { ThemeProvider } from "@/lib/a11y/ThemeContext"
import { I18nProvider } from "@/lib/i18n/Context"
import { ToastProvider } from "@/components/layout/Toasts"

// Prevent the splash screen from auto-hiding before asset loading is complete.
// noinspection JSIgnoredPromiseFromCall
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded] = useFonts({
    JetBrainsMono: require("../assets/fonts/JetBrainsMono/JetBrainsMonoNL-Regular.ttf")
  })

  useEffect(() => {
    if (!loaded) return

    // noinspection JSIgnoredPromiseFromCall
    SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) return null

  return (
    <I18nProvider>
      <ThemeProvider>
        <ToastProvider>
          <Slot />
        </ToastProvider>
      </ThemeProvider>
    </I18nProvider>
  )
}
>>>>>>> 22703bd7fa6ddb9c5f3446763a1797c3b2ec69d8
