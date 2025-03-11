import { ChatInputForm } from "@/components/screens/chat/ChatInputForm"
import { MessageCard } from "@/components/screens/chat/MessageCard"
import { Avatar } from "@/components/screens/common/Avatar"
import { ThemedLink } from "@/components/ui/ThemedLink"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { backend } from "@/lib/services/backend"
import { AntDesign } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useState, useEffect, useRef } from "react"
import { FlatList, StyleSheet } from "react-native"

const ChatScreen = () => {
  const { userId } = useLocalSearchParams()
  const [user, setUser] = useState<{
    name: string
    id: string
    image: null | string
  }>({ name: "", id: userId as string, image: null })
  const [chatId, setChatId] = useState("")
  const [hasMore, setHasMore] = useState(true)
  const [messages, setMessages] = useState<
    {
      id: string
      content: string | null
      type: "IMAGE" | "TEXT" | "LOCATION"
      senderId: string
      createdAt: Date
    }[]
  >([])

  const [page, setPage] = useState(1)
  const flatListRef = useRef<FlatList>(null)

  const fetchMessages = async (newPage: number) => {
    if (!chatId) return

    try {
      const response = await backend.messages[chatId].get({
        query: { page: newPage, pageSize: 10 }
      })
      if (response.data) {
        setMessages((prevMessages) => {
          return [...prevMessages, ...response.data.messages]
        })
        setPage(newPage)
        setHasMore(response.data.pagination.totalPages > page) // Check if more pages exist
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }
  const startChat = async () => {
    try {
      const userResponse = await backend.users[user.id].get()
      setUser(userResponse.data)

      const response = await backend.chats.start.post({ user1Id: user.id })
      setChatId(response.data.chatId)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }
  useEffect(() => {
    startChat()
  }, [])
  useEffect(() => {
    fetchMessages(1)
  }, [chatId])

  const sendMessage = async ({
    type,
    data
  }: { type: string; data: string }) => {
    if (["TEXT", "LOCATION"].includes(type)) {
      const response = await backend.messages.post({
        chatId,
        content: data,
        type
      })
      console.log(response)
    }
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
          <Avatar username={user.name} avatar={user.image} />
          <ThemedText type="title">{user.name}</ThemedText>
        </ThemedView>
        <ThemedLink href="/chats">
          <AntDesign name="infocirlceo" size={20} />
        </ThemedLink>
      </ThemedView>

      <ThemedView style={styles.content}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageCard
              message={item.content}
              time={item.createdAt}
              isMe={Boolean(item.isMe)}
              name={user.name}
              image=""
            />
          )}
          inverted // Makes the newest messages appear at the bottom
          onEndReached={() => {
            if (hasMore) fetchMessages(page + 1) // Load next page
          }}
          onEndReachedThreshold={0.2} // Load earlier messages when scrolled ~20% up
        />
      </ThemedView>

      <ChatInputForm onSubmit={sendMessage} />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  content: {
    width: "100%",
    paddingHorizontal: 24,
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

export default ChatScreen
