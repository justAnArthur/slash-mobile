<<<<<<< HEAD
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs"
import { PlatformPressable } from "@react-navigation/elements"
import * as Haptics from "expo-haptics"

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === "ios") {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
        props.onPressIn?.(ev)
      }}
    />
  )
}
=======
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs"
import { PlatformPressable } from "@react-navigation/elements"
import * as Haptics from "expo-haptics"

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === "ios") {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
        props.onPressIn?.(ev)
      }}
    />
  )
}
>>>>>>> 22703bd7fa6ddb9c5f3446763a1797c3b2ec69d8
