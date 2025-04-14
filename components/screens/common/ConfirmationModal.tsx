import { ThemedButton } from "@/components/ui/ThemedButton"
import { ThemedModal } from "@/components/ui/ThemedModal"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { useI18nT } from "@/lib/i18n/Context"
import type React from "react"
import { StyleSheet, View } from "react-native"

interface ConfirmationModalProps {
  title: string
  visible: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  visible,
  onConfirm,
  onCancel
}) => {
  const t = useI18nT("common")
  return (
    <ThemedModal visible={visible} onRequestClose={onCancel}>
      <View style={styles.container}>
        <ThemedText>{title}</ThemedText>
        <ThemedView style={styles.buttonContainer}>
          <ThemedButton title={t("cancel")} onPress={onCancel} />
          <ThemedButton title={t("ok")} onPress={onConfirm} />
        </ThemedView>
      </View>
    </ThemedModal>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: 20
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    width: "100%"
  }
})

export default ConfirmationModal
