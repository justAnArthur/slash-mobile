import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { useEffect, useMemo, useRef, useState } from "react"
import { registerForPushNotificationsAsync } from "@/lib/push/register-4-push-notifications"
import { backend } from "@/lib/services/backend"
import { StyleSheet, Text, View } from "react-native"
import { useTheme } from "@/lib/a11y/ThemeContext"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
})

export const HandlePushNotifications = () => {
  const styles = useStyles()

  const [pushToken, setPushToken] = useState<undefined | string>()

  const notificationListener = useRef<Notifications.EventSubscription>()
  const responseListener = useRef<Notifications.EventSubscription>()

  const deviceInfo = useMemo(
    () => ({
      brand: Device.brand,
      model: Device.modelName,
      osName: Device.osName,
      osVersion: String(Device.osVersion),
      deviceName: Device.deviceName,
      deviceYear: String(Device.deviceYearClass)
    }),
    []
  )

  useEffect(() => {
    if (pushToken) return

    registerForPushNotificationsAsync()
      .then((pushToken) => {
        if (!pushToken) return

        return backend.users.device
          .put({ ...deviceInfo, pushToken })
          .then(() => setPushToken(pushToken))
          .catch(console.error)
      })
      .catch(console.error)

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(notification)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response)
      })

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        )
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Expo token: {pushToken}</Text>
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
