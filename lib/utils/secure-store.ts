import * as SecureStore from "expo-secure-store"

export function getItem(key: string): string | null {
  console.log("getItem SecureStore")
  return SecureStore.getItem(key)
}

export function setItem(key: string, value: string): void {
  SecureStore.setItem(key, value)
}
