import { LanguageModalSwitcher } from "@/app/sign-in/LanguageSwitcherModal"
import { ThemeModalSwitcher } from "@/app/sign-in/ThemeSwitcherModal"
import { ThemedButton } from "@/components/ui/ThemedButton"
import { ThemedInput } from "@/components/ui/ThemedInput"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { authClient } from "@/lib/auth"
import { useI18nT } from "@/lib/i18n/Context"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { ImageBackground, StyleSheet, View } from "react-native"

export default function SignInScreen() {
  const t = useI18nT("screens.signIn")
  const styles = useStyles()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    setLoading(true)

    const res = await authClient.signIn.email(
      {
        email,
        password
      },
      {
        async onSuccess(context) {
          if (context.data.twoFactorRedirect) {
            router.replace("/sign-in/2fa")
          } else {
            router.replace("/")
          }
        }
      }
    )

    if (res.error) setError(JSON.stringify(res.error))
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          {t("title")}
        </ThemedText>

        <ThemedInput
          placeholder={t("email")}
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
        />

        <ThemedInput
          placeholder={t("password")}
          secureTextEntry
          textContentType="password"
          value={password}
          onChangeText={setPassword}
        />

        <ThemedButton
          title={t("submit")}
          style={{ width: "100%" }}
          onPress={handleSignIn}
        />

        {error && (
          <ThemedText>
            {t("error")}
            {/*{": "}*/}
            {/*{error}*/}
          </ThemedText>
        )}
      </View>

      <ThemedText style={styles.anotherOption}>
        {t("noAccount")}{" "}
        <ThemedText type="link" onPress={() => router.replace("/sign-up")}>
          {t("signUp")}
        </ThemedText>
      </ThemedText>

      <View style={styles.settings}>
        <LanguageModalSwitcher />
        <ThemeModalSwitcher />
      </View>

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

function useStyles() {
  const { theme, isDarkMode } = useTheme()

  return StyleSheet.create({
    title: {
      fontSize: 32,
      fontWeight: "bold",
      lineHeight: 32,
      textAlign: "center"
    },
    container: {
      padding: 24,
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 18
    },
    content: {
      flex: 1,
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 18
    },
    settings: {
      display: "flex",
      flexDirection: "row",
      gap: 16
    },
    backgroundGradient: {
      display: isDarkMode ? "flex" : "none",
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
}

export const useSignInStyles = useStyles
