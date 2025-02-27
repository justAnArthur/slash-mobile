import { backend } from "@/lib/services/backend"
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useState, useEffect, useRef } from "react"
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"

const PAGE_SIZE = 20

const ChatScreen = () => {
  const router = useRouter()
  const { userId } = useLocalSearchParams() // Get userId from route
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    fetchMessages(1) // Load initial messages
  }, [])

  const fetchMessages = async (newPage: number) => {
    if (loading) return

    setLoading(true)
    try {
      const response = await backend["chat/messages"].get({
        query: { userId, page: newPage }
      })

      if (newPage === 1) {
        setMessages(response.data) // Reset messages
      } else {
        setMessages((prev) => [...response, ...prev.data]) // Prepend old messages
      }

      setHasMore(response.data.length === PAGE_SIZE)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
    setLoading(false)
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const response = await backend["chat/send"].post({
        body: { userId, text: newMessage }
      })

      setMessages((prev) => [...prev, response.data]) // Append new message
      setNewMessage("")

      flatListRef.current?.scrollToEnd({ animated: true }) // Auto-scroll
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const loadOlderMessages = () => {
    if (hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchMessages(nextPage)
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.isMine && styles.myMessage]}>
            <Text>{item.text}</Text>
          </View>
        )}
        onEndReached={loadOlderMessages}
        onEndReachedThreshold={0.5}
        inverted // New messages at the bottom
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" color="#0000ff" /> : null
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  backButton: { padding: 10 },
  backText: { fontSize: 16, color: "blue" },
  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#ddd",
    alignSelf: "flex-start"
  },
  myMessage: {
    backgroundColor: "#007bff",
    alignSelf: "flex-end",
    color: "#fff"
  },
  inputContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    padding: 10,
    alignItems: "center"
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 8
  },
  sendText: { color: "#fff" }
})

export default ChatScreen
