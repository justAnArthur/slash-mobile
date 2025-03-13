import { ThemedButton } from "@/components/ui/ThemedButton"
import { ThemedText } from "@/components/ui/ThemedText"
import { themeModes, useTheme } from "@/lib/a11y/ThemeContext"
import { useI18nT } from "@/lib/i18n/Context"
import { StyleSheet, View } from "react-native"

export const ThemeSwitcher = () => {
  const t = useI18nT("common.themes")
  const { currentThemeMode, setCurrentThemeMode } = useTheme()

  return (
    <View style={styles.container}>
      <ThemedText style={styles.header}>
        Current theme mode: {currentThemeMode}
      </ThemedText>
      <View style={styles.buttonContainer}>
        {themeModes.map((themeMode) => (
          <ThemedButton
            key={themeMode}
            title={t(themeMode)}
            onPress={() => setCurrentThemeMode(themeMode)}
            style={{ flex: 1, width: "auto" }}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  header: {
    fontSize: 18,
    marginBottom: 12
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 8
  },
  sampleText: {
    fontSize: 16
  }
})
