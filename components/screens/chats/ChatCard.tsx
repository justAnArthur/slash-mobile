import { Avatar } from "@/components/screens/common/Avatar"
import { ThemedText } from "@/components/ui/ThemedText"
import { useTheme } from "@/lib/a11y/ThemeContext"
import type React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"

export interface LastMessage {
  content: string | null
  type: "TEXT" | "IMAGE" | "LOCATION"
  createdAt: Date
  isMe: boolean
}
interface ChatCardProps {
  avatar: string | null
  username: string
  lastMessage: LastMessage | null
  onPress: () => void
}

export const ChatCard: React.FC<ChatCardProps> = ({
  avatar,
  username,
  lastMessage,
  onPress
}) => {
  const styles = useStyles()

  let truncatedLastMessage = lastMessage && getTruncatedLastMessage(lastMessage)
  if (lastMessage?.isMe) truncatedLastMessage = `Me: ${truncatedLastMessage}`

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Avatar username={username} avatar={avatar} />
      <View style={styles.infoContainer}>
        <ThemedText style={styles.username}>{username}</ThemedText>
        <ThemedText style={styles.lastMessage}>
          {truncatedLastMessage}
        </ThemedText>
      </View>
    </TouchableOpacity>
  )
}

function useStyles() {
  const { theme } = useTheme()

  return StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      gap: 12,
      borderRadius: 20
    },
    avatarContainer: {
      marginRight: 15
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20
    },
    avatarPlaceholder: {
      backgroundColor: theme.muted,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center"
    },
    infoContainer: {
      flex: 1
    },
    username: {
      fontWeight: "bold",
      fontSize: 16
    },
    lastMessage: {
      fontSize: 14
    }
  })
}

function getTruncatedLastMessage(lastMessage: LastMessage | null): string {
  if (!lastMessage) return "No messages yet"

  if (lastMessage.type !== "TEXT") {
    return `${lastMessage.type.charAt(0)}${lastMessage.type.slice(1).toLowerCase()}`
  }

  if (lastMessage.content) {
    if (lastMessage.content.length > 60) {
      return `${lastMessage.content.slice(0, 60)}...`
    }

    return lastMessage.content
  }

  return "No messages yet"
}
