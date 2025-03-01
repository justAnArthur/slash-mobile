import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Avatar } from "@/components/screens/common/Avatar"
import type React from "react"
import { Image, StyleSheet, TouchableOpacity } from "react-native"

export interface LastMessage {
  content: string | null
  type: "TEXT" | "IMAGE" | "LOCATION"
  createdAt: Date
  isMe: boolean
}
interface ChatCardProps {
  avatar: string | null // Avatar can be a string (URL) or null
  username: string
  lastMessage: LastMessage | null
  onPress: () => void // Function to handle press action
}

export const ChatCard: React.FC<ChatCardProps> = ({
  avatar,
  username,
  lastMessage,
  onPress
}) => {
  let truncatedLastMessage: string

  if (!lastMessage) {
    truncatedLastMessage = "No messages yet"
  } else if (lastMessage.type !== "TEXT") {
    truncatedLastMessage = `${lastMessage.type.charAt(0)}${lastMessage.type.slice(1).toLowerCase()}`
  } else if (lastMessage.content) {
    if (lastMessage.content.length > 60) {
      truncatedLastMessage = `${lastMessage.content.slice(0, 60)}...`
    } else {
      truncatedLastMessage = lastMessage.content
    }
  } else {
    truncatedLastMessage = "No messages yet"
  }

  if (lastMessage?.isMe) {
    truncatedLastMessage = `Me: ${truncatedLastMessage}`
  }
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Avatar username={username} avatar={avatar} />
      <ThemedView style={styles.infoContainer}>
        <ThemedText style={styles.username}>{username}</ThemedText>
        <ThemedText style={styles.lastMessage}>
          {truncatedLastMessage}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center"
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc", // Placeholder background color
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
