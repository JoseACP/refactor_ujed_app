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
import Carousel from 'react-native-snap-carousel';
import * as FileSystem from 'expo-file-system';
import styles from '../Screens/Login&Register/styleA';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import axios from 'axios';
import { SelectList } from 'react-native-dropdown-select-list'

const imgDir = FileSystem.documentDirectory + 'images/';

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};

export default function AddReportScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [token, setToken] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [selected, setSelected] = React.useState("");
  const [selectedB, setSelectedB] = React.useState("");

  const data = [
    { key: '1', value: 'CCH', disabled: true },
    { key: '2', value: 'ECT', disabled: true  },
    { key: '3', value: 'EPD', disabled: true  },
    { key: '4', value: 'EPN', disabled: true },
    { key: '5', value: 'FCFA', disabled: true  },
    { key: '6', value: 'FCE', disabled: true  },
    { key: '7', value: 'FECA', disabled: true  },
    { key: '8', value: 'FCQ', disabled: true  },
    { key: '9', value: 'FADERyCIPOL', disabled: true  },
    { key: '10', value: 'FTS', disabled: true  },
    { key: '11', value: 'ELe', disabled: true  },
    { key: '12', value: 'FCCFyD', disabled: true  },
    { key: '13', value: 'FAEO' },
    { key: '14', value: 'FAMEN', disabled: true  },
    { key: '15', value: 'FAOD', disabled: true  },
    { key: '16', value: 'FPyTCH', disabled: true  },
    { key: '17', value: 'EPEA', disabled: true  },
    { key: '18', value: 'ESM', disabled: true  },
    { key: '19', value: 'FMVZ', disabled: true  },
    { key: '20', value: 'FAZ', disabled: true  },
    { key: '21', value: 'FCB', disabled: true  },
    { key: '22', value: 'FCQ GP', disabled: true  },
    { key: '23', value: 'ELe GP', disabled: true  },
    { key: '24', value: 'FACSA', disabled: true  },
    { key: '25', value: 'FICA', disabled: true  },


  ];



  console.log(selectedDescription)

  useEffect(() => {
    async function getTokenFromStorage() {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken !== null) {
          setToken(storedToken);
          console.log('Token almacenado en AsyncStorage:', storedToken);
        } else {
          console.log('No se encontró ningún token en AsyncStorage.');
        }
      } catch (error) {
        console.error('Error al obtener el token:', error);
      }
    }

    // Llama a la función para obtener el token al montar la pantalla
    getTokenFromStorage();
  }, []);


  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    if (route.params?.selectedDescription) {
      setSelectedDescription(route.params.selectedDescription);
    }
  }, [route.params?.selectedDescription]);

  const loadImages = async () => {
    await ensureDirExists();
    const files = await FileSystem.readDirectoryAsync(imgDir);
    if (files.length > 0) {
      setImages(files.map((f) => imgDir + f));
    }
  };

  const selectImage = async (useLibrary) => {
    let result;
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
      ...(useLibrary ? {} : { cameraType: 'back' })
    };

    if (useLibrary) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(options);
    }

    if (!result.cancelled) {
      saveImage(result.assets[0].uri);
    }
  };
  const saveImage = async (uri) => {
    await ensureDirExists();
    const filename = new Date().getTime() + '.jpeg';
    const dest = imgDir + filename;
    await FileSystem.copyAsync({ from: uri, to: dest });
    setImages([...images, dest]);
  };


  const descriptionString = typeof description === 'string' ? description : description.toString();

  const locations = {
    faculty: selectedB,
    building: selectedDescription,
    classroom: 'a'
  };
  
  const uploadReport = async () => {
    // Construir el objeto de datos a enviar
    const data = new FormData();
    data.append('title', title); // Usamos el valor de selectedDescription para el campo title
    data.append('description', descriptionString);
  
    // Agregar el objeto 'locations' directamente a FormData
    Object.keys(locations).forEach(key => {
      data.append(`location[${key}]`, locations[key]);
    });
  
    images.forEach(image => {
      // Agregamos cada imagen al campo 'files' utilizando su URL local
      data.append('files', {
        uri: image,
        type: 'image/jpeg', // Suponiendo que las imágenes son JPEG
        name: image.split('/').pop() // Nombre de archivo basado en la URL local
      });
    });
  
    // Realizar la solicitud a la API
    try {
      const response = await axios.post('https://ujed-api.onrender.com/api/reports', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Incluir el token de autenticación en el encabezado
        }
      });
      // Manejar la respuesta de la API según sea necesario
      console.log('Respuesta de la API:', response.data);
      // Limpiar el estado después de enviar el reporte
      setSelectedDescription('');
      setDescription('');
      setImages([]);
  
      // Mostrar una alerta o realizar otras acciones después de subir el reporte
      Alert.alert('Reporte subido exitosamente');
    } catch (error) {
      // Manejar errores en la solicitud a la API
      console.error('Error al subir el reporte:', error.response.data.message); // Accede al mensaje de error en 'message'
      // Mostrar una alerta con el mensaje de error proporcionado por la API
      Alert.alert('Error al subir el reporte', error.response.data.message || 'Inténtalo de nuevo más tarde.');
    }
  };
  
  const deleteImage = async (uri) => {
    await FileSystem.deleteAsync(uri);
    setImages(images.filter((i) => i !== uri));
  };

  const deleteAllImages = async () => {
    for (const image of images) {
      await FileSystem.deleteAsync(image);
      navigation.goBack()
    }
    setImages([]); // Limpiar el estado para eliminar todas las imágenes
  };
  
  const handlePress = () => {
    // Llamando a uploadReport y esperando a que se complete
    uploadReport().then(() => {
      // Después de que uploadReport se haya completado, llamar a deleteAllImages
      deleteAllImages();
    }).catch(error => {
      // Manejar cualquier error que pueda ocurrir durante uploadReport
      console.error('Error al subir el reporte:', error);
      // Mostrar una alerta u otras acciones en caso de error
      Alert.alert('Error al subir el reporte. Por favor, inténtalo de nuevo más tarde.');
    });
  };
  
  const renderItem = ({ item }) => {
    const filename = item.split('/').pop();
    return (
      <View style={styles.saveImageV}>
        <View style={{ position: 'relative' }}>
          <Image style={styles.saveImage} source={{ uri: item }} />
          <TouchableOpacity
            style={styles.trashButton}
            onPress={() => {
              deleteImage(item); // Elimina la imagen seleccionada
            }}
          >
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };


  return (
    <SafeAreaView style={{ flex: 1, gap: 20 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: 'white' }}
      >
        <View>
          <View style={{ position: 'relative' }}>
            <TouchableOpacity
              style={styles.backIcon}
              onPress={() => navigation.goBack()}
            >
              <AntDesign name="arrowleft" size={30} color="#ce112d" />
            </TouchableOpacity>
          </View>
          <View style={{
            alignItems: 'center',
            marginTop: 50,
            marginBottom: -30
          }}>
            <Text style={styles.text_header}>Generar reporte </Text>
          </View>

          <View style={[styles.loginContainer, { marginBottom: -4 }]}>
            <Text style={[styles.text1, { marginBottom: 5 }]}>¿Qué paso? (De manera breve)</Text>
            <View style={styles.action2}>
              <TextInput
                placeholder="Titulo"
                style={styles.textInput}
                value={title} // Valor del TextInput se obtiene del estado
                onChangeText={setTitle} // Función para actualizar el estado cuando cambia el texto
              />
            </View>

          </View>

          <View style={[styles.logoContainer, { marginTop: 20 }]}>
            <Text style={[styles.text1, { marginBottom: 20 }]}> ¿En qué facultad te encuentras?</Text>

          </View>

          <View style={{
            paddingHorizontal: 60,
            marginTop: 15
          }}>
            <SelectList
              setSelected={(val) => setSelectedB(val)}
              data={data}
              save="value"
              label="Plantel"
              boxStyles={{
                borderRadius: 5,

              }}
            />
          </View>

          <View style={[styles.logoContainer, {marginTop:'10%'}]}>
           <Text style={styles.text1}>{selectedDescription}</Text>
            
          </View> 

          {/* CARRUSEL */}

          <View>
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
                source={require('../assets/images/ANTIGUA FAC DE ENFERMERIA PLANTA ALTA-1.png')}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.logoContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Mapa2', {
                  selectedDescription,
                  updateSelectedDescription: setSelectedDescription,
                });
              }}
            >
              <Image
                style={styles.logo}
                source={require('../assets/images/ANTIGUA FAC DE ENFERMERIA PLANTA BAJA-1.png')}
              />
            </TouchableOpacity>
          </View>

          </View>

              {/* CARRUSEL */}

          <View style={styles.loginContainer}>
            <Text style={[styles.text1, { marginBottom: 20 }]}>Describe lo que ocurrió</Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Descripción"
                style={styles.textInput}
                value={description} // Valor del TextInput se obtiene del estado
                onChangeText={setDescription} // Función para actualizar el estado cuando cambia el texto
              />
            </View>
          </View>
          <View style={{ marginBottom: 40 }}>
            {/* <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '500' }}>My Images</Text> */}
            <FlatList data={images} renderItem={renderItem} />
            {uploading && (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                ]}
              >
                <ActivityIndicator color="#fff" animating size="large" />
              </View>
            )}
          </View>
          <View style={styles.button}>
            <View style={{
              flexDirection: 'row',
            }}
            >
              <TouchableOpacity
                style={[styles.inBut, { marginRight: 40 }]}
                onPress={() => selectImage(true)}
              >
                <View>
                  <Feather name="folder" size={50} color="white" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.inBut}
                onPress={() => selectImage(false)}
              >
                <View>
                  <Feather name="camera" size={50} color="white" />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.bottomButton}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
              </View>
            </View>
            <TouchableOpacity
              style={styles.inButT}

              onPress={handlePress}
          
            >
              <View>
                <Text style={styles.textSign}>Registrar reporte</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}