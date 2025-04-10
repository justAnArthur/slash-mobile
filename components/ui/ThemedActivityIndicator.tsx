import { useTheme } from "@/lib/a11y/ThemeContext"
import type React from "react"
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type ViewProps
} from "react-native"

interface ThemedActivityIndicatorProps extends ViewProps {
  size?: "small" | "large"
}

export const ThemedActivityIndicator: React.FC<
  ThemedActivityIndicatorProps
> = ({ size = "small", style, ...otherProps }) => {
  const { theme } = useTheme()

  return (
    <View style={[styles.container, style]} {...otherProps}>
      <ActivityIndicator size={size} color={theme.foreground} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  }
})

export const activityIndicatorStyles = styles
