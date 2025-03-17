import { ChatCard } from "@/components/screens/chats/ChatCard"
import { ThemedActivityIndicator } from "@/components/ui/ThemedActivityIndicator"
import { ThemedView } from "@/components/ui/ThemedView"
import { backend } from "@/lib/services/backend"
import { useBackend } from "@/lib/services/backend/use"
import type { ChatResponse } from "@slash/backend/src/api/chats/chats.api"
import { useRouter } from "expo-router"
import { type ReactNode, useState } from "react"
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

  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const {
    data: chats = [],
    loading,
    error
  } = useBackend<ChatResponse[]>(
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
        setHasMore(data?.length === pageSize)
        return (prev || []).concat(data?.data)
      },
      haveTo: hasMore
    }
  )

  function openChat(userId: string) {
    // @ts-ignore
    router.push(`/chats/${userId}`)
  }

  console.log("chats", chats)

  return (
    <ThemedView style={styles.container}>
      {!loading ? (
        chats?.length && chats.length > 0 ? (
          <FlatList
            data={chats}
            keyExtractor={(chat: any) => chat.id}
            renderItem={({ item }) => (
              <ChatCard
                avatar={item.image}
                username={item.name}
                // @ts-ignore todo item.lastMessage
                lastMessage={item.lastMessage}
                onPress={() => openChat(item.id)}
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
