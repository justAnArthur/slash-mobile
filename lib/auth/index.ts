// @ts-ignore without /dist is not working
import { expoClient } from "@better-auth/expo/dist/client"
// @ts-ignore without /dist is not working
import { createAuthClient } from "better-auth/dist/react"
import * as SecureStore from "expo-secure-store"

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
  plugins: [
    expoClient({
      scheme: "slash",
      storagePrefix: "slash",
      storage: SecureStore
    })
  ]
})
