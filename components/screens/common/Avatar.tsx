import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { backend } from "@/lib/services/backend"
import { BACKEND_URL } from "@/lib/services/backend/url"
import type React from "react"
import { Image, StyleSheet, View } from "react-native"
import { bufferToUri } from "../chat/bufferToUri"
import { useBackend } from "@/lib/services/backend/use"
import { useState } from "react"

interface AvatarProps {
  avatar: string | null // Avatar can be a string (URL) or null
  username: string
}

export const Avatar: React.FC<AvatarProps> = ({ avatar, username }) => {
  const uri = `${BACKEND_URL!}/files/${avatar}`

  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined)
  const { loading: imageLoading } = useBackend<ArrayBuffer>(
    () => {
      if (!avatar) return Promise.resolve(null)
      return backend.files[avatar].get()
    },
    [avatar],
    {
      transform: (response) => {
        if (response.data) {
          const url = bufferToUri(response.data)
          setAvatarUri(url)
          return url
        }
      }
    }
  )
  return (
    <View style={styles.avatarContainer}>
      {avatarUri ? (
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
      ) : (
        <ThemedView style={styles.avatarPlaceholder}>
          <ThemedText>{username.charAt(0).toUpperCase()}</ThemedText>
        </ThemedView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  avatarContainer: {},
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center"
  }
})
