export const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL!
export const WS_URL = BACKEND_URL.replace(/^http(s)?:/, "wss:")

console.log("BACKEND_URL", { BACKEND_URL, WS_URL })
