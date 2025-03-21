import { ChatCard } from "@/components/screens/chats/ChatCard"
import { ThemedActivityIndicator } from "@/components/ui/ThemedActivityIndicator"
import { ThemedView } from "@/components/ui/ThemedView"
import { backend } from "@/lib/services/backend"
import { useBackend } from "@/lib/services/backend/use"
import { useWebSocket } from "@/lib/services/WebSocketProvider"
import type { ChatListResponse } from "@slash/backend/src/api/chats/chats.api"
import { useRouter } from "expo-router"
import { type ReactNode, useEffect, useState } from "react"
import { Alert, FlatList, StyleSheet } from "react-native"
import ConfirmationModal from "../common/ConfirmationModal"

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
  const [isModalVisible, setModalVisible] = useState(false)
  const [chatToDelete, setChatToDelete] = useState<string | null>(null)
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
      transform: (data, { prev }) => {
        console.log("setHasMore", data?.length, pageSize)
        setHasMore(data?.length === pageSize)
        return (prev || []).concat(data?.data)
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
  }, [backendChats, setChats])
  function openChat(userId: string) {
    // @ts-ignore
    router.push(`/chats/${userId}`)
  }
  const deleteChat = (chatId: string) => {
    setChatToDelete(chatId)
    setModalVisible(true)
  }

  const confirmDelete = async () => {
    if (chatToDelete) {
      await backend.chats[`${chatToDelete}`].delete()
      setChats((prev) => prev.filter((chat) => chat.id !== chatToDelete))
      setModalVisible(false)
      setChatToDelete(null)
    }
  }

  const cancelDelete = () => {
    setModalVisible(false)
    setChatToDelete(null)
  }
  return (
    <ThemedView style={styles.container}>
      <ConfirmationModal
        visible={isModalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      {!loading ? (
        chats?.length && chats.length > 0 ? (
          <FlatList
            data={chats}
            keyExtractor={(chat: ChatListResponse) => chat.id}
            renderItem={({ item }) => (
              <ChatCard
                type={item.type as "group" | "private"}
                username={item.name}
                lastMessage={item.lastMessage}
                onPress={() => openChat(item.id)}
                onDelete={() => deleteChat(item.id)}
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
