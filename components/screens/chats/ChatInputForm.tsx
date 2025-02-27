import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { ThemedButton, buttonStyles } from "@/components/ui/ThemedButton"
import { inputStyles } from "@/components/ui/ThemedInput"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { useI18nT } from "@/lib/i18n/Context"
import Feather from "@expo/vector-icons/Feather"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { Image } from "expo-image"
import * as ImagePicker from "expo-image-picker"
import type { ImagePickerAsset } from "expo-image-picker/src/ImagePicker.types"
import type { LocationObjectCoords } from "expo-location"
import * as Location from "expo-location"
import { useState } from "react"
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View
} from "react-native"

type ChatInputFormProps = {
  onSubmit: (message: Message<MessageTypeT>) => void
}

export const ChatInputForm = ({ onSubmit }: ChatInputFormProps) => {
  function handleSendMessage(type: MessageTypeT, data: any) {
    onSubmit({ type, data })
  }

  return (
    <ThemedView style={styles.content}>
      <UploadModalButton onSubmit={handleSendMessage} />
      <ChatInput
        onSubmit={(text) => handleSendMessage(MessageType.TEXT, text)}
      />
    </ThemedView>
  )
}

const ChatInput = ({ onSubmit }: { onSubmit: (text: string) => void }) => {
  const { currentThemeMode } = useTheme()
  const isDarkMode = currentThemeMode === "dark"

  const t = useI18nT("screens.chats.input")

  const [text, setText] = useState("")

  function handleSubmit() {
    if (text.trim().length < 1) return

    onSubmit(text)
    setText("")
  }

  return (
    <>
      <TextInput
        style={[
          styles.input,
          { flex: 1 },
          isDarkMode && { color: inputStyles.inputDark.color }
        ]}
        placeholder={t("placeholder")}
        placeholderTextColor="hsla(0,0%,20%,.76)"
        multiline={true}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
      />
      <Pressable onPress={handleSubmit}>
        <Feather name="send" size={24} color="hsla(0,0%,20%,.76)" />
      </Pressable>
    </>
  )
}

const UploadModalButton = <T extends UploadMessageTypeT>(
  props: UploadFormProps<T>
) => {
  const [isOpen, setIsOpen] = useState(false)

  function handleOnSubmit(...args: any) {
    // @ts-ignore
    props.onSubmit(...args)
    setIsOpen(false)
  }

  return (
    <>
      <Pressable onPress={() => setIsOpen(true)}>
        <Feather name="upload" size={24} color="hsla(0,0%,20%,.76)" />
      </Pressable>

      <Modal
        animationType="fade"
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

const UploadMessageType = {
  IMAGE_GALLERY: "IMAGE_GALLERY",
  IMAGE_CAMERA: "IMAGE_CAMERA",
  LOCATION: "LOCATION"
} as const
type UploadMessageTypeT =
  (typeof UploadMessageType)[keyof typeof UploadMessageType]

const MessageType = {
  TEXT: "TEXT",
  ...UploadMessageType
} as const
type MessageTypeT = (typeof MessageType)[keyof typeof MessageType]

type MessageTypeDataTypes = {
  [MessageType.TEXT]: string
  [MessageType.IMAGE_GALLERY]: ImagePickerAsset
  [MessageType.IMAGE_CAMERA]: ImagePickerAsset
  [MessageType.LOCATION]: LocationObjectCoords
}

type Message<T extends MessageTypeT> = {
  type: T
  data: MessageTypeDataTypes[T] | null
}

type UploadFormProps<T extends UploadMessageTypeT> = {
  onSubmit: (type: T, data: MessageTypeDataTypes[T]) => void
  onCanceled?: () => void
}

export const UploadForm = <
  Type extends UploadMessageTypeT,
  DataType extends MessageTypeDataTypes[Type]
>({
  onSubmit,
  onCanceled
}: UploadFormProps<Type>) => {
  const t = useI18nT("screens.chats.input")

  const [locationPermissionStatus, requestLocationPermission] =
    Location.useForegroundPermissions()

  const [type, setType] = useState<Type | null>(null)
  const [data, setData] = useState<DataType | null>(null)

  async function handleImagePick() {
    setType(UploadMessageType.IMAGE_GALLERY as Type)

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1
    })

    if (!result.canceled && result.assets.length > 0) {
      setData(result.assets[0] as DataType)
    } else {
      alert("You did not select any image.")
    }
  }

  async function handleCameraPick() {
    setType(UploadMessageType.IMAGE_CAMERA as Type)

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1
    })

    if (!result.canceled && result.assets.length > 0) {
      setData(result.assets[0] as DataType)
    } else {
      alert("You did not take any photo.")
    }
  }

  async function handleGeoPick() {
    // todo check not working | display map with current location
    setType(UploadMessageType.LOCATION as Type)

    const { status } = await requestLocationPermission()

    if (status !== "granted") {
      alert("Permission to access location was denied")
      return
    }

    const currentLocation = await Location.getCurrentPositionAsync()
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

        <View style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <Pressable
            style={[buttonStyles.button, { paddingHorizontal: 12 }]}
            onPress={onCanceled}
          >
            <MaterialIcons name="close" size={24} color="white" />
          </Pressable>
        </View>
      </ThemedView>

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

          <ThemedButton title={t("send")} onPress={handleOnSubmit} />
        </ThemedView>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "black",
    paddingHorizontal: 24,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 32
  },
  input: {
    fontSize: 14,
    padding: 18
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  uploadModal: {
    width: "100%",
    borderRadius: 12,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: "hsla(0,0%,20%,.76)"
  },
  uploadHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 18
  },
  uploadContent: {
    paddingTop: 18,
    display: "flex",
    flexDirection: "column",
    gap: 18
  }
})
