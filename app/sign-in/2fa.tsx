import { signInStyles } from "@/app/sign-in"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { ImageBackground, StyleSheet, TextInput, View } from "react-native"
import { ThemedButton } from "@/components/ui/ThemedButton"
import { ThemedInput } from "@/components/ui/ThemedInput"
import { authClient } from "@/lib/auth"
import { backend } from "@/lib/services/backend"
import { useI18nT } from "@/lib/i18n/Context"
import { TOTPForm } from "@/components/screens/totp/TOTPSetup"

export default function TwoFA() {
  const t = useI18nT("screens.totp")
  const styles = useStyles()
  const router = useRouter()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const handleBack = async () => {
    setLoading(true)
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // setLoading(false)
          router.replace("/sign-in")
        },
        onError: () => {
          setLoading(false)
        }
      }
    })
  }
  const handleVerify = async () => {
    setError("")

    if (!code || code.length !== 6) {
      setError(t("error.code"))
      return
    }

    setLoading(true)
    backend.users.totp.verify
      .post({ token: code })
      .then((res) => {
        if (res.status === 200) router.replace("/")
        else throw new Error("invalid_code")
      })
      .catch(() => setError(t("error.code")))
      .finally(setLoading(false))
  }
  return (
    <ThemedView style={signInStyles.content}>
      <ThemedText type="title" style={signInStyles.title}>
        {t("2fa")}
      </ThemedText>

      <ImageBackground
        source={require("@/assets/images/bg-entry.webp")}
        style={signInStyles.backgroundGradient}
      />
      <View style={styles.inputContainer}>
        <TOTPForm
          totpCode={code}
          setTotpCode={setCode}
          errorMessage={error}
          onSubmit={handleVerify}
          buttonTitle={t("verify")}
        />
        <ImageBackground
          source={require("@/assets/images/stars.svg")}
          style={signInStyles.backgroundStars}
        />
      </View>
      <ThemedButton
        title={t("back")}
        onPress={handleBack}
        style={styles.input}
      />
    </ThemedView>
  )
}

function useStyles() {
  const { theme } = useTheme()

  return StyleSheet.create({
    inputContainer: {
      alignItems: "center",
      gap: 16,
      padding: 20,
      zIndex: 1
    },
    input: {
      width: "100%",
      maxWidth: 300
    },
    text: {
      textAlign: "center"
    }
  })
}
