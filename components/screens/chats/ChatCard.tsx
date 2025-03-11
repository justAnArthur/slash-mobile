import { Avatar } from "@/components/screens/common/Avatar"
import { ThemedText } from "@/components/ui/ThemedText"
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "hsla(0,0%,97%,.1)",
    padding: 12,
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
