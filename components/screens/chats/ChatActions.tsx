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
  muted?: boolean
  onPin?: () => void
}

export const ChatActions = ({
  chatId,
  onDelete,
  pinned,
  muted,
  onPin
}: ChatActionsProps) => {
  const t = useI18nT("screens.chats.actions")
  const styles = useStyles()

  const [state, setState] = useState({ muted, pinned })

  const [open, setOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)

  async function _deleteChat(chatId: string) {
    return backend.chats[chatId].delete().then(() => {
      setOpen(false)
      onDelete?.()
    })
  }
  _deleteChat.displayName = "Delete chat"

  async function handleChatDelete() {
    const func = () => _deleteChat(chatId)
    func.displayName = _deleteChat.displayName
    if (!confirmAction) setConfirmAction(() => func)
  }

  async function handleChatPin() {
    return backend.chats[chatId].put({ pinned: !state.pinned }).then(() => {
      setOpen(false)
      setState((_state) => {
        _state.pinned = !_state.pinned
        return _state
      })
      onPin?.()
    })
  }

  async function handleChatMute() {
    return backend.chats[chatId].put({ muted: !state.muted }).then(() => {
      setOpen(false)
      setState((_state) => {
        _state.muted = !_state.muted
        return _state
      })
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
            <ThemedButton
              title={t(state.muted ? "unmute" : "mute")}
              onPress={handleChatMute}
            />
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
      flexDirection: "row",
      gap: 8,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1.5,
      borderBottomWidth: 0,
      backgroundColor: theme.background
    }
  })
}
