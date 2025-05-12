import type { Translations } from "@/lib/i18n/en.json"

const sk: Translations = {
  welcome: "Ahoj",

  common: {
    error: "Chyba",
    ok: "Ok",
    cancel: "Zrušiť",
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
      actions: {
        delete: "Vymazať",
        pin: "Pripnúť"
      },
      noChats: "Žiadne chaty",
      noPinnedChats: "Žiadne pripnuté chaty",
      input: {
        placeholder: "Napíšte správu",
        send: "Odoslať"
      },
      card: {
        no_messages: "Zatiaľ žiadne správy",
        IMAGE: "Obrázok",
        LOCATION: "Pozícia"
      }
    },
    chatInfo: {
      title: "Informácie o chate",
      details: "Detaily",
      name: "Meno",
      createdAt: "Vytvorené",
      totalMessages: "Celkový počet správ",
      totalAttachments: "Celkový počet príloh",
      attachments: "Prilohy",
      noAttachments: "Žiadne prílohy"
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
      error: "Pri registrácii došlo k chybe",
      INVALID_EMAIL: "Email je neplatný",
      PASSWORD_TOO_SHORT: "Heslo je príliš krátke",
      fill_all_fields: "Prosím, vyplňte všetky polia"
    },
    settings: {
      title: "Nastavenia",
      logOut: "Odhlásiť sa"
    },
    totp: {
      setup: "Nastaviť TOTP",

      "2fa": "Dvojfaktorová Autentifikácia",
      backup_codes:
        "Uložte záložné kódy, môžete ich použiť v prípade straty zariadenia",
      setup_in_app:
        "Kliknutím na tlačidlo nastavíte TOTP v aplikácii Authenticator",
      click_me: "Klikni na mňa!",
      enter_password: "Pre pokračovanie zadajte svoje heslo",
      enter_code: "Zadajte TOTP kód",
      verify: "Overiť TOTP",
      error: {
        code: "Prosím, zadajte TOTP kód.",
        verify: "Overenie TOTP zlyhalo. Skúste to znova."
      },
      already: "Dvojfaktorová autentifikácia je už nastavená!",
      turn_off: "Vypnúť",
      back: "Späť",
      finish: "Ukončiť",
      copy_all: "Kopírovať",
      copied: "Skopírované!",
      save_codes_warning: "Nezabudnite tieto kódy uložiť, už ich neuvidíte."
    }
  }
}

export default sk
