import { authClient } from "@/lib/auth"
import { Redirect, Stack } from "expo-router"
import { Text } from "react-native"

export default function AuthenticatedLayout() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return <Text>Loading...</Text>

  if (!session) return <Redirect href="/sign-in" />

  return <Stack />
}
