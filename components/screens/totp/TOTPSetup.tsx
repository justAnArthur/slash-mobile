import React, { useState, useEffect } from "react"
import { View, Linking, StyleSheet, Alert } from "react-native"
import { useI18nT } from "@/lib/i18n/Context"
import { authClient } from "@/lib/auth"
import { ThemedActivityIndicator } from "@/components/ui/ThemedActivityIndicator"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedButton } from "@/components/ui/ThemedButton"
import { ThemedInput } from "@/components/ui/ThemedInput"
import { useTheme } from "@/lib/a11y/ThemeContext"
import ConfirmationModal from "../common/ConfirmationModal"
import * as Clipboard from "expo-clipboard"

export default function TOTPSetup() {
  const t = useI18nT("screens.totp")
  const { data: session } = authClient.useSession()
  const [is2FAEnabled, setIs2FAEnabled] = useState(
    session?.user.twoFactorEnabled || false
  )
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState("")
  const [totpCode, setTotpCode] = useState("")
  const [enableData, setEnableData] = useState<
    Awaited<ReturnType<typeof authClient.twoFactor.enable>>
  >({
    backupCodes: [],
    totpURI: ""
  })
  const [showTurnOffForm, setShowTurnOffForm] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)
  const styles = useStyles()

  useEffect(() => {
    setLoading(false)
  }, [is2FAEnabled])

  const setupTOTP = async () => {
    if (!password) {
      setErrorMessage(t("error.password_required"))
      return
    }
    setLoading(true)
    const response = await authClient.twoFactor
      .enable({ password })
      .catch((err) => {
        console.error(err)
        setErrorMessage(t("error.network"))
      })
      .finally(() => setLoading(false))

    if (!response) return
    if (response.error) {
      console.error("TOTP setup failed:", response.error)
      setErrorMessage(t("error.verify"))
    } else {
      setEnableData(response.data)
    }
  }

  const verifyTOTP = async () => {
    if (!isValidCode(totpCode)) {
      setErrorMessage(t("error.code"))
      return
    }
    try {
      setLoading(true)
      await authClient.twoFactor.verifyTotp({ code: totpCode })
      setShowBackupCodes(true)
      setErrorMessage("")
    } catch (error) {
      console.error("TOTP verification failed:", error)
      setErrorMessage(t("error.code"))
    } finally {
      setLoading(false)
      setTotpCode("")
    }
  }
  const handleContinue = () => {
    setShowConfirmationModal(true)
  }

  const confirmContinue = () => {
    setShowConfirmationModal(false)
    setIs2FAEnabled(true)
    setShowBackupCodes(false)
    setEnableData({ backupCodes: [], totpURI: "" }) // Reset data
  }
  const turnOffTOTP = async () => {
    try {
      setLoading(true)
      await authClient.twoFactor.disable({ password })
      setIs2FAEnabled(false)
      setShowTurnOffForm(false)
      setErrorMessage("")
    } catch (error) {
      console.error("TOTP disable failed:", error)
      setErrorMessage(t("error.verify"))
    } finally {
      setLoading(false)
      setPassword("")
    }
  }

  const handleLinkPress = async () => {
    try {
      const supported = await Linking.canOpenURL(enableData.totpURI)
      if (supported) await Linking.openURL(enableData.totpURI)
    } catch (error) {
      console.error("Link handling failed:", error)
      setErrorMessage(t("error.verify"))
    }
  }
  const copyBackupCodes = async () => {
    const codesText = enableData.backupCodes.join("\n")
    await Clipboard.setStringAsync(codesText)
    setShowCopiedMessage(true)
    setTimeout(() => setShowCopiedMessage(false), 2000)
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
          onPress={() => setShowTurnOffForm(true)}
        />
      </View>
    </View>
  )

  const renderTurnOffForm = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.text}>{t("enter_password")}</ThemedText>
        <ThemedInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <ThemedButton
          title={t("turn_off")}
          style={styles.button}
          onPress={turnOffTOTP}
        />
        {errorMessage && (
          <ThemedText style={styles.error}>{errorMessage}</ThemedText>
        )}
      </View>
    </View>
  )

  const renderSetupForm = () => (
    <View style={styles.container}>
      {!enableData.totpURI ? (
        <View style={styles.content}>
          <ThemedText style={styles.text}>{t("enter_password")}</ThemedText>
          <ThemedInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <ThemedButton
            title={t("setup")}
            style={styles.button}
            onPress={setupTOTP}
          />
          <ThemedText style={styles.error}>{errorMessage}</ThemedText>
        </View>
      ) : !showBackupCodes ? (
        <View style={styles.content}>
          <ThemedText style={styles.text}>{t("setup_in_app")}</ThemedText>
          <ThemedButton
            onPress={handleLinkPress}
            style={styles.button}
            title={t("click_me")}
          />
          <TOTPForm
            totpCode={totpCode}
            setTotpCode={setTotpCode}
            errorMessage={errorMessage}
            onSubmit={verifyTOTP}
            buttonTitle={t("verify")}
          />
        </View>
      ) : (
        <View style={styles.content}>
          <ThemedText style={[styles.instructionText, styles.text]}>
            {t("backup_codes")}
          </ThemedText>
          {enableData.backupCodes.map((code, index) => (
            <ThemedText key={index} style={styles.text}>
              {code}
            </ThemedText>
          ))}
          {showCopiedMessage && (
            <ThemedText style={styles.message}>{t("copied")}</ThemedText>
          )}
          <ThemedButton
            title={t("copy_all")}
            style={styles.button}
            onPress={copyBackupCodes}
          />
          <ThemedButton
            title={t("finish")}
            style={styles.button}
            onPress={handleContinue}
          />
        </View>
      )}
    </View>
  )

  if (loading) return renderLoading()
  if (showTurnOffForm) return renderTurnOffForm()
  if (is2FAEnabled) return renderEnabledState()
  return (
    <>
      {renderSetupForm()}
      <ConfirmationModal
        title={t("save_codes_warning")}
        visible={showConfirmationModal}
        onConfirm={confirmContinue}
        onCancel={() => setShowConfirmationModal(false)}
      />
    </>
  )
}

export const isValidCode = (code: string): boolean => code.length === 6

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
  const styles = useStyles()
  return (
    <View style={styles.content}>
      <ThemedText style={styles.text}>{t("enter_code")}</ThemedText>
      <ThemedInput
        value={totpCode}
        onChangeText={setTotpCode}
        keyboardType="numeric"
        style={styles.input}
        maxLength={6}
      />
      <ThemedButton
        title={buttonTitle}
        style={styles.button}
        onPress={onSubmit}
      />
      {errorMessage && (
        <ThemedText style={styles.error}>{errorMessage}</ThemedText>
      )}
    </View>
  )
}

function useStyles() {
  const { theme } = useTheme()
  return StyleSheet.create({
    container: {
      padding: 24,
      alignItems: "center",
      justifyContent: "center",
      flex: 1
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
    },
    error: {
      color: "red",
      textAlign: "center"
    },
    message: {
      color: "green",
      textAlign: "center"
    }
  })
}
