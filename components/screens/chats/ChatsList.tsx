import { ChatActions } from "@/components/screens/chats/ChatActions"
import { ChatCard } from "@/components/screens/chats/ChatCard"
import { ThemedActivityIndicator } from "@/components/ui/ThemedActivityIndicator"
import { ThemedView } from "@/components/ui/ThemedView"
import { useWebSocket } from "@/lib/services/WebSocketProvider"
import { backend } from "@/lib/services/backend"
import { useBackend } from "@/lib/services/backend/use"
import type { ChatListResponse } from "@slash/backend/src/api/chats/chats.api"
import { useRouter } from "expo-router"
import { type ReactNode, useEffect, useState } from "react"
import { FlatList, StyleSheet } from "react-native"

type ChatsListProps = {
  pageSize?: number
  query?: Record<string, any>
  fallbackChildren?: ReactNode
}

export function ChatsList({
  pageSize = 10,
  query,
  fallbackChildren
}: ChatsListProps) {
  const router = useRouter()

  const { chats, setChats } = useWebSocket()
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const {
    data: backendChats = [],
    loading,
    error
  } = useBackend<ChatListResponse[]>(
    () =>
      backend.chats.get({
        query: {
          ...query,
          page,
          pageSize
        }
      }),
    [query, page],
    {
      transform: (data) => {
        setHasMore(data?.length === pageSize)
        return data?.data || []
      },
      haveTo: hasMore
    }
  )

  useEffect(() => {
    if (backendChats && backendChats.length > 0) {
      setChats((prevChats) => {
        const chatMap = new Map(prevChats.map((chat) => [chat.id, chat]))

        for (const chat of backendChats) {
          chatMap.set(chat.id, chat)
        }

        return Array.from(chatMap.values()).sort((a, b) => {
          const aDate = a.lastMessage?.createdAt
            ? new Date(a.lastMessage.createdAt).getTime()
            : 0
          const bDate = b.lastMessage?.createdAt
            ? new Date(b.lastMessage.createdAt).getTime()
            : 0
          return bDate - aDate
        })
      })
    }

    return () => setChats([])
  }, [backendChats, setChats])

  function removeChatFromLocal(chatId: string) {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId))
  }

  function openChat(userId: string) {
    // @ts-ignore
    router.push(`/chats/${userId}`)
  }

  return (
    <ThemedView style={styles.container}>
      {!loading ? (
        chats?.length && chats.length > 0 ? (
          <FlatList
            data={chats}
            keyExtractor={(chat) => chat.id}
            renderItem={({ item: chatResponse }) => (
              <ChatCard
                type={chatResponse.type}
                username={chatResponse.name}
                lastMessage={chatResponse.lastMessage}
                onPress={() => openChat(chatResponse.id)}
                actionsChildren={
                  <ChatActions
                    chatId={chatResponse.id}
                    pinned={!!query?.pinned}
                    onDelete={() => removeChatFromLocal(chatResponse.id)}
                    onPin={() => router.push("/")}
                  />
                }
              />
            )}
            onEndReached={() => setPage((prev) => prev + 1)}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{ gap: 8 }}
          />
        ) : (
          fallbackChildren
        )
      ) : (
        <ThemedActivityIndicator size="small" />
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchBarContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10
  }
})
