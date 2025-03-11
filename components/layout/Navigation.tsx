import { FindUserModalButton } from "@/components/screens/chats/FindUserModal"
import { ThemedButton, buttonStyles } from "@/components/ui/ThemedButton"
import { ThemedLink } from "@/components/ui/ThemedLink"
import { usePathname } from "expo-router"
import { StyleSheet, View } from "react-native"

const navigation = {
  "/": [
    {
      name: "Home",
      selected: true,
      href: "/"
    },
    {
      name: "Chats",
      href: "/chats"
    },
    {
      name: "Settings",
      href: "/settings"
    }
  ],

  "/chats": [
    {
      name: "Back",
      href: "/"
    },
    {
      name: "Chats",
      href: "/chats"
    },
    {
      name: "Add",
      component: FindUserModalButton
    }
  ]
} as {
  [key: string]: ({
    name: string
  } & (
    | {
        href: string
      }
    | {
        component: string
      }
  ))[]
}

export function Navigation() {
  const pathname = usePathname()

  const currentNavigation = navigation[pathname]

  console.log({ pathname, navigation, currentNavigation })

  return (
    <View style={[buttonStyles.button, styles.container]}>
      {currentNavigation?.map((navigation) => {
        if ("href" in navigation)
          return (
            <ThemedLink key={navigation.href} href={navigation.href}>
              {navigation.name}
            </ThemedLink>
          )

        if ("component" in navigation) {
          const Component = navigation.component
          return (
            <View>
              <Component />
            </View>
          )
        }
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    left: "50%",
    transform: "translate(-50%)",
    position: "absolute",
    bottom: 12,
    flexDirection: "row"
  }
})
