import { FindUserModalButton } from "@/components/screens/chats/SearchAndCreateChat"
import { ThemedView } from "@/components/ui/ThemedView"
import { useTheme } from "@/lib/a11y/ThemeContext"
import Octicons from "@expo/vector-icons/Octicons"
import { Link, usePathname } from "expo-router"
import type { Href } from "expo-router/build/types"
import React, { type ReactNode } from "react"
import { type OpaqueColorValue, StyleSheet, View } from "react-native"

const navigation = (textColor: string | OpaqueColorValue) =>
  ({
    "/": [
      {
        selected: true,
        name: "Home",
        href: "/",
        children: <Octicons name="home" size={24} color={textColor} />
      },
      {
        name: "Chats",
        href: "/chats",
        children: <Octicons name="archive" size={24} color={textColor} />
      },
      {
        name: "Settings",
        href: "/settings",
        children: <Octicons name="gear" size={24} color={textColor} />
      },
      {
        name: "Push",
        href: "/push",
        children: <Octicons name="bell" size={24} color={textColor} />
      }
    ],

    "/chats": [
      {
        name: "Back",
        href: "/",
        children: <Octicons name="arrow-left" size={24} color={textColor} />
      },
      {
        selected: true,
        name: "Chats",
        href: "/chats",
        children: <Octicons name="archive" size={24} color={textColor} />
      },
      {
        name: "Add",
        component: FindUserModalButton,
        children: <Octicons name="plus" size={24} color={textColor} />
      }
    ],

    "/settings": [
      {
        name: "Back",
        href: "/",
        children: <Octicons name="arrow-left" size={24} color={textColor} />
      },
      {
        selected: true,
        name: "Settings",
        href: "/settings",
        children: <Octicons name="gear" size={24} color={textColor} />
      }
    ]
  }) as {
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

  const styles = useStyles()

  const { theme } = useTheme()
  const currentNavigation = navigation(theme.primaryForeground)[pathname]

  if (!currentNavigation) return null

  return (
    <ThemedView style={styles.container}>
      {currentNavigation?.map((navigation) => {
        if ("href" in navigation)
          return (
            <Link key={navigation.name} href={navigation.href}>
              <View
                style={[
                  styles.item,
                  navigation.selected && styles.itemSelected
                ]}
              >
                {navigation.children ?? navigation.name}
              </View>
            </Link>
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

function useStyles() {
  const { theme, isDarkMode } = useTheme()

  return StyleSheet.create({
    container: {
      backgroundColor: theme.primary,
      boxShadow: isDarkMode
        ? "inset 2px 4px 16px 0 hsla(0,0%,97%,.06)"
        : "0 24px 24px -16px rgba(5,5,5,.09),0 6px 13px 0 rgba(5,5,5,.1),0 6px 4px -4px rgba(5,5,5,.1),0 5px 1.5px -4px rgba(5,5,5,.25)",

      left: "50%",
      transform: "translate(-50%)",
      position: "absolute",
      bottom: 12,
      flexDirection: "row",
      width: "auto",

      display: "flex",
      gap: 8,
      padding: 8,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 13,
      elevation: 5,
      borderRadius: 20
    },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      width: 44,
      height: 44
    },
    itemSelected: {
      backgroundColor: theme.primarySecondary
    }
  })
}
