import React, { useState, useEffect } from 'react';
import {
  Button,
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import styles from './styleA';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import axios from 'axios';
import { SelectList } from 'react-native-dropdown-select-list'


function MapaA() {
    const navigation = useNavigation();
  const route = useRoute();
  return (
    <View style={styles.logoContainer}>
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Mapa', {
          selectedDescription,
          updateSelectedDescription: setSelectedDescription,
        });
      }}
    >
      <Image
        style={styles.logo}
        source={require('./images/ANTIGUA FAC DE ENFERMERIA PLANTA ALTA-2.png')}
      />
    </TouchableOpacity>
  </View>
  )
}

export default MapaA
