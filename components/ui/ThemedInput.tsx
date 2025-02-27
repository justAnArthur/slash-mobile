import { useTheme } from "@/lib/a11y/ThemeContext"
import React, { type PropsWithoutRef } from "react"
import { StyleSheet, TextInput, type TextInputProps } from "react-native"

export const ThemedInput = ({
  multiline,
  ...props
}: PropsWithoutRef<TextInputProps>) => {
  const { currentThemeMode } = useTheme()
  const isDarkMode = currentThemeMode === "dark"

  return (
    <TextInput
      {...props}
      style={
        multiline
          ? [styles.textarea, isDarkMode && styles.textareaDark]
          : [styles.input, isDarkMode && styles.inputDark]
      }
      placeholderTextColor={
        isDarkMode ? "hsla(0,0%,97%,.76)" : "hsla(0,0%,20%,.76)"
      }
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    backgroundColor: "hsla(0,0%,97%,.05)",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
    fontSize: 14,
    color: "hsla(0,0%,20%,.76)",
    // height: 52,
    paddingHorizontal: 18,
    paddingVertical: 12,
    // @ts-ignore
    transition: "all .2s"
  },
  inputDark: {
    backgroundColor: "hsla(0,0%,97%,.05)",
    color: "hsla(0,0%,97%,.76)"
  },
  textarea: {
    width: "100%",
    backgroundColor: "hsla(0,0%,97%,.05)",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
    fontSize: 14,
    lineHeight: 1.4,
    color: "hsla(0,0%,20%,.76)",
    paddingLeft: 18,
    paddingRight: 18,
    transition: "all .2s"
  },
  textareaDark: {
    backgroundColor: "hsla(0,0%,20%,.05)",
    color: "hsla(0,0%,97%,.76)"
  }
})

export const inputStyles = styles
