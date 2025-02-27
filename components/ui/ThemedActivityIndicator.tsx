import { useTheme } from "@/lib/a11y/ThemeContext"
import type React from "react"
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type ViewProps
} from "react-native"

interface ThemedActivityIndicatorProps extends ViewProps {
  size?: "small" | "large" // You can adjust this based on your needs
}

export const ThemedActivityIndicator: React.FC<
  ThemedActivityIndicatorProps
> = ({ size = "small", style, ...otherProps }) => {
  const { currentThemeMode } = useTheme()
  const isDarkMode = currentThemeMode === "dark"

  return (
    <View style={[styles.container, style]} {...otherProps}>
      <ActivityIndicator
        size={size}
        color={isDarkMode ? "#ffffff" : "#000000"} // Set color based on the theme
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10 // You can adjust padding as needed
  }
})

export const activityIndicatorStyles = styles
