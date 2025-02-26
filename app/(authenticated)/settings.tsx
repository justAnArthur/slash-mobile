import { Collapsible } from "@/components/Collapsible"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { ThemedButton } from "@/components/ui/ThemedButton"
import { ThemedLink } from "@/components/ui/ThemedLink"
import { ThemeSwitcher } from "@/lib/a11y/ThemeSwitcher"
import { authClient } from "@/lib/auth"
import { useI18nT } from "@/lib/i18n/Context"
import { LanguageSwitcher } from "@/lib/i18n/LanguageSwitcher"
import AntDesign from "@expo/vector-icons/AntDesign"
import { useRouter } from "expo-router"
import { useState } from "react"
import { StyleSheet } from "react-native"

export default function SettingsModal() {
  const t = useI18nT("screens.settings")

  return (
    <ThemedView style={styles.content}>
      <ThemedView style={styles.header}>
        <ThemedLink href="/" style={{ alignSelf: "flex-start", flexShrink: 1 }}>
          <AntDesign name="arrowleft" size={24} />
        </ThemedLink>

        <ThemedText type="title">{t("title")}</ThemedText>
      </ThemedView>

      <Collapsible title="i18n">
        <LanguageSwitcher />
      </Collapsible>
      <Collapsible title="i11y">
        <ThemeSwitcher />
        {/*<ContrastSwitcher />*/}
      </Collapsible>

      <LogOutButton />
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
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 18
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  }
})
