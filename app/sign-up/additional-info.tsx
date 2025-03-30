import { signInStyles } from "@/app/sign-in"
import { ThemedButton } from "@/components/ui/ThemedButton"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { ImageBackground, StyleSheet, TextInput } from "react-native"
import { UploadAvatar } from "@/components/screens/sign-up/UploadAvatar"
import { authClient } from "@/lib/auth"
import { BACKEND_URL } from "@/lib/services/backend/url"

export default function SignUpScreen() {
  const router = useRouter()
  const [bio, setBio] = useState("")
  const inputStyles = useStyles()
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined)
  async function updateProfile() {
    const formData = new FormData()
    if (avatarUri) {
      if (avatarUri.startsWith("data:") || avatarUri.startsWith("blob:")) {
        const blob = await fetch(avatarUri).then((res) => res.blob())
        formData.append("image", blob, `photo.${blob.type.split("/")[1]}`)
      } else {
        const uriParts = avatarUri.split(".")
        const fileType = uriParts[uriParts.length - 1]
        formData.append("image", {
          uri: avatarUri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`
        } as any)
      }
    }
    if (bio) {
      formData.append("bio", bio)
    }
    try {
      const response = await fetch(`${BACKEND_URL!}/users/profile`, {
        method: "POST",
        body: formData,
        headers: {
          Cookie: authClient.getCookie()
        },
        credentials: "include"
      })

      if (response.ok) {
        router.replace("/")
      }
      console.log({ response })
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <ThemedView style={signInStyles.content}>
      <ThemedText type="title" style={signInStyles.title}>
        Finish registration
      </ThemedText>
      <UploadAvatar
        onAvatarSelected={(uri) => setAvatarUri(uri)}
        currentAvatar={avatarUri}
      />
      <TextInput
        style={inputStyles.input}
        placeholder="Tell us about yourself in 280 characters..."
        placeholderTextColor={inputStyles.inputPlaceholder.color}
        multiline={true}
        value={bio}
        onChangeText={setBio}
        maxLength={280}
      />
      <ThemedButton title="Submit" onPress={updateProfile} />
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
