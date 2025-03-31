import {Avatar} from "@/components/screens/common/Avatar"
import {ThemedText} from "@/components/ui/ThemedText"
import {useTheme} from "@/lib/a11y/ThemeContext"
import {authClient} from "@/lib/auth"
import type {MessageResponse} from "@slash/backend/src/api/messages/messages.api"
import type React, {ReactNode} from "react"
import {StyleSheet, TouchableOpacity, View} from "react-native"

interface ChatCardProps {
  type: "group" | "private"
  username: string
  avatar?: any
  lastMessage?: MessageResponse | null
  onPress: () => void
  actionsChildren?: ReactNode
}

export const ChatCard: React.FC<ChatCardProps> = ({
  type,
  username,
  lastMessage,
  onPress,
  actionsChildren,
  avatar
}) => {
  const styles = useStyles()

  const { data: session } = authClient.useSession()
  const isMe = lastMessage && session?.user.id === lastMessage.senderId

  let truncatedLastMessage = lastMessage && getTruncatedLastMessage(lastMessage)

  if (type === "group" && !isMe) {
    truncatedLastMessage = `${lastMessage?.name || "Info"}: ${truncatedLastMessage}`
  } else if (isMe) {
    truncatedLastMessage = `Me: ${truncatedLastMessage}`
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Avatar username={username} avatar={avatar || lastMessage?.image} />

      <View style={styles.infoContainer}>
        <ThemedText style={styles.username}>{username}</ThemedText>
        <ThemedText style={styles.lastMessage}>
          {truncatedLastMessage}
        </ThemedText>
      </View>

      {actionsChildren}
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

function getTruncatedLastMessage(lastMessage: MessageResponse | null): string {
  if (!lastMessage || !lastMessage.content) return "No messages yet"

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
