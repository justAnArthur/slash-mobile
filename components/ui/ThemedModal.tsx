import { useTheme } from "@/lib/a11y/ThemeContext"
import React from "react"
import {
  Modal,
  type ModalProps,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  type ViewProps
} from "react-native"

export type ThemedModalProps = ModalProps & {
  lightColor?: string
  darkColor?: string
  containerStyle?: ViewProps["style"]
}

export function ThemedModal({
  visible,
  onRequestClose,
  lightColor,
  darkColor,
  containerStyle,
  children,
  ...otherProps
}: ThemedModalProps) {
  const styles = useStyles()

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      transparent={true}
      {...otherProps}
    >
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback onPress={onRequestClose}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>

        <View style={styles.modal}>{children}</View>
      </View>
    </Modal>
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
