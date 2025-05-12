<<<<<<< HEAD
import {
  SymbolView,
  type SymbolViewProps,
  type SymbolWeight
} from "expo-symbols"
import type { StyleProp, ViewStyle } from "react-native"

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "regular"
}: {
  name: SymbolViewProps["name"]
  size?: number
  color: string
  style?: StyleProp<ViewStyle>
  weight?: SymbolWeight
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size
        },
        style
      ]}
    />
  )
}
=======
import {
  SymbolView,
  type SymbolViewProps,
  type SymbolWeight
} from "expo-symbols"
import type { StyleProp, ViewStyle } from "react-native"

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "regular"
}: {
  name: SymbolViewProps["name"]
  size?: number
  color: string
  style?: StyleProp<ViewStyle>
  weight?: SymbolWeight
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size
        },
        style
      ]}
    />
  )
}
>>>>>>> 22703bd7fa6ddb9c5f3446763a1797c3b2ec69d8
