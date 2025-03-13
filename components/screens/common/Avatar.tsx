import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import type React from "react"
import { Image, StyleSheet, View } from "react-native"

interface AvatarProps {
  avatar: string | null // Avatar can be a string (URL) or null
  username: string
}

export const Avatar: React.FC<AvatarProps> = ({ avatar, username }) => {
  return (
    <View style={styles.avatarContainer}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} />
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
