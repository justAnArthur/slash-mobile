import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { authClient } from "@/lib/auth"
import { Redirect, Slot } from "expo-router"

export default function AuthenticatedLayout() {
  const { data: session, isPending } = authClient.useSession()

  const { currentThemeMode, theme } = useTheme()

  if (isPending)
    return (
      <ThemedView>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    )

  if (!session) return <Redirect href="/sign-in" />

  return <Slot />
}
