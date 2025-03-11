import { Navigation } from "@/components/layout/Navigation"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { authClient } from "@/lib/auth"
import { Redirect, Slot } from "expo-router"
import { StyleSheet } from "react-native"

export default function AuthenticatedLayout() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending)
    return (
      <ThemedView>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    )

  if (!session) return <Redirect href="/sign-in" />

  return (
    <ThemedView style={styles.container}>
      <Slot />
      <Navigation />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    height: "100%"
  }
})
