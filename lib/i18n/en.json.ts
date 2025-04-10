const en = {
  welcome: "Hello",

  common: {
    error: "Error",
    ok: "Ok",
    cancel: "Cancel",
    locales: {
      current: "Current locale is: ",
      en: "English",
      sk: "Slovak"
    },
    themes: {
      current: "Current theme is: ",
      light: "Light",
      dark: "Dark"
    },
    network: {
      offline: "You are offline",
      online: "You are online"
    },
    avatar: {
      changeAvatar: "Change Avatar",
      gallery: "Gallery",
      camera: "Camera",
      cancel: "Cancel",
      adjustAvatar: "Adjust Avatar",
      pinchAndDrag: "Pinch to zoom and drag to position",
      confirm: "Confirm",
      processing: "Processing image..."
    },
    profile: {
      bioPlaceholder: "Update your bio (280 characters max)",
      saving: "Saving...",
      save: "Save",
      permissionAlert:
        "Please grant camera and gallery permissions to upload an avatar."
    },
    errors: {
      noUserSession: "No user session",
      updateProfileFailed: "Failed to update profile"
    }
  },
  screens: {
    index: {
      settings: "Settings"
    },
    chats: {
      actions: {
        delete: "Delete",
        pin: "Toggle Pin"
      },
      noChats: "No chats",
      noPinnedChats: "No pinned chats",
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
    },
    totp: {
      setup: "Setup 2-FA",
      "2fa": "Two-Factor Authentication",
      backup_codes:
        "Save backup codes, you can use them in case if you lose your device",
      enter_password: "Enter your password to continue",
      setup_in_app: "Click button to set up TOTP in an Authenticator app",
      click_me: "Click me!",
      enter_code: "Enter the 6-digit code from your authenticator app",
      verify: "Verify",
      error: {
        code: "Invalid code entered",
        verify: "Failed to verify. Please try again."
      },
      already: "Two-factor authentication already set!",
      turn_off: "Turn off",
      back: "Back",
      finish: "Finish",
      copy_all: "Copy",
      copied: "Copied!",
      save_codes_warning:
        "Make sure to save those codes, you won't see them again."
    }
  }
}

export type Translations = typeof en

export default en
