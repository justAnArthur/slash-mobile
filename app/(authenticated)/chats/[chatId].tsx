import { ChatInputForm } from "@/components/screens/chat/ChatInputForm"
import { MessageCard } from "@/components/screens/chat/MessageCard"
import { Avatar } from "@/components/screens/common/Avatar"
import { ThemedLink } from "@/components/ui/ThemedLink"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { backend } from "@/lib/services/backend"
import { useBackend } from "@/lib/services/backend/use"
import { AntDesign } from "@expo/vector-icons"
import type { ChatResponse } from "@slash/backend/src/api/chats/chats.api"
import type {
  MessageResponse,
  PaginatedMessageResponse
} from "@slash/backend/src/api/messages/messages.api"
import { useLocalSearchParams } from "expo-router"
import React, { useState } from "react"
import { FlatList, StyleSheet } from "react-native"

const pageSize = 10

const ChatScreen = () => {
  const styles = useStyles()

  const { chatId } = useLocalSearchParams()

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
    data: messages = [],
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
      transform: (response: PaginatedMessageResponse, params) => {
        setHasMore(response.data?.pagination?.totalPages > page)
        return (params?.prev || []).concat(response.data?.messages || [])
      },
      haveTo: hasMore
    }
  )

  async function sendMessage({ type, data }: { type: string; data: string }) {
    if (["TEXT", "LOCATION"].includes(type)) {
      // @ts-ignore
      await backend.messages[chatId].post({
        content: data,
        type
      })
    }
  }

  if (chatLoading || messagesLoading) {
    return <ThemedText>Loading...</ThemedText>
  }

  console.log(chatError, messagesError, chat, messages)

  if (chatError || messagesError || !chat || !messages) {
    return <ThemedText>Error</ThemedText>
  }

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
          renderItem={({ item }) => (
            <MessageCard
              message={item.content || ""}
              time={item.createdAt}
              isMe={Boolean(item.isMe)}
              name={item.name}
              image={item.image}
            />
          )}
          inverted
          onEndReached={() => setPage((prev) => prev + 1)}
          onEndReachedThreshold={0.2}
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
