import { buttonStyles } from "@/components/ui/ThemedButton"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { Link, type LinkProps } from "expo-router"

export const ThemedLink = ({
  style,
  defaultStyles,
  ...props
}: LinkProps & { defaultStyles?: boolean }) => {
  const { currentThemeMode } = useTheme()
  const isDarkMode = currentThemeMode === "dark"

  return (
    <Link
      {...props}
      style={[
        !defaultStyles && buttonStyles.button,
        isDarkMode && buttonStyles.buttonDark,
        style
      ]}
    >
      {props.children}
    </Link>
  )
}
