import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { useTheme } from "@/lib/a11y/ThemeContext"
import { useI18n } from "@/lib/i18n/Context"
import { Checkbox } from "expo-checkbox"
import { StyleSheet, View } from "react-native"

export const ContrastSwitcher = () => {
  const { i18n } = useI18n()
  const { isHighContrast, setHighContrast } = useTheme()

  return (
    <View style={styles.container}>
      <ThemedText style={styles.header}>Contrast</ThemedText>
      <Checkbox
        style={styles.checkbox}
        value={isHighContrast}
        onValueChange={setHighContrast}
        color={isHighContrast ? "#4630EB" : undefined}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center"
  },
  header: {
    fontSize: 18,
    marginBottom: 12
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 12
  },
  sampleText: {
    fontSize: 16
  },
  checkbox: {
    margin: 8
  }
})
