import { ChatCard, type LastMessage } from "@/components/screens/chats/ChatCard"
import { Avatar } from "@/components/screens/common/Avatar"
import { ThemedButton } from "@/components/ui/ThemedButton"
import { ThemedInput } from "@/components/ui/ThemedInput"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { backend } from "@/lib/services/backend"
import { useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  type TouchableOpacityProps,
  TouchableWithoutFeedback
} from "react-native"

export function FindUserModalButton(props: TouchableOpacityProps) {
  const [modalVisible, setModalVisible] = useState(false)

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity {...props} onPress={toggleModal} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <ThemedView style={styles.overlay}>
            <TouchableWithoutFeedback>
              <ThemedView style={styles.modalContainer}>
                <FindUserForm closeModal={() => setModalVisible(false)} />
              </ThemedView>
            </TouchableWithoutFeedback>
          </ThemedView>
        </TouchableWithoutFeedback>
      </Modal>
    </ThemedView>
  )
}

type User = {
  id: string
  name: string
  email: string
  image: string | null
  lastMessage: LastMessage
}

type FindUserFormProps = {
  closeModal: () => void
}

function FindUserForm({ closeModal }: FindUserFormProps) {
  const router = useRouter()
  const minQueryLength = 2
  const [queryText, setQueryText] = useState("")
  const [chatName, setChatName] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])

  useEffect(() => {
    if (queryText.length < minQueryLength) {
      setUsers([])
      return
    }

    const timeout = setTimeout(() => {
      backend.users.search
        .get({ query: { q: queryText, page: 1, pageSize: 5 } })
        .then((response: any) => setUsers(response?.data || []))
    }, 300)

    return () => clearTimeout(timeout)
  }, [queryText])

  async function createChat() {
    if (selectedUsers.length === 0) return

    const userIds = selectedUsers.map((user) => user.id)
    const response = await backend.chats.post({ userIds, name: chatName })
    if (response?.data?.chatId) {
      closeModal()
      router.push(`/chats/${response.data.chatId}`)
    }
  }

  return (
    <ThemedView style={styles.form}>
      {selectedUsers.length > 0 && (
        <ThemedView style={styles.selectedUsers}>
          {selectedUsers.length > 1 ? (
            <ThemedInput
              placeholder="Chat name"
              onChangeText={setChatName}
              value={chatName}
            />
          ) : (
            <ThemedText>Add 1 more person to create group chat</ThemedText>
          )}
          {selectedUsers.map((user) => (
            <ThemedView key={user.id} style={styles.userItem}>
              <Avatar avatar={user.image} username={user.name} />
              <ThemedText>{user.name}</ThemedText>
            </ThemedView>
          ))}
          <ThemedButton title="Create Chat" onPress={createChat} />
        </ThemedView>
      )}

      <ThemedInput
        style={styles.input}
        placeholder="Search..."
        value={queryText}
        onChangeText={setQueryText}
      />

      {queryText.length >= minQueryLength && (
        <ThemedView style={styles.userList}>
          {users.length > 0 ? (
            users.map((user) => (
              <ChatCard
                key={user.id}
                avatar={user.image}
                username={user.name}
                lastMessage={user.lastMessage}
                onPress={() =>
                  setSelectedUsers((prev) =>
                    prev.find((u) => u.id === user.id)
                      ? prev.filter((u) => u.id !== user.id)
                      : [...prev, user]
                  )
                }
              />
            ))
          ) : (
            <ThemedText>No users found</ThemedText>
          )}
        </ThemedView>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingBottom: 80
  },
  modalContainer: {
    width: 300,
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "rgba(40,40,40,0.7)"
  },
  form: {
    width: "100%",
    display: "flex",
    gap: 12,
    flexDirection: "column"
  },
  input: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "hsla(0,0%,7%,.25)",
    borderRadius: 24,
    fontSize: 14,
    height: 36,
    color: "hsla(0,0%,97%,.7)"
  },
  userList: {
    display: "flex",
    flexDirection: "column-reverse",
    gap: 6
  },
  selectedUsers: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "hsla(0,0%,97%,.1)",
    padding: 12,
    borderRadius: 20,
    gap: 8
  }
})
