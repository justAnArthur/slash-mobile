import { ThemedButton } from "@/components/ui/ThemedButton"
import { ThemedText } from "@/components/ui/ThemedText"
import { locales, useI18n } from "@/lib/i18n/Context"
import { StyleSheet, View } from "react-native"

export const LanguageSwitcher = () => {
  const { currentLocale, setCurrentLocale, i18n } = useI18n()

  return (
    <View style={styles.container}>
      <ThemedText style={styles.header}>
        Current Locale: {currentLocale}
      </ThemedText>
      <View style={styles.buttonContainer}>
        {locales.map((locale) => (
          <ThemedButton
            key={locale}
            title={i18n.t(`common.locales.${locale}`)}
            onPress={() => setCurrentLocale(locale)}
            style={{ flex: 1 }}
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
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 8
  },
  sampleText: {
    fontSize: 16
  }
})
