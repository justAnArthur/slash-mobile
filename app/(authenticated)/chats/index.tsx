import { ChatsList } from "@/components/screens/chats/ChatsList"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { useI18nT } from "@/lib/i18n/Context"
import { StyleSheet, Dimensions, useWindowDimensions } from "react-native"
import React, { useState } from "react"
import ChatScreen from "./[chatId]"
import { router } from "expo-router"

export default function ChatsPage() {
  const t = useI18nT("screens.chats")
  const { width } = useWindowDimensions()
  const isDesktopView = width >= 768
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)

  function openChat(chatId: string) {
    // @ts-ignore
    router.push(`/chats/${chatId}`)
  }
  return (
    <ThemedView style={styles.container}>
      {isDesktopView ? (
        <ThemedView style={styles.desktopContainer}>
          <ThemedView style={styles.chatListContainer}>
            <ChatsList
              onChatSelect={setSelectedChatId}
              fallbackChildren={
                <ThemedView style={styles.fallbackContainer}>
                  <ThemedText style={styles.fallbackText}>
                    {t("noChats")}
                  </ThemedText>
                </ThemedView>
              }
            />
          </ThemedView>
          <ThemedView style={styles.chatScreenContainer}>
            {selectedChatId ? (
              <ChatScreen chatId={selectedChatId} />
            ) : (
              <ThemedView style={styles.fallbackContainer}>
                <ThemedText style={styles.fallbackText}>
                  {t("selectAChat")}
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>
      ) : (
        <ChatsList
          onChatSelect={openChat}
          fallbackChildren={
            <ThemedView style={styles.fallbackContainer}>
              <ThemedText style={styles.fallbackText}>
                {t("noChats")}
              </ThemedText>
            </ThemedView>
          }
        />
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  desktopContainer: {
    flex: 1,
    flexDirection: "row"
  },
  chatListContainer: {
    width: "30%",
    borderRightWidth: 1,
    borderRightColor: "#ccc"
  },
  chatScreenContainer: {
    width: "70%",
    flex: 1,
    marginBottom: 75
  },
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
