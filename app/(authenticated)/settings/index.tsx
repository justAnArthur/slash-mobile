import { Collapsible } from "@/components/Collapsible"
import { UpdateUserInfo } from "@/components/screens/common/UpdateUserInfo"
import TOTPSetup from "@/components/screens/totp/TOTPSetup"
import { ThemedButton } from "@/components/ui/ThemedButton"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { ThemeSwitcher } from "@/lib/a11y/ThemeSwitcher"
import { authClient } from "@/lib/auth"
import { useI18nT } from "@/lib/i18n/Context"
import { LanguageSwitcher } from "@/lib/i18n/LanguageSwitcher"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ScrollView, StyleSheet } from "react-native"

export default function SettingsModal() {
  const t = useI18nT("screens.settings")

  return (
    <ThemedView style={styles.content}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">{t("title")}</ThemedText>
        </ThemedView>

        <Collapsible title="Profile">
          <UpdateUserInfo />
        </Collapsible>
        <Collapsible title="2-FA">
          <TOTPSetup />
        </Collapsible>
        <Collapsible title="i18n">
          <LanguageSwitcher />
        </Collapsible>
        <Collapsible title="i11y">
          <ThemeSwitcher />
          {/*<ContrastSwitcher />*/}
        </Collapsible>
        <LogOutButton />
      </ScrollView>
    </ThemedView>
  )
}

function LogOutButton() {
  const router = useRouter()

  const { data: session, isPending } = authClient.useSession()

  const t = useI18nT("screens.settings")

  const [loading, setLoading] = useState(false)

  async function handleSignOut() {
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

  if (isPending || !session) return null

  return (
    <ThemedButton
      title={t("logOut")}
      onPress={handleSignOut}
      disabled={loading}
    />
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
    gap: 16,
    marginBottom: 50
  },
  header: {
    marginBottom: 16
  }
})
