import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { ChatInputForm } from "@/components/screens/chats/ChatInputForm"
import { Avatar } from "@/components/screens/common/Avatar"
import { ThemedLink } from "@/components/ui/ThemedLink"
import { backend } from "@/lib/services/backend"
import { AntDesign } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useState, useEffect, useRef } from "react"
import { type FlatList, StyleSheet } from "react-native"

const ChatScreen = () => {
  const router = useRouter()
  const { userId } = useLocalSearchParams()
  const [user, setUser] = useState<{
    name: string
    id: string
    image: null | string
  }>({ name: "", id: userId as string, image: null })
  const [chatId, setChatId] = useState("")
  const flatListRef = useRef<FlatList>(null)

  const fetchMessages = (page: number) => {
    //logic here
  }
  const startChat = async (userId: string) => {
    try {
      const userResponse = await backend.users[user.id].get()
      setUser(userResponse.data)
      const response = await backend.chats.start.post({
        user1Id: user.id
      })
      setChatId(response.data.chatId)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
    // fetch messages when got chatId;
    fetchMessages(1)
  }
  useEffect(() => {
    startChat(userId as string)
  }, [])
  useEffect(
    () => {
      fetchMessages(/*page*/ 0)
    },
    [
      /*page, ...*/
    ]
  )
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

      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ThemedText type="default">"content"</ThemedText>
      </ThemedView>

      <ChatInputForm onSubmit={console.log} />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    height: "100%"
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
