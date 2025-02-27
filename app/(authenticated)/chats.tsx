import { ChatCard } from "@/components/ChatCard"
import { SearchBar } from "@/components/SearchBar"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { ThemedActivityIndicator } from "@/components/ui/ThemedActivityIndicator"
import { ThemedButton } from "@/components/ui/ThemedButton"
import { backend } from "@/lib/services/backend"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { FlatList, StyleSheet, TouchableOpacity } from "react-native"

const PAGE_SIZE = 10

interface User {
  id: string
  name: string
  image: string | null // Image can be a string or null
  lastMessage: string | null
}

export default function Chats() {
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [chats, setChats] = useState<User[]>([]) // State to store chat users
  const [dropdownVisible, setDropdownVisible] = useState(false) // Manage dropdown visibility
  const router = useRouter()

  const fetchUsers = async (newQuery = query, newPage = 1) => {
    if (loading) return

    setLoading(true)
    try {
      const response = await backend.users.search.get({
        query: { q: newQuery, page: newPage }
      })

      if (newPage === 1) {
        setUsers(response.data) // Reset list if new search
      } else {
        setUsers((prevUsers) => [...prevUsers, ...response.data]) // Append new data
      }

      setHasMore(response.data.length === PAGE_SIZE) // Stop if less than PAGE_SIZE
    } catch (error) {
      console.error("Error fetching users:", error)
    }
    setLoading(false)
  }

  const fetchChats = async () => {
    // Implement chat fetching logic if necessary
  }

  useEffect(() => {
    if (query) {
      fetchUsers(query, 1)
      setDropdownVisible(true)
    } else {
      fetchChats()
      setDropdownVisible(false)
    }
    setPage(1)
  }, [query])

  const loadMore = () => {
    if (hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchUsers(query, nextPage)
    }
  }

  const openChat = (userId: string) => {
    router.push(`/chat/${userId}`)
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.searchBarContainer}>
        <SearchBar onSearch={setQuery} />
      </ThemedView>

      {/* Search Dropdown */}
      {dropdownVisible && (
        <ThemedView style={styles.dropdownContainer}>
          {!loading ? (
            <FlatList
              data={users}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <ChatCard
                  avatar={item.image}
                  username={item.name}
                  lastMessage={null}
                  onPress={() => openChat(item.id)}
                />
              )}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
            />
          ) : (
            <ThemedActivityIndicator size="small" />
          )}
          <ThemedButton
            onPress={() => setDropdownVisible(false)}
            title="Close"
          />
        </ThemedView>
      )}

      {/* Show chats when not searching */}
      {!dropdownVisible && (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ChatCard
              avatar={item.image}
              username={item.name}
              lastMessage={null}
              onPress={() => openChat(item.id)}
            />
          )}
        />
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  dropdownContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 10,
    paddingHorizontal: 10,
    gap: 10,
    maxHeight: 400,
    minHeight: 50
  },
  user: {
    padding: 10,
    fontSize: 16
  },
  searchBarContainer: {
    position: "relative",
    zIndex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10
  }
})
