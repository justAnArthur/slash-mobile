import { bufferToUri } from "@/components/screens/chat/bufferToUri"
import { ThemedText } from "@/components/ui/ThemedText"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { backend } from "@/lib/services/backend"
import { useBackend } from "@/lib/services/backend/use"
import { AntDesign } from "@expo/vector-icons"
import type {
  MessageAttachmentResponse,
  MessageResponse
} from "@slash/backend/src/api/messages/messages.api"
import { Image } from "expo-image"
import React from "react"
import { StyleSheet, View } from "react-native"
import { Avatar } from "../common/Avatar"

export const MessageCard = ({
  content,
  createdAt: date,
  isMe,
  name,
  image,
  attachments
}: MessageResponse) => {
  const styles = useStyles()

  const formatDate = (date: string) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })

  return (
    <View
      style={[
        styles.container,
        !!isMe ? styles.myMessage : styles.otherMessage
      ]}
    >
      <View style={styles.messageContent}>
        <View style={styles.header}>
          <ThemedText type="subtitle">{!!isMe ? "Me" : name}</ThemedText>
          <ThemedText type="extraSmall">{formatDate(date)}</ThemedText>
        </View>

        {content && <ThemedText type="small">{content}</ThemedText>}

        {attachments.map((attachment) => (
          <MessageAttachment key={attachment.id} {...attachment} />
        ))}
      </View>

      <Avatar avatar={image} username={name} />
    </View>
  )
}

function MessageAttachment(attachment: MessageAttachmentResponse) {
  const styles = useStyles()

  if (attachment.JSON)
    return (
      <View key={attachment.id} style={styles.location}>
        <ThemedText type="small">{attachment.JSON}</ThemedText>
        <AntDesign name="pushpin" size={16} />
      </View>
    )

  if (attachment.IMAGEFileId) {
    const { data } = useBackend<ArrayBuffer>(
      // @ts-ignore
      () => backend.files[attachment.IMAGEFileId].get(),
      [attachment.IMAGEFileId],
      {
        transform: (data) => data?.data
      }
    )

    if (data) {
      const url = bufferToUri(data)

      return (
        <View key={attachment.id}>
          <Image source={{ uri: url }} style={styles.image} />
        </View>
      )
    }

    return null
  }
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
      alignSelf: "flex-end"
    },
    otherMessage: {
      alignSelf: "flex-start",
      flexDirection: "row-reverse"
    },
    messageContent: {
      flex: 1
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4
    },
    image: {
      borderRadius: 12,
      width: "100%",
      aspectRatio: 1
    },
    location: {}
  })
}
