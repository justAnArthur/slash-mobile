import type React from "react"
import { Image, StyleSheet } from "react-native"
import { ThemedText } from "./ThemedText"
import { ThemedView } from "./ThemedView"

interface AvatarProps {
  avatar: string | null // Avatar can be a string (URL) or null
  username: string
}

export const Avatar: React.FC<AvatarProps> = ({ avatar, username }) => {
  return (
    <ThemedView style={styles.avatarContainer}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      ) : (
        <ThemedView style={styles.avatarPlaceholder}>
          <ThemedText>{username.charAt(0).toUpperCase()}</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  avatarContainer: {
    marginRight: 15
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc", // Placeholder background color
    justifyContent: "center",
    alignItems: "center"
  }
})
