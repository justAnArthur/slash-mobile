import { StyleSheet, Text, type TextProps } from "react-native"

import { useOverrideThemeColor } from "@/lib/a11y/ThemeContext"

export type ThemedTextProps = TextProps & {
  lightColor?: string
  darkColor?: string
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "small"
    | "extraSmall"
}

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useOverrideThemeColor("text", {
    light: lightColor,
    dark: darkColor
  })

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "small" ? styles.small : undefined,
        type === "extraSmall" ? styles.extraSmall : undefined,
        style
      ]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600"
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold"
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4"
  },
  extraSmall: {
    fontSize: 12
  },
  small: {
    fontSize: 14
  }
})
