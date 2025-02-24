import { treaty } from "@elysiajs/eden"
import type { App } from "@slash/backend/src"

export const backend = treaty<App>(process.env.EXPO_PUBLIC_BACKEND_URL!, {
  fetch: {
    credentials: "include"
  }
})
