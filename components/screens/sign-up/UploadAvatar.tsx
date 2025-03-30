import React, { useState } from "react"
import { Modal, Pressable, StyleSheet } from "react-native"
import Feather from "@expo/vector-icons/Feather"
import * as ImagePicker from "expo-image-picker"
import { Image } from "expo-image"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { ThemedView } from "@/components/ui/ThemedView"
import { useButtonStyles } from "@/components/ui/ThemedButton"

type UploadAvatarProps = {
  onAvatarSelected: (uri: string) => void
  currentAvatar?: string
}

export const UploadAvatar = ({
  onAvatarSelected,
  currentAvatar
}: UploadAvatarProps) => {
  const { theme } = useTheme()
  const styles = useStyles()
  const buttonStyles = useButtonStyles()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(
    currentAvatar || null
  )

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync()
    const { status: galleryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync()
    return cameraStatus === "granted" && galleryStatus === "granted"
  }

  const handleGalleryPick = async () => {
    const hasPermission = await requestPermissions()
    if (!hasPermission) {
      alert("Please grant camera and gallery permissions to upload an avatar.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1]
    })

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri
      setSelectedImage(uri)
    }
  }

  const handleCameraPick = async () => {
    const hasPermission = await requestPermissions()
    if (!hasPermission) {
      alert("Please grant camera and gallery permissions to upload an avatar.")
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1]
    })

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri
      setSelectedImage(uri)
    }
  }

  const handleSave = () => {
    if (selectedImage) {
      onAvatarSelected(selectedImage)
      setIsModalOpen(false)
    }
  }

  const handleCancel = () => {
    setSelectedImage(currentAvatar || null)
    setIsModalOpen(false)
  }

  return (
    <>
      <Pressable onPress={() => setIsModalOpen(true)}>
        <ThemedView style={styles.avatarContainer}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.avatarImage}
              contentFit="contain"
            />
          ) : (
            <Feather name="user" size={40} color={theme.primaryForeground} />
          )}
          <ThemedView style={styles.uploadIcon}>
            <Feather name="upload" size={16} color="white" />
          </ThemedView>
        </ThemedView>
      </Pressable>

      <Modal
        animationType="slide"
        presentationStyle="formSheet"
        visible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        transparent={true}
      >
        <ThemedView style={styles.modalContainer}>
          <ThemedView style={styles.modalContent}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImage}
                contentFit="contain"
              />
            )}

            <ThemedView style={styles.buttonContainer}>
              <Pressable
                style={buttonStyles.button}
                onPress={handleGalleryPick}
              >
                <Feather name="image" size={24} color="white" />
              </Pressable>

              <Pressable style={buttonStyles.button} onPress={handleCameraPick}>
                <Feather name="camera" size={24} color="white" />
              </Pressable>
              {selectedImage && (
                <>
                  <Pressable style={buttonStyles.button} onPress={handleSave}>
                    <Feather name="check" size={24} color="white" />
                  </Pressable>
                  <Pressable style={buttonStyles.button} onPress={handleCancel}>
                    <Feather name="x" size={24} color="white" />
                  </Pressable>
                </>
              )}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </>
  )
}

function useStyles() {
  const { theme } = useTheme()

  return StyleSheet.create({
    avatarContainer: {
      width: 300,
      height: 300,
      aspectRatio: 1,
      padding: 5,
      borderRadius: 150,
      backgroundColor: theme.background,
      borderColor: theme.border,
      borderWidth: 1.5,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      overflow: "hidden"
    },
    avatarImage: {
      width: 300,
      height: 300,
      borderRadius: 150
    },
    uploadIcon: {
      position: "absolute",
      bottom: 5,
      right: 5,
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 4
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)"
    },
    modalContent: {
      backgroundColor: theme.background,
      borderColor: theme.border,
      width: "100%",
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      padding: 24,
      flexDirection: "column",
      alignItems: "center",
      borderWidth: 1.5,
      borderBottomWidth: 0,
      gap: 18
    },
    previewImage: {
      width: "100%",
      height: undefined,
      aspectRatio: 1,
      borderRadius: 12,
      alignSelf: "center"
    },
    buttonContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 18
    }
  })
}

export default UploadAvatar
