import type { Translations } from "@/lib/i18n/en.json"

const sk: Translations = {
  welcome: "Ahoj",

  common: {
    error: "Chyba",
    locales: {
      current: "Aktuálny jazyk: ",
      en: "Angličtina",
      sk: "Slovenčina"
    },
    themes: {
      current: "Aktuálna téma: ",
      light: "Svetlý",
      dark: "Tmavý"
    },
    network: {
      offline: "Ste offline",
      online: "Ste online"
    },
    avatar: {
      changeAvatar: "Zmeniť avatar",
      gallery: "Galéria",
      camera: "Kamera",
      cancel: "Zrušiť",
      adjustAvatar: "Upraviť avatar",
      pinchAndDrag: "Štipnite pre priblíženie a potiahnite pre umiestnenie",
      confirm: "Potvrdiť",
      processing: "Spracovanie obrázka..."
    },
    profile: {
      bioPlaceholder: "Aktualizujte svoj životopis (max. 280 znakov)",
      saving: "Ukladá sa...",
      save: "Uložiť",
      permissionAlert:
        "Prosím, povoľte prístup ku kamere a galérii na nahratie avataru."
    },
    errors: {
      noUserSession: "Žiadna používateľská relácia",
      updateProfileFailed: "Nepodarilo sa aktualizovať profil"
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
