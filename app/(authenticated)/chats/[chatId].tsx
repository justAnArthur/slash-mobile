import {
  ChatInputForm,
  type MessageTypeDataTypes,
  type MessageTypeT
} from "@/components/screens/chat/ChatInputForm"
import { MessageCard } from "@/components/screens/chat/MessageCard"
import { Avatar } from "@/components/screens/common/Avatar"
import { ThemedActivityIndicator } from "@/components/ui/ThemedActivityIndicator"
import { ThemedLink } from "@/components/ui/ThemedLink"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { authClient } from "@/lib/auth"
import { useWebSocket } from "@/lib/services/WebSocketProvider"
import { backend } from "@/lib/services/backend"
import { BACKEND_URL } from "@/lib/services/backend/url"
import { useBackend } from "@/lib/services/backend/use"
import { AntDesign } from "@expo/vector-icons"
import type { ChatResponse } from "@slash/backend/src/api/chats/chats.api"
import type {
  MessageResponse,
  PaginatedMessageResponse
} from "@slash/backend/src/api/messages/messages.api"
import type { ImagePickerAsset } from "expo-image-picker"
import { useLocalSearchParams } from "expo-router"
import React, { useState } from "react"
import { FlatList, StyleSheet } from "react-native"

const pageSize = 10

const ChatScreen = () => {
  const styles = useStyles()

  const { chatId } = useLocalSearchParams()
  const { messages: wsMessages } = useWebSocket()

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

  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const {
    data: backendMessages = [],
    loading: messagesLoading,
    error: messagesError
  } = useBackend<MessageResponse[]>(
    () =>
      // @ts-ignore
      backend.messages[chatId].get({
        query: {
          page,
          pageSize
        }
      }),
    [page],
    {
      transform: (response: { data: PaginatedMessageResponse }, params) => {
        setHasMore(response.data?.pagination?.totalPages > page)
        return (params?.prev || []).concat(response.data?.messages || [])
      },
      haveTo: hasMore
    }
  )

  const seenMessageIds = new Set()
  // @ts-ignore
  const messages = [
    ...(wsMessages[chatId as string] || []),
    ...(backendMessages || [])
  ]
    .filter((message) => {
      if (seenMessageIds.has(message.id)) {
        return false
      }
      seenMessageIds.add(message.id)
      return true
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  async function sendMessage<T extends MessageTypeT>({
    type,
    data
  }: { type: MessageTypeT; data: MessageTypeDataTypes[T] }) {
    let handledUploadType = "TEXT"
    const content = data as any

    const formData = new FormData()

    switch (type) {
      case "TEXT":
        formData.append("content", content)
        handledUploadType = "TEXT"
        break

      case "IMAGE_GALLERY":
      case "IMAGE_CAMERA":
        // biome-ignore lint/correctness/noSwitchDeclarations: <explanation>
        const image = data as ImagePickerAsset

        if (image.uri.startsWith("data:") || image.uri.startsWith("blob:")) {
          const blob = await fetch(image.uri).then((res) => res.blob())
          formData.append("content", blob, `photo.${blob.type.split("/")[1]}`)
        } else {
          // Android / iOS handling
          const uriParts = image.uri.split(".")
          const fileType = uriParts[uriParts.length - 1]

          // @ts-ignore
          formData.append("content", {
            uri: image.uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`
          })
        }

        handledUploadType = "IMAGE"
        break
      case "LOCATION":
        formData.append("content", JSON.stringify(data))
        handledUploadType = "LOCATION"
        break
    }

    formData.append("type", handledUploadType)

    try {
      const response = await fetch(`${BACKEND_URL!}/messages/${chatId}`, {
        method: "POST",
        body: formData,
        headers: {
          Cookie: authClient.getCookie()
        },
        credentials: "include"
      })

      console.log({ response })
    } catch (error) {
      console.error(error)
    }
  }

  if (chatLoading || messagesLoading) return <ThemedActivityIndicator />

  if (chatError || messagesError || !chat || !messages)
    return <ThemedText>Error</ThemedText>

  return (
    <ThemedView style={styles.content}>
      <ThemedView style={styles.header}>
        <ThemedLink href="/chats">
          <AntDesign name="arrowleft" size={20} />
        </ThemedLink>

        <ThemedView
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
        >
          {chat.type === "group" ? (
            <>
              <Avatar username={chat.name} avatar={chat.image} />
              <ThemedText type="title">{chat.name}</ThemedText>
            </>
          ) : (
            <>
              {chat.participants.length > 0 ? (
                <>
                  <Avatar
                    username={chat.participants[0].name}
                    avatar={chat.participants[0].image}
                  />
                  <ThemedText type="title">
                    {chat.participants[0].name}
                  </ThemedText>
                </>
              ) : (
                <ThemedText type="title">No participants</ThemedText>
              )}
            </>
          )}
        </ThemedView>
        <ThemedLink href="/chats">
          <AntDesign name="infocirlceo" size={20} />
        </ThemedLink>
      </ThemedView>

      <ThemedView style={styles.content}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageCard {...item} />}
          inverted
          onEndReached={() => setPage((prev) => prev + 1)}
          onEndReachedThreshold={0.2}
          contentContainerStyle={{ gap: 8 }}
        />
      </ThemedView>

      <ChatInputForm onSubmit={sendMessage} />
    </ThemedView>
  )
}

function useStyles() {
  const { theme } = useTheme()

  return StyleSheet.create({
    content: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 18,
      flex: 1
    },
    header: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    }
  })
}

export default ChatScreen
