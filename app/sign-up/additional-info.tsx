import { useSignInStyles } from "@/app/sign-in"
import { UpdateUserInfo } from "@/components/screens/common/UpdateUserInfo"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { useRouter } from "expo-router"
import React from "react"
import { ImageBackground, StyleSheet } from "react-native"

export default function AdditionalInfo() {
  const router = useRouter()
  const signInStyles = useSignInStyles()

  return (
    <ThemedView style={signInStyles.content}>
      <ThemedText type="title" style={signInStyles.title}>
        Finish registration
      </ThemedText>
      <UpdateUserInfo
        onSuccess={() => {
          router.replace("/")
        }}
      />
      <ImageBackground
        source={require("@/assets/images/bg-entry.webp")}
        style={signInStyles.backgroundGradient}
      />

      <ImageBackground
        source={require("@/assets/images/stars.svg")}
        style={signInStyles.backgroundStars}
      />
    </ThemedView>
  )
}

function useStyles() {
  const { theme, isDarkMode } = useTheme()

  return StyleSheet.create({
    input: {
      width: 300,
      height: 100,
      color: theme.primaryForeground,
      fontSize: 14,
      padding: 18,
      backgroundColor: theme.background,
      borderColor: theme.border
    },
    inputPlaceholder: {
      color: `${theme.primaryForeground}80`
    }
  })
}
