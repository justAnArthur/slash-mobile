import { SearchBar } from "@/components/SearchBar"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { ThemedButton } from "@/components/ui/ThemedButton"
import { ThemedModal } from "@/components/ui/ThemedModal"
import { backend } from "@/lib/services/backend"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from "react-native"

const PAGE_SIZE = 10

interface User {
  id: string
  name: string
  image: string | null // Image can be a string or null
}

export default function Chats() {
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [chats, setChats] = useState<User[]>([]) // State to store chat users
  const [searchVisible, setSearchVisible] = useState(false) // Manage search popup visibility
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

  const fetchChats = async () => {}

  useEffect(() => {
    if (query) {
      fetchUsers(query, 1)
      setSearchVisible(true)
    } else {
      fetchChats()
      setSearchVisible(false)
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
    <ThemedView>
      <ThemedView style={styles.searchBarContainer}>
        <SearchBar onSearch={setQuery} />
      </ThemedView>

      {/* Search Popup Modal */}
      <ThemedModal
        visible={searchVisible}
        transparent={true}
        animationType="slide"
      >
        <ThemedView style={styles.modalContainer}>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openChat(item.id)}>
                <ThemedText style={styles.user}>{item.name}</ThemedText>
              </TouchableOpacity>
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : null
            }
          />
          <ThemedButton onPress={() => setSearchVisible(false)} title="Close" />
        </ThemedView>
      </ThemedModal>

      {/* Show chats when not searching */}
      {!searchVisible && (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openChat(item.id)}>
              <ThemedText style={styles.user}>{item.name}</ThemedText>
            </TouchableOpacity>
          )}
        />
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, padding: 10, marginTop: 50 },
  user: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd"
  },
  searchBarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Ensure it's above other components
    backgroundColor: "white" // Background color to cover anything behind
  }
})
