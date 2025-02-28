import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import type React from "react"
import { StyleSheet } from "react-native"
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
  const formatDate = (date: string) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })

  return (
    <ThemedView
      style={[styles.container, isMe ? styles.myMessage : styles.otherMessage]}
    >
      {isMe && <Avatar avatar={image} username={name} />}
      <ThemedView style={styles.messageContent}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">{isMe ? "Me" : name}</ThemedText>
          <ThemedText type="extraSmall">{formatDate(time)}</ThemedText>
        </ThemedView>
        <ThemedText type="small">{message}</ThemedText>
      </ThemedView>
      {!isMe && <Avatar avatar={image} username={name} />}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    marginVertical: 4,
    borderRadius: 12,
    width: "100%"
  },
  myMessage: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse"
  },
  otherMessage: {
    alignSelf: "flex-start"
  },
  messageContent: {
    flex: 1,
    maxWidth: "80%",
    padding: 8
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4
  }
})
