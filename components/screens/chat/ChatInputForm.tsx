import {
  UploadAttachmentModalButton,
  UploadMessageType
} from "@/components/screens/chat/UploadAttachmentForm"
import { ThemedView } from "@/components/ui/ThemedView"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { useI18nT } from "@/lib/i18n/Context"
import Feather from "@expo/vector-icons/Feather"
import type { LocationObjectCoords } from "expo-location"
import { useState } from "react"
import { Pressable, StyleSheet, TextInput } from "react-native"

export const MessageType = {
  TEXT: "TEXT",
  ...UploadMessageType
} as const

export type MessageTypeT = (typeof MessageType)[keyof typeof MessageType]

export type MessageTypeDataTypes = {
  [MessageType.TEXT]: string
  [MessageType.IMAGE_GALLERY]: File
  [MessageType.IMAGE_CAMERA]: File
  [MessageType.LOCATION]: LocationObjectCoords
}

export type Message<T extends MessageTypeT> = {
  type: T
  data: MessageTypeDataTypes[T]
}

type ChatInputFormProps = {
  onSubmit: (message: Message<MessageTypeT>) => Promise<void>
}

export const ChatInputForm = ({ onSubmit }: ChatInputFormProps) => {
  const styles = useStyles()

  async function handleSendMessage(type: MessageTypeT, data: any) {
    return onSubmit({ type, data })
  }

  return (
    <ThemedView style={styles.content}>
      <UploadAttachmentModalButton onSubmit={handleSendMessage} />
      <ChatInput
        onSubmit={(text) => handleSendMessage(MessageType.TEXT, text)}
      />
    </ThemedView>
  )
}

const ChatInput = ({ onSubmit }: { onSubmit: (text: string) => void }) => {
  const t = useI18nT("screens.chats.input")

  const styles = useStyles()

  const [text, setText] = useState("")

  function handleSubmit() {
    if (text.trim().length < 1) return

    onSubmit(text)
    setText("")
  }

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder={t("placeholder")}
        placeholderTextColor={styles.inputPlaceholder.color}
        multiline={true}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
      />
      <Pressable onPress={handleSubmit}>
        <Feather name="send" size={24} color={styles.input.color} />
      </Pressable>
    </>
  )
}

function useStyles() {
  const { theme, isDarkMode } = useTheme()

  return StyleSheet.create({
    content: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      borderRadius: 32
    },
    input: {
      flex: 1,
      color: theme.primaryForeground,
      fontSize: 14,
      padding: 18
    },
    inputPlaceholder: {
      color: `${theme.primaryForeground} / 10`
    }
  })
}
