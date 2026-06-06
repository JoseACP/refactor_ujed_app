import React from 'react';
import { View, FlatList, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

const GridComponent = ({ data, onItemClick }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onItemClick(item)}>
      <View style={styles.item}>
        <Image source={{ uri: item.imageUri }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description.length > 50 ? `${item.description.substring(0, 50)}...` : item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    marginBottom: 19,
    // backgroundColor: 'red',
    paddingHorizontal: '70%',
    marginLeft: '-66%'
  },
  item: {
    flexDirection: 'row',
    height: 100,
    width: '320%',
    backgroundColor: '#DDDDDD',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20, // Espaciado entre cada item de la lista
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginLeft: '4%',
    marginRight: 10, // Espaciado entre la imagen y el texto
  },
  textContainer: {
    flex: 1,
    marginLeft: 10, // Espaciado entre la imagen y el texto
  },
  title: {
    fontSize: 16,
    fontWeight:'bold',
    fontFamily:  'system-ui, BlinkMacSystemFont, Roboto,',
    marginTop:'-10%',
    marginBottom: 5, // Espaciado entre los títulos y la descripción
  },
  description: {
    paddingLeft:-9,
    fontSize: 14,
    color: 'gray', // Color opcional para la descripción
  },
});

export default GridComponent;
