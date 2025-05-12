import { Platform } from "react-native"

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

export function bufferToUri(
  data: ArrayBuffer | Uint8Array,
  mimeType = "image/png"
): string {
  const arrayBuffer = data instanceof ArrayBuffer ? data : data.buffer

  if (Platform.OS === "web") {
    // @ts-ignore
    const blob = new Blob([arrayBuffer], { type: mimeType })
    return URL.createObjectURL(blob)
  }

  // @ts-ignore
  const base64Data = arrayBufferToBase64(arrayBuffer)
  return `data:${mimeType};base64,${base64Data}`
}
