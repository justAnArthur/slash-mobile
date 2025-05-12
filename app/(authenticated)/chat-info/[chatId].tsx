import { ThemedActivityIndicator } from "@/components/ui/ThemedActivityIndicator"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { useBackend } from "@/lib/services/backend/use"
import { AntDesign } from "@expo/vector-icons"
import type {
  ChatInfoResponse,
  ChatResponse
} from "@slash/backend/src/api/chats/chats.api"
import { useLocalSearchParams } from "expo-router"
import { backend } from "@/lib/services/backend"
import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { ThemedLink } from "@/components/ui/ThemedLink"
import { bufferToUri } from "@/components/screens/chat/bufferToUri"
import ImageGrid from "@/components/screens/chat-info/ImageGrid"
import { useI18nT } from "@/lib/i18n/Context"

const ChatInfoScreen = () => {
  const styles = useStyles()
  const t = useI18nT("screens.chatInfo")

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
        <ThemedText type="title">{t("title")}</ThemedText>
        <ThemedView style={{ width: 20 }} />
      </ThemedView>

      <ThemedText type="subtitle">{t("details")}</ThemedText>
      <ThemedView style={styles.infoSection}>
        <ThemedText>
          {t("name")}:{" "}
          {chat.name || chat.participants[0]?.name || "Unnamed Chat"}
        </ThemedText>
        <ThemedText>
          {t("createdAt")}: {new Date(chatInfo.createdAt).toLocaleDateString()}
        </ThemedText>
        <ThemedText>
          {t("totalMessages")}: {chatInfo.totalMessages}
        </ThemedText>
        <ThemedText>
          {t("totalAttachments")}: {chatInfo.attachmentIds.length}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.attachmentsSection}>
        <ThemedText type="subtitle">{t("attachments")}</ThemedText>
        {attachmentUris.length === 0 && chatInfo.attachmentIds.length > 0 ? (
          <ThemedActivityIndicator size="small" />
        ) : attachmentUris.length === 0 ? (
          <ThemedText>{t("noAttachments")}</ThemedText>
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
