import { BACKEND_URL } from "@/lib/services/backend/url"
import { expoClient } from "@better-auth/expo/client"
import { createAuthClient } from "better-auth/react"
import * as SecureStore from "expo-secure-store"
import ExpoSecureStore from "expo-secure-store/src/ExpoSecureStore"
import { Platform } from "react-native"

const webStorage: typeof SecureStore = {
  getItem(key: string) {
    return localStorage.getItem(key)
  },
  setItem(key: string, value: string) {
    localStorage.setItem(key, value)
  },
  async getItemAsync(key: string): Promise<string | null> {
    return Promise.resolve(localStorage.getItem(key))
  },
  async setItemAsync(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value)
    return Promise.resolve()
  },
  async deleteItemAsync(key: string): Promise<void> {
    localStorage.removeItem(key)
    return Promise.resolve()
  },
  isAvailableAsync: () => Promise.resolve(false),
  canUseBiometricAuthentication: () => false,
  AFTER_FIRST_UNLOCK: ExpoSecureStore.AFTER_FIRST_UNLOCK,
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: ExpoSecureStore.ALWAYS_THIS_DEVICE_ONLY,
  ALWAYS: ExpoSecureStore.ALWAYS,
  WHEN_PASSCODE_SET_THIS_DEVICE_ONLY:
    ExpoSecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
  ALWAYS_THIS_DEVICE_ONLY: ExpoSecureStore.ALWAYS_THIS_DEVICE_ONLY,
  WHEN_UNLOCKED: ExpoSecureStore.WHEN_UNLOCKED,
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: ExpoSecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY
}

const storage = Platform.OS === "web" ? webStorage : SecureStore

export const authClient = createAuthClient({
  baseURL: BACKEND_URL,
  plugins: [
    expoClient({
      scheme: "slash",
      storagePrefix: "slash",
      storage
    })
  ],
  fetchOptions: {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
})
