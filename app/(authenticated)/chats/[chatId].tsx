import { ChatInputForm } from "@/components/screens/chat/ChatInputForm"
import { MessageCard } from "@/components/screens/chat/MessageCard"
import { Avatar } from "@/components/screens/common/Avatar"
import { ThemedLink } from "@/components/ui/ThemedLink"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { backend } from "@/lib/services/backend"
import { AntDesign } from "@expo/vector-icons"
import { useLocalSearchParams } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import { FlatList, StyleSheet } from "react-native"

const ChatScreen = () => {
  const { chatId } = useLocalSearchParams()
  const [chat, setChat] = useState<{
    name: string
    image: string | null
    type: string
    participants: { userId: string; name: string; image: string | null }[]
  }>({
    name: "",
    image: null,
    type: "",
    participants: []
  })
  const [messages, setMessages] = useState<
    {
      id: string
      content: string | null
      type: "IMAGE" | "TEXT" | "LOCATION"
      senderId: string
      createdAt: Date
    }[]
  >([])

  const [hasMore, setHasMore] = useState(true)
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
        setHasMore(response.data.pagination.totalPages > page)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const fetchChat = async () => {
    if (!chatId) return
    try {
      const response = await backend.chats[chatId].get()
      if (response.data) {
        setChat(response.data.chat)
      }
    } catch (error) {
      console.error("Error fetching chat:", error)
    }
  }
  useEffect(() => {
    fetchChat()
    fetchMessages(1)
  }, [])

  const sendMessage = async ({
    type,
    data
  }: { type: string; data: string }) => {
    if (["TEXT", "LOCATION"].includes(type)) {
      const response = await backend.messages[chatId].post({
        content: data,
        type
      })
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
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageCard
              message={item.content}
              time={item.createdAt}
              isMe={Boolean(item.isMe)}
              name={item.name}
              image={item.image}
            />
          )}
          inverted
          onEndReached={() => {
            if (hasMore) fetchMessages(page + 1)
          }}
          onEndReachedThreshold={0.2}
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
