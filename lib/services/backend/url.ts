// const EXPO_DEV_BACKEND_URL = Constants.expoConfig?.hostUri
//   ?.split(":")
//   .shift()
//   ?.concat(":3000")
export const WS_URL = process.env.EXPO_PUBLIC_BACKEND_URL_WS
export const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL_HTTP

console.log("BACKEND_URL", BACKEND_URL)
