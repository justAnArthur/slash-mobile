import { authClient } from "@/lib/auth"
import { BACKEND_URL } from "@/lib/services/backend/url"
import { treaty } from "@elysiajs/eden"
import { Platform } from "react-native"
// noinspection ES6PreferShortImport
import type { App } from "../../../../backend/src/index"

export const backend = treaty<App>(BACKEND_URL!, {
  headers: () => {
    const headers = new Map<string, string>()

    headers.set("ngrok-skip-browser-warning", "true")

    if (Platform.OS !== "web") {
      const cookies = authClient.getCookie()
      if (cookies) headers.set("Cookie", cookies)
    }

    return Object.fromEntries(headers)
  },
  fetch: { credentials: "include" }
}) as any
