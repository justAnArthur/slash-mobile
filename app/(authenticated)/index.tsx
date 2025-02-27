import { HelloWave } from "@/components/HelloWave"
import ParallaxScrollView from "@/components/ParallaxScrollView"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { ThemedLink } from "@/components/ui/ThemedLink"
import { authClient } from "@/lib/auth"
import { useI18n } from "@/lib/i18n/Context"
import { backend } from "@/lib/services/backend"
import { useEffect, useState } from "react"
import { Image, StyleSheet } from "react-native"

export default function HomeScreen() {
  const { i18n } = useI18n()

  const { data: session } = authClient.useSession()

  const [welcomeFromBackend, setWelcomeFromBackend] = useState<null | string>(
    null
  )

  useEffect(() => {
    backend.secured
      .get()
      .then((res) => res.data)
      .then(setWelcomeFromBackend)
  }, [])

  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ fontFamily: "JetBrainsMono" }}>
            {i18n.t("welcome")} {welcomeFromBackend} {session?.user.name}
          </ThemedText>
          <HelloWave />
        </ThemedView>

        <ThemedLink
          href="/settings"
          style={{
            fontSize: 16,
            fontWeight: "bold",
            alignSelf: "flex-start"
          }}
        >
          Settings
        </ThemedLink>

        <ThemedLink
          href="/(authenticated)/chats/test"
          style={{
            fontSize: 16,
            fontWeight: "bold",
            alignSelf: "flex-start"
          }}
        >
          Test chat
        </ThemedLink>
      </ParallaxScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute"
  }
})
