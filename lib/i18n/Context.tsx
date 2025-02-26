import en from "@/lib/i18n/en.json"
import sk from "@/lib/i18n/sk.json"
import { getItem, setItem } from "@/lib/utils/secure-store"
import { getLocales } from "expo-localization"
import { I18n } from "i18n-js"
import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useRef,
  useState
} from "react"

const I18nContext = createContext<{
  currentLocale: string
  setCurrentLocale: (locale: string) => void
  i18n: I18n
  // @ts-ignore
}>(null)

export const locales = ["en", "sk" /*, "ja"*/]

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const usersLanguageCode = useMemo(() => getLocales()[0].languageCode, [])
  const storedLocale = useMemo(() => getItem("locale"), [])
  const defaultLocale = useMemo(() => {
    let _locale = storedLocale || usersLanguageCode
    if (!_locale || !locales.includes(_locale)) _locale = "en"
    return _locale
  }, [])

  const [currentLocale, setCurrentLocale] = useState(defaultLocale)

  const i18n = useRef(
    new I18n(
      {
        en,
        sk
        // ja: { welcome: "こんにちは" } // just for coolness
      },
      { defaultLocale, locale: defaultLocale }
    )
  )

  function handleChangeLocale(locale: string) {
    i18n.current.locale = locale
    setCurrentLocale(locale)
    setItem("locale", locale)
  }

  return (
    <I18nContext.Provider
      value={{
        currentLocale,
        setCurrentLocale: handleChangeLocale,
        i18n: i18n.current
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

export function useI18nT(base: string) {
  const { i18n } = useI18n()
  return (path: string, options?: { absolute?: boolean }) =>
    i18n.t(options?.absolute ? path : `${base}.${path}`)
}
