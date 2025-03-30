import { signInStyles } from "@/app/sign-in"
import { ThemedButton } from "@/components/ui/ThemedButton"
import { ThemedInput } from "@/components/ui/ThemedInput"
import { ThemedText } from "@/components/ui/ThemedText"
import { ThemedView } from "@/components/ui/ThemedView"
import { authClient } from "@/lib/auth"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ImageBackground } from "react-native"

export default function SignUpScreen() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const handleLSignUp = async () => {
    const res = await authClient.signUp.email({
      email,
      password,
      name
    })

    if (res.error) return

    router.push("/sign-up/additional-info")
  }

  return (
    <ThemedView style={signInStyles.content}>
      <ThemedText type="title" style={signInStyles.title}>
        Sign Up
      </ThemedText>

      <ThemedInput placeholder="Name" value={name} onChangeText={setName} />

      <ThemedInput placeholder="Email" value={email} onChangeText={setEmail} />
      <ThemedInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <ThemedButton title="Sign Up" onPress={handleLSignUp} />

      <ThemedText style={signInStyles.anotherOption}>
        Already have an account?{" "}
        <ThemedText type="link" onPress={() => router.replace("/sign-in")}>
          Sign In
        </ThemedText>
      </ThemedText>

      <ImageBackground
        source={require("@/assets/images/bg-entry.webp")}
        style={signInStyles.backgroundGradient}
      />

      <ImageBackground
        source={require("@/assets/images/stars.svg")}
        style={signInStyles.backgroundStars}
      />
    </ThemedView>
  )
}
