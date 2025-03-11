import { ChatCard } from "@/components/screens/chats/ChatCard"
import { ThemedView } from "@/components/ui/ThemedView"
import { backend } from "@/lib/services/backend"
import { useRouter } from "expo-router"
import React, { useEffect, useState } from "react"
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  type TouchableOpacityProps,
  TouchableWithoutFeedback,
  View
} from "react-native"

export function FindUserModalButton(props: TouchableOpacityProps) {
  const [modalVisible, setModalVisible] = useState(false)

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity {...props} onPress={toggleModal} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <ThemedView style={styles.modalContainer}>
                <FindUserForm />
              </ThemedView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

function FindUserForm() {
  const router = useRouter()

  const minQueryLength = 3
  const [queryText, setQueryText] = useState("")
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (queryText.length < minQueryLength) {
      setUsers([])
      return
    }

    const timeout = setTimeout(() => {
      backend.users.search
        .get({
          query: { q: queryText, page: 1, pageSize: 5 }
        })
        .then((response: any) => setUsers(response?.data || []))
    }, 300)

    return () => clearTimeout(timeout)
  }, [queryText])

  function openChat(userId: string) {
    // @ts-ignore
    router.push(`/chats/${userId}`)
  }

  return (
    <View style={styles.form}>
      {queryText.length > minQueryLength &&
        (users.length > 0 ? (
          <View style={styles.userList}>
            {users.map((user: any) => (
              <ChatCard
                key={user.id}
                avatar={user.image}
                username={user.name}
                lastMessage={user.lastMessage}
                onPress={() => openChat(user.id)}
              />
            ))}
          </View>
        ) : (
          <Text>No users found</Text>
        ))}

      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={queryText}
        onChangeText={setQueryText}
      />
    </View>
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

    boxShadow:
      "inset 2px 4px 16px 0 hsla(0,0%,97%,.06),0 24px 24px -16px rgba(5,5,5,.09),0 6px 13px 0 rgba(5,5,5,.1),0 6px 4px -4px rgba(5,5,5,.1),0 5px 1.5px -4px rgba(5,5,5,.25)",
    backgroundColor: "rgba(40,40,40,0.7)",
    shadowColor: "rgba(5,5,5,0.1)"
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
    display: "flex",
    fontSize: 14,
    height: 36,
    lineHeight: 1.5,
    color: "hsla(0,0%,97%,.7)"
  },
  userList: {
    display: "flex",
    flexDirection: "column-reverse",
    gap: 6
  },
  userItem: {
    backgroundColor: "hsla(0,0%,97%,.1)",
    padding: 12,
    borderRadius: 20
  }
})
