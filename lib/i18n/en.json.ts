const en = {
  welcome: "Hello",

  common: {
    error: "Error",
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
    }
  }
}

export type Translations = typeof en

export default en
