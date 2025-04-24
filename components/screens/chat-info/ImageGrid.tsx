import React from "react"
import { FlatList, StyleSheet, View, Dimensions } from "react-native"
import { Image } from "expo-image"

// Get screen width for responsive column sizing
const { width } = Dimensions.get("window")
// Account for margins (5 + 5), borders (1 + 1), and parent padding
const imageSize = (width - 10 - 6 - 10 - 80) / 3 // Subtract parent padding (5+5), borders (3*2), margins (5+5)
const itemSize = imageSize + 10 + 2 // Margins (5+5) + borders (1+1)

const ImageGrid = ({ images }) => {
  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        contentFit="contain"
        loading="lazy"
      />
    </View>
  )

  // Optimize FlatList for fixed-size items
  const getItemLayout = (data, index) => ({
    length: itemSize,
    offset: itemSize * Math.floor(index / 3),
    index
  })

  return (
    <FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.list}
      initialNumToRender={6}
      windowSize={5}
      getItemLayout={getItemLayout}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    padding: 5
  },
  imageContainer: {
    margin: 5,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 10
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: 8
  }
})

export default ImageGrid
