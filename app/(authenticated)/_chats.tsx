import { ChatCard } from "@/components/screens/chats/ChatCard"
import { SearchBar } from "@/components/screens/chats/SearchBar"
import { ThemedActivityIndicator } from "@/components/ui/ThemedActivityIndicator"
// _chats.tsx
import { ThemedView } from "@/components/ui/ThemedView"
import { backend } from "@/lib/services/backend"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { FlatList, StyleSheet, View } from "react-native"

const PAGE_SIZE = 10

interface LastMessage {
  content: string | null
  isImage: boolean
  createdAt: Date
  isMe: boolean
}

interface User {
  id: string
  name: string
  image: string | null
  lastMessage: LastMessage | null
}

export default function _chats() {
  const [query, setQuery] = useState("")
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const router = useRouter()

  const fetchUsers = async (newQuery: string, newPage: number) => {
    if (loading) return

    setLoading(true)
    try {
      const response = await backend.users.search.get({
        query: { q: newQuery, page: newPage, pageSize: PAGE_SIZE }
      })

      if (newPage === 1) {
        setData(response.data) // Reset data if new search
      } else {
        setData((prevData) => [...prevData, ...response.data]) // Append new data
      }

      setHasMore(response.data.length === PAGE_SIZE) // Stop if less than PAGE_SIZE
    } catch (error) {
      console.error("Error fetching users:", error)
    }
    setLoading(false)
  }

  const fetchChats = async (newPage: number) => {
    if (loading) return

    setLoading(true)
    try {
      // Replace with your logic to fetch chats
      const response = await backend.chats.get({
        query: { page: newPage, pageSize: PAGE_SIZE }
      })

      setData((prevData) => [...prevData, ...response.data]) // Append new data
      setHasMore(response.data.length === PAGE_SIZE) // Stop if less than PAGE_SIZE
    } catch (error) {
      console.error("Error fetching chats:", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (query) {
      fetchUsers(query, 1)
      setPage(1) // Reset page when searching
    } else {
      fetchChats(1)
      setPage(1) // Reset page when not searching
    }
  }, [query])

  const loadMore = () => {
    if (hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      if (query) {
        fetchUsers(query, nextPage)
      } else {
        fetchChats(nextPage)
      }
    }
  }

  const openChat = (userId: string) => {
    router.push(`/chat/${userId}`)
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <SearchBar onSearch={setQuery} />
      </View>

      {loading ? (
        <ThemedActivityIndicator size="small" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatCard
              avatar={item.image}
              username={item.name}
              lastMessage={item.lastMessage}
              onPress={() => openChat(item.id)}
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
        />
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
