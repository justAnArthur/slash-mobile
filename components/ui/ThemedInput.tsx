import { useTheme } from "@/lib/a11y/ThemeContext"
import React, { type PropsWithoutRef } from "react"
import { StyleSheet, TextInput, type TextInputProps } from "react-native"

export const ThemedInput = ({
  multiline,
  numberOfLines,
  style,
  ...props
}: PropsWithoutRef<TextInputProps>) => {
  const { theme } = useTheme()
  const styles = useStyles()

  return (
    <TextInput
      {...props}
      style={multiline ? [styles.textarea, style] : [styles.input, style]}
      placeholderTextColor={theme.mutedForeground}
      multiline={multiline}
      numberOfLines={multiline ? numberOfLines : 1}
    />
  )
}

function useStyles() {
  const { theme } = useTheme()

  return StyleSheet.create({
    input: {
      borderColor: theme.input,
      color: theme.foreground,
      width: "100%",
      borderRadius: 12,
      borderWidth: 2,
      fontSize: 14,
      paddingHorizontal: 18,
      paddingVertical: 12
    },
    textarea: {
      borderColor: theme.input,
      color: theme.foreground,
      width: "100%",
      borderRadius: 12,
      borderWidth: 2,
      fontSize: 14,
      lineHeight: 1.4,
      paddingLeft: 18,
      paddingRight: 18
    }
  })
}

export const useInputStyles = useStyles
