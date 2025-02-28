import { backend } from "@/lib/services/backend"
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useState, useEffect, useRef } from "react"
import {
  ActivityIndicator,
  type FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"

const PAGE_SIZE = 20

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
        body: { user1Id: user.id }
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/*
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
          loading ? <ThemedActivityIndicator size="small" /> : null
        }
      />

    */}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          //value={newMessage}
          //onChangeText={setNewMessage}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => {} /*sendMessage*/}
        >
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
