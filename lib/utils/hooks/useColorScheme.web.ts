<<<<<<< HEAD
import { useEffect, useState } from "react"
import { useColorScheme as useRNColorScheme } from "react-native"

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  const colorScheme = useRNColorScheme()

  if (hasHydrated) {
    return colorScheme
  }

  return "light"
}
=======
import { useEffect, useState } from "react"
import { useColorScheme as useRNColorScheme } from "react-native"

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  const colorScheme = useRNColorScheme()

  if (hasHydrated) {
    return colorScheme
  }

  return "light"
}
>>>>>>> 22703bd7fa6ddb9c5f3446763a1797c3b2ec69d8
