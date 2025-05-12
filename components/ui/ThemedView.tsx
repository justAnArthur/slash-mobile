<<<<<<< HEAD
import { View, type ViewProps } from "react-native"

import { useOverrideThemeColor } from "@/lib/a11y/ThemeContext"

export type ThemedViewProps = ViewProps & {
  lightColor?: string
  darkColor?: string
}

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useOverrideThemeColor("background", {
    light: lightColor,
    dark: darkColor
  })

  return <View style={[{ backgroundColor }, style]} {...otherProps} />
}
=======
import { View, type ViewProps } from "react-native"

import { useOverrideThemeColor } from "@/lib/a11y/ThemeContext"

export type ThemedViewProps = ViewProps & {
  lightColor?: string
  darkColor?: string
}

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useOverrideThemeColor("background", {
    light: lightColor,
    dark: darkColor
  })

  return <View style={[{ backgroundColor }, style]} {...otherProps} />
}
>>>>>>> 22703bd7fa6ddb9c5f3446763a1797c3b2ec69d8
