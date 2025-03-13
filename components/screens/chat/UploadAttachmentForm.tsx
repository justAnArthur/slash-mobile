import type { MessageTypeDataTypes } from "@/components/screens/chat/ChatInputForm"
import { ThemedButton, useButtonStyles } from "@/components/ui/ThemedButton"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { useI18nT } from "@/lib/i18n/Context"
import Feather from "@expo/vector-icons/Feather"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import Octicons from "@expo/vector-icons/Octicons"
import { Image } from "expo-image"
import * as ImagePicker from "expo-image-picker"
import * as Location from "expo-location"
import React, { useState } from "react"
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native"

export const UploadMessageType = {
  IMAGE_GALLERY: "IMAGE_GALLERY",
  IMAGE_CAMERA: "IMAGE_CAMERA",
  LOCATION: "LOCATION"
} as const

type UploadMessageTypeT =
  (typeof UploadMessageType)[keyof typeof UploadMessageType]

type UploadFormProps<T extends UploadMessageTypeT> = {
  onSubmit: (type: T, data: MessageTypeDataTypes[T]) => void
  onCanceled?: () => void
}

export const UploadAttachmentModalButton = <T extends UploadMessageTypeT>(
  props: UploadFormProps<T>
) => {
  const { theme } = useTheme()
  const styles = useStyles()

  const [isOpen, setIsOpen] = useState(false)

  function handleOnSubmit(...args: any) {
    // @ts-ignore
    props.onSubmit(...args)
    setIsOpen(false)
  }

  return (
    <>
      <Pressable onPress={() => setIsOpen(true)}>
        <Feather name="upload" size={24} color={theme.primaryForeground} />
      </Pressable>

      <Modal
        animationType="slide"
        presentationStyle="formSheet"
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
        transparent={true}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.modalContainer}>
            <UploadForm
              onSubmit={handleOnSubmit}
              onCanceled={() => setIsOpen(false)}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  )
}

export const UploadForm = <
  Type extends UploadMessageTypeT,
  DataType extends MessageTypeDataTypes[Type]
>({
  onSubmit,
  onCanceled
}: UploadFormProps<Type>) => {
  const t = useI18nT("screens.chats.input")

  const buttonStyles = useButtonStyles()
  const styles = useStyles()

  const [locationPermissionStatus, requestLocationPermission] =
    Location.useForegroundPermissions()

  const [type, setType] = useState<Type | null>(null)
  const [data, setData] = useState<DataType | null>(null)

  async function handleImagePick() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1
    })

    if (!result.canceled && result.assets.length > 0) {
      setType(UploadMessageType.IMAGE_GALLERY as Type)
      setData(result.assets[0] as DataType)
    } else {
      alert("You did not select any image.")
    }
  }

  async function handleCameraPick() {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1
    })

    if (!result.canceled && result.assets.length > 0) {
      setType(UploadMessageType.IMAGE_CAMERA as Type)
      setData(result.assets[0] as DataType)
    } else {
      alert("You did not take any photo.")
    }
  }

  async function handleGeoPick() {
    // todo check not working | display map with current location

    const { status } = await requestLocationPermission()

    if (status !== "granted") {
      alert("Permission to access location was denied")
      return
    }

    const currentLocation = await Location.getCurrentPositionAsync()
    setType(UploadMessageType.LOCATION as Type)
    setData(currentLocation.coords as DataType)
  }

  function handleOnSubmit() {
    if (!type || !data) {
      return
    }

    onSubmit(type, data)
  }

  return (
    <ThemedView style={styles.uploadModal}>
      {!type && (
        <ThemedView style={styles.uploadHeader}>
          <Pressable style={buttonStyles.button} onPress={handleImagePick}>
            <Feather name="image" size={24} color="white" />
          </Pressable>

          <Pressable style={buttonStyles.button} onPress={handleCameraPick}>
            <Feather name="camera" size={24} color="white" />
          </Pressable>

          <Pressable style={buttonStyles.button} onPress={handleGeoPick}>
            <MaterialIcons name="gps-fixed" size={24} color="white" />
          </Pressable>

          <View
            style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
          >
            <Pressable
              style={[buttonStyles.button, { paddingHorizontal: 12 }]}
              onPress={onCanceled}
            >
              <MaterialIcons name="close" size={24} color="white" />
            </Pressable>
          </View>
        </ThemedView>
      )}

      {type && (
        <ThemedView style={styles.uploadContent}>
          {[
            UploadMessageType.IMAGE_CAMERA as Type,
            UploadMessageType.IMAGE_GALLERY as Type
          ].includes(type) &&
            data &&
            "uri" in data &&
            data.uri && (
              <Image
                source={data.uri}
                style={{
                  width: "100%",
                  aspectRatio: 1,
                  borderRadius: 12
                }}
              />
            )}

          {[UploadMessageType.LOCATION as Type].includes(type) &&
            data &&
            "latitude" in data &&
            "longitude" in data &&
            data.latitude &&
            data.longitude && (
              <ThemedText type="default">
                {`Latitude: ${data.latitude}, Longitude: ${data.longitude}`}
              </ThemedText>
            )}

          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={[buttonStyles.button, { width: 48, height: 48 }]}
              onPress={() => setType(null)}
            >
              <Octicons
                name="arrow-left"
                size={24}
                color={buttonStyles.button.color}
              />
            </TouchableOpacity>

            <ThemedButton
              title={t("send")}
              onPress={handleOnSubmit}
              style={{ flex: 1 }}
            />
          </View>
        </ThemedView>
      )}
    </ThemedView>
  )
}

function useStyles() {
  const { theme, isDarkMode } = useTheme()

  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center"
    },
    uploadModal: {
      borderColor: theme.border,
      width: "100%",
      borderRadius: 12,
      padding: 24,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderWidth: 1.5,
      borderBottomWidth: 0
    },
    uploadHeader: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 18
    },
    uploadContent: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  })
}
