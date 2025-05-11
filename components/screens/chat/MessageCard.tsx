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
import { Linking, Pressable, StyleSheet, View } from "react-native"
import { Avatar } from "../common/Avatar"
import { authClient } from "@/lib/auth"
import { ThemedView } from "@/components/ui/ThemedView"

export const MessageCard = ({
  content,
  createdAt: date,
  name,
  image,
  attachments,
  senderId
}: MessageResponse) => {
  const styles = useStyles()

  const { data: session } = authClient.useSession()
  const isMe = session?.user.id === senderId

  const formatDate = (date: string) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })

  if (senderId === "SYSTEM") {
    return (
      <ThemedView style={styles.systemMessage}>
        <ThemedText type="small" style={styles.systemMessageText}>
          {content}
        </ThemedText>
        <ThemedText type="extraSmall" style={styles.systemMessageDate}>
          {formatDate(date)}
        </ThemedText>
      </ThemedView>
    )
  }
  return (
    <View
      style={[styles.container, isMe ? styles.myMessage : styles.otherMessage]}
    >
      <View style={styles.messageContent}>
        <View style={styles.header}>
          <ThemedText type="subtitle">{isMe ? "Me" : name}</ThemedText>
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

  if (attachment.JSON) {
    const locationData = JSON.parse(attachment.JSON)
    const { latitude, longitude } = locationData
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`

    return (
      <Pressable
        key={attachment.id}
        style={styles.location}
        onPress={() => Linking.openURL(googleMapsUrl)}
      >
        <ThemedText type="small" style={styles.locationText}>
          Location: Latitude: {latitude}, Longitude: {longitude}
        </ThemedText>
        <AntDesign name="pushpin" size={16} />
      </Pressable>
    )
  }

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
          <Image
            source={{ uri: url }}
            style={styles.image}
            contentFit="contain"
          />
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
    location: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 4
    },
    locationText: {
      color: "#1E90FF" // Use a theme color or default to a blue shade
    },
    systemMessage: {
      padding: 10,
      borderRadius: 12,
      marginBottom: 8,
      alignItems: "center",
      width: "100%"
    },
    systemMessageText: {
      fontWeight: "bold"
    },
    systemMessageDate: {
      fontSize: 12
    }
  })
}
