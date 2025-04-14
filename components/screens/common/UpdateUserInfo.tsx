import { useEffect, useState } from "react"
import { BACKEND_URL } from "@/lib/services/backend/url"
import { authClient } from "@/lib/auth"
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View
} from "react-native"
import { useBackend } from "@/lib/services/backend/use"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { ThemedView } from "@/components/ui/ThemedView"
import Feather from "@expo/vector-icons/Feather"
import * as ImagePicker from "expo-image-picker"
import { Image } from "expo-image"
import { ThemedButton, useButtonStyles } from "@/components/ui/ThemedButton"
import { backend } from "@/lib/services/backend"
import { bufferToUri } from "@/components/screens/chat/bufferToUri"
import { useI18nT } from "@/lib/i18n/Context"

type UpdateUserInfoProps = {
  onSuccess?: () => void
}

export const UpdateUserInfo = ({ onSuccess }: UpdateUserInfoProps) => {
  const t = useI18nT("common")
  const { data: session } = authClient.useSession()
  const styles = useStyles()
  const [bio, setBio] = useState("")
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined)

  const {
    data: userInfo,
    loading: userIsLoading,
    error: userError
  } = useBackend<{
    image: string
    bio: string
  }>(
    () => {
      if (!session?.user.id) throw new Error(t("errors.noUserSession"))
      return backend.users[session.user.id].profile.get()
    },
    [session?.user.id],
    {
      transform: (response) => {
        if (response.data.bio) setBio(response.data.bio)
        return response.data
      }
    }
  )

  const { loading: imageLoading } = useBackend<ArrayBuffer>(
    () => {
      if (!userInfo?.image) return Promise.resolve(null)
      return backend.files[userInfo.image].get()
    },
    [userInfo?.image],
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

  const inputStyles = useStyles()
  const updateProfile = async () => {
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

      if (!response.ok) {
        throw new Error(t("errors.updateProfileFailed"))
      }
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error(t("errors.updateProfileFailed"), error)
    }
  }

  return (
    <View style={styles.container}>
      <UploadAvatar
        onAvatarSelected={(uri) => setAvatarUri(uri)}
        currentAvatar={avatarUri}
        isLoading={imageLoading}
      />
      <TextInput
        style={inputStyles.input}
        placeholder={t("profile.bioPlaceholder")}
        //placeholderTextColor={inputStyles.inputPlaceholder.color}
        multiline={true}
        value={bio}
        onChangeText={setBio}
        maxLength={280}
      />
      <ThemedButton
        title={userIsLoading ? t("profile.saving") : t("profile.save")}
        onPress={updateProfile}
        disabled={userIsLoading}
        style={inputStyles.button}
      />
    </View>
  )

  function useStyles() {
    const { theme } = useTheme()

    return StyleSheet.create({
      container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
        gap: 20
      },
      input: {
        width: 300,
        height: 100,
        borderColor: theme.input,
        color: theme.foreground,
        fontSize: 14,
        padding: 10,
        borderWidth: 2,
        borderRadius: 5
      },
      button: {
        width: "100%"
      }
    })
  }
}

type UploadAvatarProps = {
  onAvatarSelected: (uri: string) => void
  currentAvatar?: string
  isLoading?: boolean
}

export const UploadAvatar = ({
  onAvatarSelected,
  currentAvatar,
  isLoading = false
}: UploadAvatarProps) => {
  const { t } = useI18nT("common")
  const { theme } = useTheme()
  const styles = useStyles()
  const buttonStyles = useButtonStyles()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(
    currentAvatar || null
  )

  useEffect(() => {
    setSelectedImage(currentAvatar || null)
  }, [currentAvatar])

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync()
    const { status: galleryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync()
    return cameraStatus === "granted" && galleryStatus === "granted"
  }

  const handleGalleryPick = async () => {
    if (isLoading) return
    const hasPermission = await requestPermissions()
    if (!hasPermission) {
      alert(t("profile.permissionAlert"))
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
    if (isLoading) return
    const hasPermission = await requestPermissions()
    if (!hasPermission) {
      alert(t("profile.permissionAlert"))
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
    if (isLoading || !selectedImage) return
    onAvatarSelected(selectedImage)
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    if (isLoading) return
    setSelectedImage(currentAvatar || null)
    setIsModalOpen(false)
  }

  return (
    <>
      <Pressable
        onPress={() => !isLoading && setIsModalOpen(true)}
        disabled={isLoading}
      >
        <ThemedView style={styles.avatarContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={theme.primaryForeground} />
          ) : selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.avatarImage}
              contentFit="contain"
            />
          ) : (
            <Feather name="user" size={40} color={theme.foreground} />
          )}
          {!isLoading && (
            <ThemedView style={styles.uploadIcon}>
              <Feather name="upload" size={16} color="white" />
            </ThemedView>
          )}
        </ThemedView>
      </Pressable>

      <Modal
        animationType="slide"
        visible={isModalOpen}
        onRequestClose={() => !isLoading && setIsModalOpen(false)}
        transparent={true}
      >
        <ThemedView style={styles.modalContainer}>
          <ThemedView style={styles.modalContent}>
            {isLoading ? (
              <ActivityIndicator size="large" color={theme.primaryForeground} />
            ) : selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImage}
                contentFit="contain"
              />
            ) : null}

            <ThemedView style={styles.buttonContainer}>
              <Pressable
                style={[
                  buttonStyles.button,
                  isLoading && styles.disabledButton
                ]}
                onPress={handleGalleryPick}
                disabled={isLoading}
              >
                <Feather name="image" size={24} color="white" />
              </Pressable>

              <Pressable
                style={[
                  buttonStyles.button,
                  isLoading && styles.disabledButton
                ]}
                onPress={handleCameraPick}
                disabled={isLoading}
              >
                <Feather name="camera" size={24} color="white" />
              </Pressable>
              {selectedImage && (
                <>
                  <Pressable
                    style={[
                      buttonStyles.button,
                      isLoading && styles.disabledButton
                    ]}
                    onPress={handleSave}
                    disabled={isLoading}
                  >
                    <Feather name="check" size={24} color="white" />
                  </Pressable>
                  <Pressable
                    style={[
                      buttonStyles.button,
                      isLoading && styles.disabledButton
                    ]}
                    onPress={handleCancel}
                    disabled={isLoading}
                  >
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
      borderColor: theme.input,
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
    },
    disabledButton: {
      opacity: 0.5
    }
  })
}
