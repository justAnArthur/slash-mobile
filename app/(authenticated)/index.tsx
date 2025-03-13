import { ChatsList } from "@/components/screens/chats/ChatsList"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { StyleSheet } from "react-native"

export default function HomeScreen() {
  return (
    <ChatsList
      query={{
        isPined: true
      }}
      fallbackChildren={
        <ThemedView style={styles.fallbackContainer}>
          <ThemedText style={styles.fallbackText}>No pinned chats</ThemedText>
        </ThemedView>
      }
    />
  )
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: "500"
  }
})
