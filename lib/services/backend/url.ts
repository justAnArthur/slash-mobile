// const EXPO_DEV_BACKEND_URL = Constants.expoConfig?.hostUri
//   ?.split(":")
//   .shift()
//   ?.concat(":3000")

export const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL

console.log("BACKEND_URL", BACKEND_URL)
