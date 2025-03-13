import { ThemedText } from "@/components/ui/ThemedText"
import { useTheme } from "@/lib/a11y/ThemeContext"
import type React from "react"
import { StyleSheet, View } from "react-native"
import { Avatar } from "../common/Avatar"

interface MessageCardProps {
  message: string
  time: string
  isMe: boolean
  name: string
  image: string
}

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  time,
  isMe,
  name,
  image
}) => {
  const styles = useStyles()

  const formatDate = (date: string) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })

  return (
    <View
      style={[styles.container, isMe ? styles.myMessage : styles.otherMessage]}
    >
      {isMe && <Avatar avatar={image} username={name} />}
      <View style={styles.messageContent}>
        <View style={styles.header}>
          <ThemedText type="subtitle">{isMe ? "Me" : name}</ThemedText>
          <ThemedText type="extraSmall">{formatDate(time)}</ThemedText>
        </View>
        <ThemedText type="small">{message}</ThemedText>
      </View>
      {!isMe && <Avatar avatar={image} username={name} />}
    </View>
  )
}

function useStyles() {
  const { theme } = useTheme()

  return StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      flexDirection: "row",
      gap: 12,
      alignItems: "flex-start",
      padding: 10,
      borderRadius: 12,
      width: "100%",
      paddingHorizontal: 16
    },
    myMessage: {
      alignSelf: "flex-end",
      flexDirection: "row-reverse"
    },
    otherMessage: {
      alignSelf: "flex-start"
    },
    messageContent: {
      flex: 1
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4
    }
  })
}
