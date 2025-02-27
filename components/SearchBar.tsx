import React, { useState } from "react"
import { StyleSheet } from "react-native"

import { ThemedView } from "./ThemedView"
import { ThemedInput } from "./ui/ThemedInput"
export function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (text: string) => {
    setSearchQuery(text)
    onSearch(text)
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedInput
        style={styles.input}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10
  }
})
