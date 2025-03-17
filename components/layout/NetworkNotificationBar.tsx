import { useTheme } from "@/lib/a11y/ThemeContext"
import { useI18nT } from "@/lib/i18n/Context"
import { type NetworkState, useNetworkState } from "expo-network"
import { useEffect, useRef, useState } from "react"
import { StyleSheet, Text, View } from "react-native"

export function NetworkNotificationBar() {
  const networkState = useNetworkState()
  const previousNetworkState = useRef<NetworkState | undefined>()

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (
      previousNetworkState.current?.isConnected &&
      networkState.isConnected !== previousNetworkState.current.isConnected
    ) {
      setIsOpen(true)

      const timeout = setTimeout(() => setIsOpen(false), 2000)
      return () => clearTimeout(timeout)
    }

    previousNetworkState.current = networkState
  }, [networkState.isConnected])

  const t = useI18nT("common.network")

  const styles = useStyles()

  if (isOpen)
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {networkState.isInternetReachable ? t("online") : t("offline")}
        </Text>
      </View>
    )
}

function useStyles() {
  const { theme } = useTheme()

  return StyleSheet.create({
    container: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      backgroundColor: theme.primary
    },
    text: {
      color: theme.primaryForeground,
      textAlign: "center"
    }
  })
}
