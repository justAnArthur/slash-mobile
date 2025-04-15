import ConfirmationModal from "@/components/screens/common/ConfirmationModal"
import { ThemedButton } from "@/components/ui/ThemedButton"
import { ThemedView } from "@/components/ui/ThemedView"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { useI18nT } from "@/lib/i18n/Context"
import { backend } from "@/lib/services/backend"
import Octicons from "@expo/vector-icons/Octicons"
import React, { useState } from "react"
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native"

type ChatActionsProps = {
  chatId: string
  onDelete?: () => void
  pinned?: boolean
  onPin?: () => void
}

export const ChatActions = ({
  chatId,
  onDelete,
  pinned,
  onPin
}: ChatActionsProps) => {
  const t = useI18nT("screens.chats.actions")
  const styles = useStyles()

  const [open, setOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)

  async function _deleteChat(chatId: string) {
    return backend.chats[chatId].delete().then(() => {
      setOpen(false)
      onDelete?.()
    })
  }
  _deleteChat.displayName = "Delete chat"

  function handleChatDelete() {
    const func = () => _deleteChat(chatId)
    func.displayName = _deleteChat.displayName
    if (!confirmAction) setConfirmAction(() => func)
  }

  function handleChatPin() {
    return backend.chats[chatId].post({ pinned: !pinned }).then(() => {
      setOpen(false)
      onPin?.()
    })
  }

  function handleConfirm() {
    if (confirmAction) confirmAction()
  }

  function handleCancel() {
    setConfirmAction(null)
    setOpen(false)
  }

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setOpen(true)}>
        <Octicons name="kebab-horizontal" color={styles.button.color} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        presentationStyle="overFullScreen"
        visible={open}
        onRequestClose={() => setOpen(false)}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => setOpen(false)}>
            <View style={styles.background} />
          </TouchableWithoutFeedback>

          <ThemedView
            style={styles.modal}
            onStartShouldSetResponder={() => true}
          >
            <ThemedButton title={t("delete")} onPress={handleChatDelete} />
            <ThemedButton title={t("pin")} onPress={handleChatPin} />
          </ThemedView>
        </View>
      </Modal>

      <ConfirmationModal
        title={
          confirmAction && "displayName" in confirmAction
            ? (confirmAction.displayName as string)
            : ""
        }
        visible={!!confirmAction}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  )
}

function useStyles() {
  const { theme } = useTheme()

  return StyleSheet.create({
    button: {
      color: theme.cardForeground,
      padding: 24
    },
    confirmContainer: {
      display: "flex",
      gap: 8
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end"
    },
    background: {
      flex: 1,
      width: "100%"
    },
    modal: {
      borderColor: theme.border,
      width: "100%",
      borderRadius: 12,
      padding: 24,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderWidth: 1.5,
      borderBottomWidth: 0,
      backgroundColor: theme.background
    }
  })
}
