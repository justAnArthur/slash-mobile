import { Navigation } from "@/components/layout/Navigation"
import { NetworkNotificationBar } from "@/components/layout/NetworkNotificationBar"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { authClient } from "@/lib/auth"
import { Redirect, Slot } from "expo-router"
import { StyleSheet, View } from "react-native"

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
    <View style={styles.container}>
      <NetworkNotificationBar />
      <ThemedView style={styles.content}>
        <Slot />
        <Navigation />
      </ThemedView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%"
  },
  content: {
    padding: 12,
    flex: 1
  }
})
