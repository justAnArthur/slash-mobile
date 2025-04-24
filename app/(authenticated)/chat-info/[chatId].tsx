import { ThemedActivityIndicator } from "@/components/ui/ThemedActivityIndicator"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { useBackend } from "@/lib/services/backend/use"
import { AntDesign } from "@expo/vector-icons"
import type {
  ChatResponse,
  ChatInfoResponse
} from "@slash/backend/src/api/chats/chats.api"
import { useLocalSearchParams } from "expo-router"
import { backend } from "@/lib/services/backend"
import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { ThemedLink } from "@/components/ui/ThemedLink"
import { bufferToUri } from "@/components/screens/chat/bufferToUri"
import ImageGrid from "@/components/screens/chat-info/ImageGrid"

const ChatInfoScreen = () => {
  const styles = useStyles()
  const { chatId } = useLocalSearchParams()
  const [attachmentUris, setAttachmentUris] = useState<
    { id: string; uri: string }[]
  >([])

  const {
    data: chat,
    loading: chatLoading,
    error: chatError
  } = useBackend<ChatResponse>(
    () =>
      // @ts-ignore
      backend.chats[chatId].get(),
    [chatId],
    {
      transform: (response) => response.data?.chat
    }
  )

  const {
    data: chatInfo,
    loading: infoLoading,
    error: infoError
  } = useBackend<ChatInfoResponse>(
    () =>
      // @ts-ignore
      backend.chats[chatId].info.get(),
    [chatId],
    {
      transform: (response) => response.data
    }
  )

  // Fetch attachment images when chatInfo is available
  useEffect(() => {
    if (chatInfo?.attachmentIds?.length) {
      const fetchAttachments = async () => {
        try {
          const attachmentPromises = chatInfo.attachmentIds.map(async (id) => {
            const response = await backend.files[id].get()
            if (response.data) {
              const uri = bufferToUri(response.data)
              return { id, uri }
            }
            return null
          })

          const results = (await Promise.all(attachmentPromises)).filter(
            (result): result is { id: string; uri: string } => result !== null
          )

          setAttachmentUris(results)
        } catch (error) {
          console.error("Error fetching attachments:", error)
        }
      }

      fetchAttachments()
    }
  }, [chatInfo?.attachmentIds])

  if (chatLoading || infoLoading) return <ThemedActivityIndicator />

  if (chatError || infoError || !chat || !chatInfo)
    return <ThemedText>Error loading chat information</ThemedText>

  // Map attachmentUris to match ImageGrid's expected prop format
  const images = attachmentUris.map(({ id, uri }) => ({
    id,
    image: uri
  }))

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedLink href={`/chats/${chatId}`}>
          <AntDesign name="arrowleft" size={20} />
        </ThemedLink>
        <ThemedText type="title">Chat Information</ThemedText>
        <ThemedView style={{ width: 20 }} />
      </ThemedView>

      <ThemedText type="subtitle">Chat Details</ThemedText>
      <ThemedView style={styles.infoSection}>
        <ThemedText>
          Chat Name: {chat.name || chat.participants[0]?.name || "Unnamed Chat"}
        </ThemedText>
        <ThemedText>
          Created: {new Date(chatInfo.createdAt).toLocaleDateString()}
        </ThemedText>
        <ThemedText>Total Messages: {chatInfo.totalMessages}</ThemedText>
        <ThemedText>Attachments: {chatInfo.attachmentIds.length}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.attachmentsSection}>
        <ThemedText type="subtitle">Attachments</ThemedText>
        {attachmentUris.length === 0 && chatInfo.attachmentIds.length > 0 ? (
          <ThemedActivityIndicator size="small" />
        ) : attachmentUris.length === 0 ? (
          <ThemedText>No attachments found</ThemedText>
        ) : (
          <View style={{ width: "100%" }}>
            <ImageGrid images={images} />
          </View>
        )}
      </ThemedView>
    </ThemedView>
  )
}

function useStyles() {
  const { theme } = useTheme()

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      padding: 16,
      gap: 16
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 8
    },
    infoSection: {
      flexDirection: "column",
      gap: 5,
      borderRadius: 8
    },
    attachmentsSection: {
      flex: 1,
      flexDirection: "column",
      gap: 8
    }
  })
}

export default ChatInfoScreen
