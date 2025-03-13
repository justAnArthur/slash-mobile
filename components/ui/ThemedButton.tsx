import { useTheme } from "@/lib/a11y/ThemeContext"
import React from "react"
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps
} from "react-native"

interface ButtonProps extends TouchableOpacityProps {
  title: string
}

export const ThemedButton = ({ title, style, ...props }: ButtonProps) => {
  const styles = useStyles()

  return (
    <TouchableOpacity
      {...props}
      style={[styles.button, style]}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

function useStyles() {
  const { theme, isDarkMode } = useTheme()

  return StyleSheet.create({
    button: {
      backgroundColor: theme.primary,
      color: theme.primaryForeground,
      boxShadow: isDarkMode
        ? "inset 2px 4px 16px 0 hsla(0,0%,97%,.06)"
        : "0 24px 24px -16px rgba(5,5,5,.09),0 6px 13px 0 rgba(5,5,5,.1),0 6px 4px -4px rgba(5,5,5,.1),0 5px 1.5px -4px rgba(5,5,5,.25)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 32,
      backdropFilter: "blur(50px)",
      fontSize: 14,
      fontWeight: "600"
    },
    text: {
      color: theme.primaryForeground
    }
  })
}

export const useButtonStyles = useStyles
