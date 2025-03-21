import { ThemedButton } from "@/components/ui/ThemedButton"
import { ThemedModal } from "@/components/ui/ThemedModal"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import React from "react"
import { StyleSheet } from "react-native"

interface ConfirmationModalProps {
  visible: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onConfirm,
  onCancel
}) => {
  return (
    <ThemedModal transparent={true} visible={visible}>
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <ThemedText style={styles.modalText}>
            Are you sure you want to delete this chat?
          </ThemedText>
          <ThemedView style={styles.buttonContainer}>
            <ThemedButton title="Cancel" onPress={onCancel} />
            <ThemedButton title="Delete" onPress={onConfirm} />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedModal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: "center"
  },
  modalText: {
    marginBottom: 20
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  }
})

export default ConfirmationModal
