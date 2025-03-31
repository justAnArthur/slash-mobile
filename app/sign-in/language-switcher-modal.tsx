import { ThemedView } from "@/components/ui/ThemedView"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { LanguageSwitcher } from "@/lib/i18n/LanguageSwitcher"
import Feather from "@expo/vector-icons/Feather"
import React, { useState } from "react"
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native"

export function LanguageModalSwitcher() {
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)

  const languageModalSwitcherStyles = useLanguageModalSwitcherStyles()

  return (
    <>
      <Pressable onPress={() => setOpen(true)}>
        <Feather name="globe" size={24} color={theme.foreground} />
      </Pressable>

      <Modal
        animationType="slide"
        presentationStyle="formSheet"
        visible={open}
        onRequestClose={() => setOpen(false)}
        transparent={true}
      >
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={languageModalSwitcherStyles.modalContainer}>
            <ThemedView style={languageModalSwitcherStyles.modal}>
              <LanguageSwitcher />
            </ThemedView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  )
}

function useLanguageModalSwitcherStyles() {
  const { theme } = useTheme()

  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end"
    },
    modal: {
      // height: 100,
      borderColor: theme.border,
      width: "100%",
      borderRadius: 12,
      padding: 24,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderWidth: 1.5,
      borderBottomWidth: 0
    }
  })
}
