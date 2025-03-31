import { ChatsList } from "@/components/screens/chats/ChatsList"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { useI18nT } from "@/lib/i18n/Context"
import { StyleSheet } from "react-native"

export default function ChatsPage() {
  const t = useI18nT("screens.chats")

  return (
    <ChatsList
      fallbackChildren={
        <ThemedView style={styles.fallbackContainer}>
          <ThemedText style={styles.fallbackText}>{t("noChats")}</ThemedText>
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

export const chatsFallbackStyles = styles
