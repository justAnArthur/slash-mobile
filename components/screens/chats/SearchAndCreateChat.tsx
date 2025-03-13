import { ChatCard, type LastMessage } from "@/components/screens/chats/ChatCard"
import { Avatar } from "@/components/screens/common/Avatar"
import { ThemedButton, useButtonStyles } from "@/components/ui/ThemedButton"
import { ThemedInput, useInputStyles } from "@/components/ui/ThemedInput"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { backend } from "@/lib/services/backend"
import Octicons from "@expo/vector-icons/Octicons"
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
  const styles = useStyles()

  const [modalVisible, setModalVisible] = useState(false)

  return (
    <View style={styles.container}>
      <TouchableOpacity
        {...props}
        onPress={() => setModalVisible(!modalVisible)}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
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
    </View>
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
  const [isHandle, setIsHandle] = useState(false)

  const styles = useStyles()

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

  function handleSelectUser(user: User) {
    setSelectedUsers((prev) => {
      const _users = prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]

      setChatName(_users.map((u) => u.name).join(", "))

      return _users
    })
  }

  const inputStyles = useInputStyles()
  const buttonStyles = useButtonStyles()

  if (isHandle)
    return (
      <View style={styles.form}>
        {selectedUsers.length > 0 && (
          <View style={styles.userList}>
            {selectedUsers.map((user) => (
              <ThemedView key={user.id} style={styles.userItem}>
                <Avatar avatar={user.image} username={user.name} />
                <ThemedText>{user.name}</ThemedText>
              </ThemedView>
            ))}
          </View>
        )}

        {selectedUsers.length > 1 && (
          <ThemedInput
            placeholder="Chat name"
            onChangeText={setChatName}
            value={chatName}
            style={{ backgroundColor: styles.inputContainer.backgroundColor }}
          />
        )}

        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={[buttonStyles.button, styles.handleButton]}
            onPress={() => setIsHandle(false)}
          >
            <Octicons
              name="arrow-left"
              size={24}
              color={buttonStyles.button.color}
            />
          </TouchableOpacity>
          <ThemedButton
            title="Create Chat"
            style={{ flex: 1 }}
            onPress={createChat}
          />
        </View>
      </View>
    )

  return (
    <View style={styles.form}>
      <View style={styles.handleContainer}>
        <View style={[inputStyles.input, styles.inputContainer]}>
          {selectedUsers.map((user) => (
            <View key={user.id} style={styles.inputItem}>
              <Text style={{ color: styles.inputItem.color }}>{user.name}</Text>
            </View>
          ))}

          <TextInput
            style={styles.input}
            placeholder="Search..."
            value={queryText}
            onChangeText={setQueryText}
          />
        </View>

        {selectedUsers.length > 0 && (
          <TouchableOpacity
            style={[buttonStyles.button, styles.handleButton]}
            onPress={() => setIsHandle(true)}
          >
            <Octicons
              name="arrow-right"
              size={24}
              color={buttonStyles.button.color}
            />
          </TouchableOpacity>
        )}
      </View>

      {queryText.length >= minQueryLength && (
        <ThemedView style={styles.userList}>
          {users.length > 0 ? (
            users.map((user) => (
              <ChatCard
                key={user.id}
                avatar={user.image}
                username={user.name}
                lastMessage={user.lastMessage}
                onPress={() => handleSelectUser(user)}
              />
            ))
          ) : (
            <ThemedText>No users found</ThemedText>
          )}
        </ThemedView>
      )}
    </View>
  )
}

function useStyles() {
  const { theme, isDarkMode } = useTheme()

  return StyleSheet.create({
    container: {
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
      backgroundColor: theme.popover,
      boxShadow: isDarkMode
        ? "inset 2px 4px 16px 0 hsla(0,0%,97%,.06)"
        : "0 24px 24px -16px rgba(5,5,5,.09),0 6px 13px 0 rgba(5,5,5,.1),0 6px 4px -4px rgba(5,5,5,.1),0 5px 1.5px -4px rgba(5,5,5,.25)",
      width: 300,
      padding: 20,
      borderRadius: 8,
      alignItems: "center"
    },
    form: {
      width: "100%",
      display: "flex",
      gap: 12,
      flexDirection: "column"
    },
    handleContainer: {
      display: "flex",
      flexDirection: "row",
      gap: 8
    },
    handleButton: {
      width: 48,
      height: 48
    },
    inputContainer: {
      backgroundColor: isDarkMode ? "#1e1e1e" : "#f9f9f9",
      color: isDarkMode ? "#f9f9f9" : "#1e1e1e",

      display: "flex",
      flexDirection: "row",
      gap: 4,
      flexWrap: "wrap",
      flex: 1,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 24,
      fontSize: 14
    },
    input: {
      color: isDarkMode ? "#f9f9f9" : "#1e1e1e",
      alignSelf: "flex-start",
      width: "100%",
      height: 32,
      paddingHorizontal: 4,
      paddingVertical: 2
    },
    inputItem: {
      width: "auto",
      backgroundColor: theme.primarySecondary,
      color: theme.primaryForeground,
      borderRadius: 24,
      paddingHorizontal: 6,
      paddingVertical: 4
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
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      padding: 12,
      borderRadius: 20,
      gap: 4
    }
  })
}
