import { registerForPushNotificationsAsync } from "@/lib/push/register-4-push-notifications"
import * as Notifications from "expo-notifications"
import { useEffect, useMemo, useRef, useState } from "react"
import { Button, View } from "react-native"
import { ThemedText } from "@/components/ui/ThemedText"
import { backend } from "@/lib/services/backend"
import * as Device from "expo-device"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
})

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: `And here is the body! Timestamp: ${new Date().toISOString()}`,
    data: { someData: "goes here" }
  }

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  })
}

export const HandlePushNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState("")
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined)
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
    registerForPushNotificationsAsync()
      .then((pushToken) => {
        if (!pushToken) return

        setExpoPushToken(pushToken ?? "")
        return backend.users.device
          .put({ ...deviceInfo, pushToken })
          .then((data: any) => {
            console.log(JSON.stringify(data))
          })
          .catch(console.error)
      })
      .catch(console.error)

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification)
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
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-around" }}
    >
      <ThemedText>Your Expo push token: {expoPushToken}</ThemedText>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <ThemedText>Title: {notification?.request.content.title} </ThemedText>
        <ThemedText>Body: {notification?.request.content.body}</ThemedText>
        <ThemedText>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </ThemedText>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken)
        }}
      />
    </View>
  )
}
