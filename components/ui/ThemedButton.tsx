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
  const { currentThemeMode } = useTheme()
  const isDarkMode = currentThemeMode === "dark"

  return (
    <TouchableOpacity
      {...props}
      style={[styles.button, isDarkMode && styles.buttonDark, style]}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, isDarkMode && styles.textDark]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 32,
    backgroundColor: "rgba(40,40,40,.7)",
    boxShadow: "inset 2px 4px 16px 0 hsla(0,0%,97%,.06)",
    backdropFilter: "blur(50px)",
    fontSize: 14,
    // lineHeight: 1.4,
    fontWeight: "600",
    color: "hsla(0,0%,97%,.7)"
    // transition: "background .2s, color .2s"
  },
  buttonDark: {
    backgroundColor: "rgba(40,40,40,.7)"
  },
  text: {
    color: "hsla(0,0%,97%,.7)"
  },
  textDark: {
    color: "hsla(0,0%,97%,.7)"
  }
})

export const buttonStyles = styles
