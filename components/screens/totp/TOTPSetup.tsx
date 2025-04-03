import { ThemedButton } from "@/components/ui/ThemedButton"
import { ThemedInput } from "@/components/ui/ThemedInput"
import { ThemedText } from "@/components/ui/ThemedText"
import { backend } from "@/lib/services/backend"
import { useTheme } from "@/lib/a11y/ThemeContext"
import React, { useState } from "react"
import {
  View,
  Image,
  Platform,
  TouchableOpacity,
  Alert,
  Linking,
  StyleSheet
} from "react-native"
import * as Clipboard from "expo-clipboard"
import { useBackend } from "@/lib/services/backend/use"
import { ThemedActivityIndicator } from "@/components/ui/ThemedActivityIndicator"
import { useI18nT } from "@/lib/i18n/Context"

type TOTPSecret = {
  qrCodeUrl: string
  otpauthUrl: string
  secret: string
}
export default function TOTPSetup() {
  const t = useI18nT("screens.totp")
  const [totpSecret, setTotpSecret] = useState<TOTPSecret>({
    qrCodeUrl: "",
    otpauthUrl: "",
    secret: ""
  })
  const [totpCode, setTotpCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [isTurnedOn, setIsTurnedOn] = useState(false)
  const [turnOff, setTurnOff] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const styles = useStyles()

  const { loading } = useBackend(() => backend.users.totp.check.get(), [], {
    transform: (res) => {
      setIsTurnedOn(res.status === 200)
    }
  })
  const setupTOTP = async () => {
    try {
      const data = await backend.users.totp.setup.post().then((res) => res.data)
      setTotpSecret(data)
      setErrorMessage("")
    } catch (error) {
      console.error("TOTP setup failed:", error)
      setErrorMessage(t("error.verify"))
    }
  }

  const verifyTOTP = async () => {
    if (!isValidCode(totpCode)) {
      setErrorMessage(t("error.code"))
      return
    }

    try {
      const data = await backend.users.totp.setup
        .post({ token: totpCode, secret: totpSecret.secret })
        .then((res) => res.data)

      if (data.success) {
        setIsTurnedOn(true)
        setErrorMessage("")
      }
    } catch (error) {
      console.error("TOTP verification failed:", error)
      setErrorMessage(t("error.code"))
    } finally {
      setTotpCode("")
    }
  }
  const turnOffTOTP = async () => {
    if (!isValidCode(totpCode)) {
      setErrorMessage(t("error.code"))
      return
    }

    try {
      const data = await backend.users.totp.unset
        .post({ token: totpCode })
        .then((res) => res.data)

      if (data.success) {
        setIsTurnedOn(false)
        setTurnOff(false)
        setErrorMessage("")
        setTotpCode("")
      }
    } catch (error) {
      console.error("TOTP turn off failed:", error)
      setErrorMessage(t("error.code"))
    }
  }

  const handleLinkPress = async () => {
    try {
      const supported = await Linking.canOpenURL(totpSecret.otpauthUrl)
      if (supported) {
        await Linking.openURL(totpSecret.otpauthUrl)
      } else {
        Alert.alert(
          t("app_not_found"),
          t("please_install") + totpSecret.secret + t("please_install_suffix")
        )
      }
    } catch (error) {
      console.error("Link handling failed:", error)
      setErrorMessage(t("error.verify"))
    }
  }

  const handleCopySecret = async () => {
    await Clipboard.setStringAsync(totpSecret.secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderLoading = () => (
    <View style={styles.container}>
      <ThemedActivityIndicator size="large" />
    </View>
  )
  const renderEnabledState = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="defaultSemiBold" style={styles.text}>
          {t("already")}
        </ThemedText>
        <ThemedButton
          title={t("turn_off")}
          style={styles.button}
          onPress={() => setTurnOff(true)}
        />
      </View>
    </View>
  )
  const renderTurnOff = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <TOTPForm
          totpCode={totpCode}
          setTotpCode={setTotpCode}
          errorMessage={errorMessage}
          onSubmit={turnOffTOTP}
          buttonTitle={t("turn_off")}
        />
      </View>
    </View>
  )

  const renderSetup = () => (
    <View style={styles.container}>
      {!totpSecret.qrCodeUrl ? (
        <ThemedButton
          title={t("setup")}
          onPress={setupTOTP}
          style={styles.button}
        />
      ) : (
        <View style={styles.content}>
          {Platform.OS === "web" ? (
            <>
              <Image
                source={{ uri: totpSecret.qrCodeUrl }}
                style={styles.qrCodeImage}
                contentFit="contain"
              />
            </>
          ) : (
            <>
              <ThemedText style={styles.text}>{t("setup_in_app")}</ThemedText>
              <ThemedButton
                onPress={handleLinkPress}
                style={[styles.button]}
                title={t("click_me")}
              />
            </>
          )}

          <ThemedText style={[styles.instructionText, styles.text]}>
            {/*Or enter this code in an Authenticator app:*/}
            {t("enter_code_in_app")}
          </ThemedText>
          <TouchableOpacity onPress={handleCopySecret}>
            <ThemedText style={[styles.secretText, styles.text]}>
              {copied ? t("copied") : totpSecret.secret}
            </ThemedText>
          </TouchableOpacity>
          <TOTPForm
            totpCode={totpCode}
            setTotpCode={setTotpCode}
            errorMessage={errorMessage}
            onSubmit={verifyTOTP}
            buttonTitle={t("verify")}
          />
        </View>
      )}
    </View>
  )
  if (loading) return renderLoading()
  if (turnOff) return renderTurnOff()
  if (isTurnedOn) return renderEnabledState()
  return renderSetup()
}

const isValidCode = (code: string): boolean => code.length === 6

type TOTPFormProps = {
  totpCode: string
  setTotpCode: (code: string) => void
  errorMessage: string
  onSubmit: () => void
  buttonTitle: string
}
export const TOTPForm: React.FC<TOTPFormProps> = ({
  totpCode,
  setTotpCode,
  errorMessage,
  onSubmit,
  buttonTitle
}) => {
  const t = useI18nT("screens.totp")
  const styles = StyleSheet.create({
    text: {
      textAlign: "center"
    },

    input: {
      width: "100%",
      maxWidth: 300,
      borderWidth: 1.5,
      padding: 12
    },

    button: {
      width: "100%",
      maxWidth: 300,
      padding: 12
    }
  })
  return (
    <>
      <ThemedText style={styles.text}>{t("enter_code")}</ThemedText>
      <ThemedInput
        value={totpCode}
        onChangeText={setTotpCode}
        keyboardType="numeric"
        style={styles.input}
        maxLength={6}
        autoFocus={true}
      />
      <ThemedButton
        title={buttonTitle}
        style={styles.button}
        onPress={onSubmit}
      />
      <ThemedText>{errorMessage}</ThemedText>
    </>
  )
}
function useStyles() {
  const { theme } = useTheme()
  return StyleSheet.create({
    container: {
      padding: 24,
      alignItems: "center",
      justifyContent: "center"
    },
    content: {
      width: "100%",
      alignItems: "center",
      gap: 18
    },
    qrCodeImage: {
      width: 200,
      height: 200,
      borderRadius: 12,
      borderWidth: 1.5
    },
    linkContainer: {
      padding: 12,
      borderRadius: 12,
      borderWidth: 1.5
    },
    text: {
      textAlign: "center"
    },
    instructionText: {
      fontSize: 14
    },
    secretText: {
      fontSize: 12,
      fontWeight: "bold",
      padding: 8,
      borderRadius: 8,
      overflow: "hidden"
    },
    input: {
      width: "100%",
      maxWidth: 300,
      borderWidth: 1.5,
      padding: 12
    },
    button: {
      width: "100%",
      maxWidth: 300,
      padding: 12
    }
  })
}
