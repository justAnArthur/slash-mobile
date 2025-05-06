import { Navigation } from "@/components/layout/Navigation"
import { NetworkStatusBar } from "@/components/layout/NetworkStatusBar"
import { ThemedActivityIndicator } from "@/components/ui/ThemedActivityIndicator"
import { ThemedView } from "@/components/ui/ThemedView"
import { authClient } from "@/lib/auth"
import { WebSocketProvider } from "@/lib/services/WebSocketProvider"
import { Redirect, Slot } from "expo-router"
import { StyleSheet, View } from "react-native"
import { HandlePushNotifications } from "@/lib/push/HandlePushNotifications"
import { ToastProvider } from "@/components/layout/Toasts"

export default function AuthenticatedLayout() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return <ThemedActivityIndicator />

  // @ts-ignore
  if (!session) return <Redirect href="/sign-in" />

  return (
    <ToastProvider>
      <WebSocketProvider>
        <View style={styles.container}>
          <HandlePushNotifications />
          <NetworkStatusBar />

          <ThemedView style={styles.content}>
            <Slot />
            <Navigation />
          </ThemedView>
        </View>
      </WebSocketProvider>
    </ToastProvider>
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
