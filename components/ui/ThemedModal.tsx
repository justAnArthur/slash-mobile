import { useOverrideThemeColor } from "@/lib/a11y/ThemeContext"
import { Modal, type ModalProps, View, type ViewProps } from "react-native"

export type ThemedModalProps = ModalProps & {
  lightColor?: string
  darkColor?: string
  containerStyle?: ViewProps["style"]
}

export function ThemedModal({
  visible,
  lightColor,
  darkColor,
  containerStyle,
  children,
  ...otherProps
}: ThemedModalProps) {
  const backgroundColor = useOverrideThemeColor("background", {
    light: lightColor,
    dark: darkColor
  })

  return (
    <Modal visible={visible} {...otherProps}>
      <View style={[{ backgroundColor, flex: 1 }, containerStyle]}>
        {children}
      </View>
    </Modal>
  )
}
