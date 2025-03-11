import { ThemedView } from "@/components/ui/ThemedView"
import React, { useState } from "react"
import {
  Button,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native"

export function FindUserModalButton() {
  const [modalVisible, setModalVisible] = useState(false)
  const [searchText, setSearchText] = useState("")

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

  // Function to close modal if overlay is clicked
  const closeModal = () => {
    setModalVisible(false)
  }

  return (
    <View style={styles.container}>
      {/* Main Button that triggers the modal */}
      <Button title="Open Modal" onPress={toggleModal} />

      {/* Modal used as a portal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <ThemedView style={styles.modalContainer}>
                {/* Modal Close Button */}
                <Button title="Close" onPress={toggleModal} />

                {/* Search Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Search..."
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </ThemedView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  overlay: {
    flex: 1,
    justifyContent: "end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
    paddingBottom: 96
  },
  modalContainer: {
    width: 300,
    padding: 20,
    borderRadius: 8,
    alignItems: "center"
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 4
  }
})
