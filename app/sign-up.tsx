import { authClient } from "@/lib/auth"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Button, TextInput, View } from "react-native"

export default function SignUpScreen() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    await authClient.signUp.email({
      email,
      password,
      name
    })
    router.push("/")
  }

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ color: "white" }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ color: "white" }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={{ color: "white" }}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  )
}
