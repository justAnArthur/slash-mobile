import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { ThemedButton } from "@/components/ui/ThemedButton"
import { ThemedInput } from "@/components/ui/ThemedInput"
import { authClient } from "@/lib/auth"
import { useI18nT } from "@/lib/i18n/Context"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ImageBackground, StyleSheet } from "react-native"

export default function SignInScreen() {
  const t = useI18nT("screens.signIn")
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    setLoading(true)

    const res = await authClient.signIn.email({
      email,
      password
    })

    if (res.error) setError(JSON.stringify(res.error))
    else router.replace("/")

    setLoading(false)
  }

  return (
    <ThemedView style={styles.content}>
      <ThemedText type="title" style={styles.title}>
        {t("title")}
      </ThemedText>

      <ThemedInput
        placeholder={t("email")}
        value={email}
        onChangeText={setEmail}
      />

      <ThemedInput
        placeholder={t("password")}
        value={password}
        onChangeText={setPassword}
      />

      <ThemedButton title={t("submit")} onPress={handleSignIn} />

      {error && (
        <ThemedText>
          {t("common.error", { absolute: true })}
          {": "}
          {error}
        </ThemedText>
      )}

      <ThemedText style={styles.anotherOption}>
        {t("noAccount")}{" "}
        <ThemedText type="link" onPress={() => router.replace("/sign-up")}>
          {t("signUp")}
        </ThemedText>
      </ThemedText>

      {/*absolute abstract images*/}
      <ImageBackground
        source={require("@/assets/images/bg-entry.webp")}
        style={styles.backgroundGradient}
      />
      <ImageBackground
        source={require("@/assets/images/stars.svg")}
        style={styles.backgroundStars}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
    textAlign: "center"
  },
  content: {
    padding: 24,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 18
  },
  backgroundGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: -1
  },
  backgroundStars: {
    position: "absolute",
    width: "100%",
    height: "60%",
    transform: [{ translateY: -60 }],
    top: 0,
    left: 0,
    zIndex: -1
  },
  anotherOption: {
    textAlign: "center"
  }
})

export const signInStyles = styles
