const en = {
  welcome: "Hello",

  common: {
    error: "Error",
    locales: {
      en: "English",
      sk: "Slovak"
    },
    themes: {
      light: "Light",
      dark: "Dark"
    },
    network: {
      offline: "You are offline",
      online: "You are online"
    }
  },
  screens: {
    index: {
      settings: "Settings"
    },
    chats: {
      input: {
        placeholder: "Type a message",
        send: "Send"
      }
    },
    signIn: {
      title: "Sign In",
      email: "Email",
      password: "Password",
      submit: "Submit",
      noAccount: "Don't have an account?",
      signUp: "Sign Up",
      error: "There was an error signing in"
    },
    signUp: {
      title: "Sign Up",
      name: "Name",
      email: "Email",
      password: "Password",
      submit: "Submit",
      haveAccount: "Already have an account?",
      signIn: "Sign In",
      error: "There was an error signing up"
    },
    settings: {
      title: "Settings",
      logOut: "Log Out"
    }
  }
}

export type Translations = typeof en

export default en
