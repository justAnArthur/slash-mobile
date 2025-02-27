import type { Translations } from "@/lib/i18n/en.json"

const sk: Translations = {
  welcome: "Ahoj",

  common: {
    error: "Chyba",
    locales: {
      en: "Angličtina",
      sk: "Slovenčina"
    },
    themes: {
      light: "Svetlý",
      dark: "Tmavý"
    }
  },
  screens: {
    index: {
      settings: "Nastavenia"
    },
    chats: {
      input: {
        placeholder: "Napíšte správu",
        send: "Odoslať"
      }
    },
    signIn: {
      title: "Prihlásiť sa",
      email: "Email",
      password: "Heslo",
      submit: "Odoslať",
      noAccount: "Nemáte účet?",
      signUp: "Zaregistrujte sa",
      error: "Pri prihlasovaní došlo k chybe"
    },
    signUp: {
      title: "Zaregistrujte sa",
      name: "Meno",
      email: "Email",
      password: "Heslo",
      submit: "Odoslať",
      haveAccount: "Už máte účet?",
      signIn: "Prihlásiť sa",
      error: "Pri registrácii došlo k chybe"
    },
    settings: {
      title: "Nastavenia",
      logOut: "Odhlásiť sa"
    }
  }
}

export default sk
