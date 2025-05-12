import { useTheme } from "@/lib/a11y/ThemeContext"
import { useSignInStyles } from "@/app/sign-in"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { ImageBackground, StyleSheet, View } from "react-native"
import { ThemedButton } from "@/components/ui/ThemedButton"
import { authClient } from "@/lib/auth"
import { backend } from "@/lib/services/backend"
import { useI18nT } from "@/lib/i18n/Context"
import { isValidCode, TOTPForm } from "@/components/screens/totp/TOTPSetup"

export default function TwoFA() {
  const t = useI18nT("screens.totp")
  const styles = useStyles()
  const signInStyles = useSignInStyles()
  const router = useRouter()
  const [totpCode, setTotpCode] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
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

  const verifyTOTP = async () => {
    if (!totpCode || !isValidCode(totpCode)) {
      setErrorMessage(t("error.code"))
      return
    }

    try {
      setLoading(true)
      const response = await authClient.twoFactor.verifyTotp({
        code: totpCode.trim()
      })

      if (response.error || !response.data) {
        throw new Error(response.error || "Verification failed")
      }

      setErrorMessage("")
      router.replace("/")
    } catch (error) {
      console.error("TOTP verification failed:", error)
      const errorMsg =
        error.message === "Verification failed"
          ? t("error.code")
          : t("error.generic")
      setErrorMessage(errorMsg)
    } finally {
      setLoading(false)
      setTotpCode("")
    }
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
      <TOTPForm
        totpCode={totpCode}
        setTotpCode={setTotpCode}
        errorMessage={errorMessage}
        onSubmit={verifyTOTP}
        buttonTitle={t("verify")}
      />
      <ImageBackground
        source={require("@/assets/images/stars.svg")}
        style={signInStyles.backgroundStars}
      />
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
