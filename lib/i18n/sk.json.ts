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
    },
    totp: {
      setup: "Nastaviť TOTP",

      "2fa": "Dvojfaktorová Autentifikácia",
      setup_in_app:
        "Kliknutím na tlačidlo nastavíte TOTP v aplikácii Authenticator",
      click_me: "Klikni na mňa!",
      enter_code_in_app:
        "Alebo zadajte tento kód do aplikácie autentifikátora:",

      copied: "Skopírované!",
      enter_code: "Zadajte TOTP kód",
      verify: "Overiť TOTP",
      app_not_found: "Aplikácia nenájdená",
      please_install:
        "Prosím, nainštalujte aplikáciu autentifikátora. Váš tajný kód je: ",
      please_install_suffix:
        ". Otvorte aplikáciu autentifikátora, vyberte 'Zadať nastavovací kľúč' a vložte ho.",
      error: {
        code: "Prosím, zadajte TOTP kód.",
        verify: "Overenie TOTP zlyhalo. Skúste to znova."
      },
      already: "Dvojfaktorová autentifikácia je už nastavená!",
      turn_off: "Vypnúť",
      back: "Späť"
    }
  }
}

export default sk
