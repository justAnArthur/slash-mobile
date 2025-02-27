import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { ChatInputForm } from "@/components/screens/chats/ChatInputForm"
import { ThemedLink } from "@/components/ui/ThemedLink"
import { useI18nT } from "@/lib/i18n/Context"
import AntDesign from "@expo/vector-icons/AntDesign"
import { useState } from "react"
import { StyleSheet } from "react-native"

export default function TestPage() {
  const t = useI18nT("screens.chats")

  // todo handle messages from ChatInputForm:
  // 1. Send message to server
  // 2. Save to local storage
  const [messages, setMessages] = useState()

  return (
    <ThemedView style={styles.content}>
      <ThemedView style={styles.header}>
        <ThemedLink href="/" style={{ alignSelf: "flex-start", flexShrink: 1 }}>
          <AntDesign name="arrowleft" size={24} />
        </ThemedLink>

        <ThemedText type="title">title</ThemedText>
      </ThemedView>

      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ThemedText type="default">"content"</ThemedText>
      </ThemedView>

      <ChatInputForm onSubmit={console.log} />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    height: "100%"
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  }
})
