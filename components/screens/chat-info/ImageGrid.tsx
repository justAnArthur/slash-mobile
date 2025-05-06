import React from "react"
import { Dimensions, FlatList, StyleSheet, View } from "react-native"
import { Image } from "expo-image"

const { width } = Dimensions.get("window")

const imageSize = (width - 10 - 6 - 10 - 80) / 3
const itemSize = imageSize + 10 + 2

export type ImageItem = { id: string; image: string }

const ImageGrid = ({ images }: { images: ImageItem[] }) => {
  const renderItem = ({ item }: { item: ImageItem }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        contentFit="contain"
      />
    </View>
  )

  const getItemLayout = (_: any, index: number) => ({
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
