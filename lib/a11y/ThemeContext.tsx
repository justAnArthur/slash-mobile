import { Themes } from "@/lib/a11y/themes"
import { getItem, setItem } from "@/lib/utils/secure-store"
import { StatusBar } from "expo-status-bar"
import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState
} from "react"
import { View } from "react-native"

export const themeModes = ["light", "dark"] as const

export type AvailableThemeMode = (typeof themeModes)[number]

const ThemeContext = createContext<{
  currentThemeMode: AvailableThemeMode
  setCurrentThemeMode: (theme: AvailableThemeMode) => void
  theme: (typeof Themes)[AvailableThemeMode]

  isDarkMode: boolean
  isHighContrast: boolean
  setHighContrast: (isHighContrast: boolean) => void
  // @ts-ignore
}>(null)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const storedTheme = useMemo(() => getItem("theme"), [])
  const defaultTheme = useMemo(() => {
    if (storedTheme && themeModes.includes(storedTheme as any))
      return storedTheme as AvailableThemeMode
    return "dark"
  }, [])

  const [currentThemeMode, setCurrentThemeMode] =
    useState<AvailableThemeMode>(defaultTheme)

  const storedContrast = useMemo(() => {
    return getItem("contrast") === "true"
  }, [])
  const [isHighContrast, setHighContrast] = useState(storedContrast || false)

  function handleSetCurrentThemeMode(theme: AvailableThemeMode) {
    setCurrentThemeMode(theme)
    setItem("theme", theme)
  }

  function handleSetHighContrast(isHighContrast: boolean) {
    setHighContrast(isHighContrast)
    setItem("contrast", isHighContrast.toString())
  }

  const theme = !isHighContrast ? Themes[currentThemeMode] : Themes.contrast

  return (
    <ThemeContext.Provider
      value={{
        currentThemeMode,
        setCurrentThemeMode: handleSetCurrentThemeMode,
        isDarkMode: currentThemeMode === "dark",
        isHighContrast,
        setHighContrast: handleSetHighContrast,
        theme
      }}
    >
      <StatusBar
        style={currentThemeMode === "dark" ? "light" : "dark"}
        backgroundColor={theme.background}
        translucent={false}
      />

      <View style={{ flex: 1, backgroundColor: theme.background }}>
        {children}
      </View>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

export function useOverrideThemeColor(
  color: keyof (typeof Themes)[AvailableThemeMode],
  override?: { light?: string; dark?: string }
) {
  const { currentThemeMode, theme } = useTheme()

  return override?.[currentThemeMode] ?? theme[color]
}
