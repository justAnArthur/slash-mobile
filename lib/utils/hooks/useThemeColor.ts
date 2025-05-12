<<<<<<< HEAD
/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Themes } from "@/lib/a11y/themes"
import { useColorScheme } from "@/lib/utils/hooks/useColorScheme"

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Themes.light & keyof typeof Themes.dark
) {
  const theme = useColorScheme() ?? "light"
  const colorFromProps = props[theme]

  if (colorFromProps) return colorFromProps

  return Themes[theme][colorName]
}
=======
/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Themes } from "@/lib/a11y/themes"
import { useColorScheme } from "@/lib/utils/hooks/useColorScheme"

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Themes.light & keyof typeof Themes.dark
) {
  const theme = useColorScheme() ?? "light"
  const colorFromProps = props[theme]

  if (colorFromProps) return colorFromProps

  return Themes[theme][colorName]
}
>>>>>>> 22703bd7fa6ddb9c5f3446763a1797c3b2ec69d8
