
import React from 'react';
import { View, FlatList, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

const GridComponent = ({ data, onItemClick }) => {
  const displayedData = data.slice(0, 4);
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onItemClick(item)}>
      <View style={styles.item}>
        <Image source={{ uri: item.imageUri }} style={styles.image} />
        {/* <Text style={styles.title}>{item.title}</Text> */}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={displayedData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    marginBottom: 19,
    // padding:2,
    alignContent: 'space-between'
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    // marginBottom: 2,
    padding: 7
  },
  image: {
    width: 170,
    height: 150,
    borderRadius: 8,
    marginBottom: 8, // Espaciado entre la imagen y el título
  },
  title: {
    fontSize: 16,
  },
});

export default GridComponent; 
