import { FindUserModalButton } from "@/components/screens/chats/FindUserModal"
import { ThemedLink } from "@/components/ui/ThemedLink"
import { ThemedView } from "@/components/ui/ThemedView"
import Octicons from "@expo/vector-icons/Octicons"
import { usePathname } from "expo-router"
import type { Href } from "expo-router/build/types"
import React, { type ReactNode } from "react"
import { StyleSheet } from "react-native"

const navigation = {
  "/": [
    {
      selected: true,
      name: "Home",
      href: "/",
      children: <Octicons name="home" size={24} />
    },
    {
      name: "Chats",
      href: "/chats",
      children: <Octicons name="archive" size={24} />
    },
    {
      name: "Settings",
      href: "/settings",
      children: <Octicons name="gear" size={24} />
    }
  ],

  "/chats": [
    {
      name: "Back",
      href: "/",
      children: <Octicons name="arrow-left" size={24} />
    },
    {
      selected: true,
      name: "Chats",
      href: "/chats",
      children: <Octicons name="archive" size={24} />
    },
    {
      name: "Add",
      component: FindUserModalButton,
      children: <Octicons name="plus" size={24} color="white" />
    }
  ]
} as {
  [key: string]: ({
    name: string
    selected?: boolean
    children?: ReactNode
  } & (
    | {
        href: Href
      }
    | {
        component: string
      }
  ))[]
}

export function Navigation() {
  const pathname = usePathname()

  const currentNavigation = navigation[pathname]

  return (
    <ThemedView style={[styles.container]}>
      {currentNavigation?.map((navigation) => {
        if ("href" in navigation)
          return (
            <ThemedLink
              key={navigation.name}
              href={navigation.href}
              defaultStyles
              style={[styles.item, navigation.selected && styles.itemSelected]}
            >
              {navigation.children ?? navigation.name}
            </ThemedLink>
          )

        if ("component" in navigation) {
          const Component = navigation.component
          return (
            // @ts-ignore
            <Component
              key={navigation.name}
              style={[styles.item, navigation.selected && styles.itemSelected]}
            >
              {navigation.children ?? navigation.name}
            </Component>
          )
        }
      })}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    left: "50%",
    transform: "translate(-50%)",
    position: "absolute",
    bottom: 12,
    flexDirection: "row",

    boxShadow:
      "inset 2px 4px 16px 0 hsla(0,0%,97%,.06),0 24px 24px -16px rgba(5,5,5,.09),0 6px 13px 0 rgba(5,5,5,.1),0 6px 4px -4px rgba(5,5,5,.1),0 5px 1.5px -4px rgba(5,5,5,.25)",
    display: "flex",
    gap: 8,
    padding: 8,
    backgroundColor: "rgba(40,40,40,0.7)",
    shadowColor: "rgba(5,5,5,0.1)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 13,
    elevation: 5,
    borderRadius: 20
  },
  item: {
    backgroundColor: "transparent",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "hsla(0,0%,97%,.7)",
    borderRadius: 12,
    width: 44,
    height: 44
  },
  itemSelected: {
    backgroundColor: "hsla(0,0%,97%,.1)"
  }
})
