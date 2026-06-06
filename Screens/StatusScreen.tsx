import {
    StyleSheet,
    Text,
    View,
    Button,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    SafeAreaView,
    Alert,
    Dimensions
} from 'react-native';
import React, { useState, useEffect }  from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import TrackingScreen from '../Components/TrackingScreen';
import { Ionicons, AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageSlider from '../Components/imageSlider';
import Modal from "react-native-modal";
import axios from 'axios';

function StatusScreen() {
    
    const route = useRoute();
    const navigation = useNavigation();
    const [token, setToken] = useState(null);
    const [formattedDate, setFormattedDate] = useState('');

    const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };


    const handleDelete = async () => {
        try {
            const { itemId } = route.params;
            if (!token) {
                console.error('No se ha obtenido ningún token.');
                return;
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.delete(`https://ujed-api.onrender.com/api/reports/${itemId}`, config);
            // Manejar el éxito de la eliminación, por ejemplo, mostrar una alerta
            Alert.alert('Éxito', 'El elemento ha sido eliminado correctamente.');
            navigation.navigate('HomeScreen')
            // Puedes navegar a otra pantalla o realizar otras acciones después de la eliminación
        } catch (error) {
            // Manejar errores en la solicitud de eliminación
            console.error('Error al eliminar el elemento:', error);
            // Mostrar una alerta u otras acciones en caso de error
            Alert.alert('Error', 'Ocurrió un error al intentar eliminar el elemento.');
        }
    };
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', options);
      }
    

    useEffect(() => {
        // Función para obtener el token almacenado en AsyncStorage
        async function getTokenFromStorage() {
          try {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken !== null) {
              setToken(storedToken);
              console.log('Token almacenado en AsyncStorage:', storedToken);
            }else{
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
        const { itemId, imageUrl, estado, description, ubicacion, title, fecha } = route.params;
        console.log('Fecha sin formato:', fecha);
        setFormattedDate(formatDate(fecha));
        console.log('Fecha formateada:', formattedDate);
      
        console.log('ID:', itemId);
        console.log('Titulo', title)
        console.log('URL de la imagen:', imageUrl);
        console.log('Estado:', estado);
        console.log('Descripcion:', description);
        console.log('Ubicación', ubicacion);
        console.log('Fecha', fecha);
      
        // Dividir la información de ubicación antes y después del guion "-"
        // const ubicacionParts = ubicacion.split(' - ');
       
       
      }, []);
      
  return (
        <ScrollView showsVerticalScrollIndicator={false}>
          
            <View style={{position: 'relative' , marginTop:'1%'}}>
            <TouchableOpacity
                        style={styles.backIcon}
                        onPress={()=> navigation.goBack()}
                    >
                        <AntDesign name="arrowleft" size={30} color="#ce112d" />
                    </TouchableOpacity>
             
            </View>
          <View style={{ flex: 1 }}>
             

              <Modal isVisible={isModalVisible}>
                  <View style={{ flex: 1 }}>
                      <View style={styles.delete}>
                          <Text style={{ color: 'white', fontSize: 31, fontWeight: 'bold' }}>¿Estas seguro de borrar este reporte?</Text>
                          <View style={{ flexDirection: 'row', marginTop: '10%'}}>
                              <TouchableOpacity style={{ marginRight: '40%' }} onPress={handleDelete}>
                              <Feather name="check" size={40} color="white" />
                              </TouchableOpacity>
                              <TouchableOpacity
                              onPress={toggleModal}
                              >
                              <Feather name="x" size={40} color="white" />
                              </TouchableOpacity>
                          </View>
                          {/* <Button title="Hide modal" onPress={toggleModal} /> */}
                      </View>


                  </View>
              </Modal>
          </View>
            
            <View style={{
                    alignItems: 'center',
                    marginTop: '8%'
                }}>
                    <Text style={styles.text_header}>Información del reporte </Text>
                </View>
            
                <View
            style={{
                marginTop:13,
                padding: 12
                
            }}
            >
                <Text style={styles.text1}>Título: </Text>
                <Text style={{marginTop: 3}}>{route.params.title}</Text>

            </View>
            <View
            style={{
                marginTop:13,
                padding: 12
                
            }}
            >
                <Text style={styles.text1}>Ubicación</Text>
                <Text style={{marginTop: 3}}>Facultad: {route.params.ubicacion.faculty} </Text>
                <Text style={{marginTop: 3}}>Edicificio: {route.params.ubicacion.building} </Text>
                <Text style={{marginTop: 3}}>Salon: {route.params.ubicacion.classroom} </Text>
                

            </View>
            <View
            style={{
                marginTop:1,
                padding: 12
            }}
            >
                <Text style={styles.text1}>Descripción: </Text>
                <Text style={{marginTop: 3}}>{route.params.description}</Text>
            </View>
            <View
             style={{
                marginTop:1,
                padding: 12
            }}
            >
                <Text style={styles.text1}>Fecha: </Text>
                <Text style={{marginTop: 3}}>{formattedDate}</Text>
            </View>
            
            <View>
                <TrackingScreen estado={route.params.estado}/>
            </View>
            <View 
            style={{
                marginTop: 20,
                alignItems: 'center'
            }}
            >
                <Image source={{ uri: route.params.imageUrl}} style={styles.image} />
            </View>

          {/* Botones */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '10%',paddingHorizontal: 44 }}>
              <TouchableOpacity style={[styles.button, styles.inBut]} onPress={toggleModal}>
                  <Feather name="trash" size={50} color="white" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.inBut, { marginLeft: -20 }]} onPress={toggleModal}>
              <Feather name="upload" size={50} color="white" />
              </TouchableOpacity>
          </View>

          {/* end Botones */}

          {/* //      */}
      </ScrollView>
  );
    }

    const styles = StyleSheet.create({
        delete:{
            backgroundColor:'#920A0A', 
            marginTop:'70%', 
            height:'30%', 
            borderRadius:20, 
            width:'98%',
            padding: 30,
            alignItems: 'center'

            
        },
        editIcon: {
            zIndex: 1,
            color: 'white',
            position: 'absolute',
            right: 2,
            margin: 15,
        },
        button: {
            alignItems: 'center',
            marginTop: -20,
            alignItems: 'center',
            textAlign: 'center',
            margin: 20,
        },
        logoContainer: {
            marginBottom: -12,
            justifyContent: 'center',
            alignItems: 'center',
          },
          logo: {
            height: 260,
            width: 260,
            marginTop: 50,
            marginBottom:40,
          },
        backIcon: {
            zIndex: 1,
            color: 'white',
            position: 'absolute',
            left: 2,
            margin: 15,
        },
        avatar: {
            borderRadius: 100,
            marginTop: -250,
            // marginLeft: 105,
            backgroundColor: 'white',
            height: 200,
            width: 200,
            padding: 10,
            borderColor: '#ccc',
            borderWidth: 1,
            elevation: 4,
            justifyContent: 'center',
            alignItems: 'center',
        },
        // 420475
        nameText: {
            color: 'black',
            fontSize: 28,
    
            fontStyle: 'normal',
            fontFamily: 'Open Sans',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        bookCountMain: {
            borderColor: '#b0b0b0',
            borderWidth: 1,
            marginTop: 18,
            marginHorizontal: 20,
    
            borderRadius: 20,
            flexDirection: 'row',
            width: '88%',
        },
        bookCount: {
            width: '50%',
            borderColor: '#b0b0b0',
            borderRightWidth: 1,
            flexDirection: 'column',
            paddingHorizontal: 10,
            paddingVertical: 15,
            justifyContent: 'center',
            alignItems: 'center',
        },
        bookCountNum: {
            color: '#5D01AA',
            fontSize: 34,
            fontWeight: '800',
        },
        bookCountText: { color: '#b3b3b3', fontSize: 14, fontWeight: '500' },
        infoMain: {
            marginTop: 10,
        },
        infoCont: {
            width: '100%',
            flexDirection: 'row',
        },
        infoIconCont: {
            justifyContent: 'center',
            height: 40,
            width: 40,
            borderRadius: 20,
    
            alignItems: 'center',
            elevation: -5,
            borderColor: 'black',
            backgroundColor: 'black',
        },
    
        infoText: {
            width: '80%',
            flexDirection: 'column',
            marginLeft: 25,
            borderBottomWidth: 1,
            paddingBottom: 10,
            borderColor: '#e6e6e6',
        },
        infoSmall_Text: {
            fontSize: 13,
            color: '#b3b3b3',
            fontWeight: '500',
        },
        infoLarge_Text: {
            color: 'black',
            fontSize: 18,
            fontWeight: '600',
        },
        booksUploadedMain: {
            paddingHorizontal: 10,
            paddingBottom: 30,
            marginTop: 20,
        },
        flatlistDiv: {
            borderRadius: 15,
            paddingHorizontal: 10,
        },
        booksUploadedText: {
            fontSize: 26,
            color: 'black',
            fontWeight: '700',
            paddingLeft: 20,
            paddingBottom: 8,
        },
        booksUploadedCard: {
            flexDirection: 'row',
            width: '100%',
            marginTop: 9,
            marginBottom: 9,
    
            backgroundColor: '#f2f2f2',
            paddingHorizontal: 15,
            paddingVertical: 15,
            borderRadius: 15,
            elevation: 3,
        },
        booksUploadedImgDiv: {
            width: '28%',
        },
        booksUploadedImg: {
            width: '100%',
            height: 120,
            borderRadius: 15,
        },
        cardMidDiv: {
            paddingHorizontal: 10,
            width: '55%',
            position: 'relative',
        },
        approvedText: {
            fontSize: 12,
            color: '#0d7313',
            fontWeight: '600',
            marginLeft: 5,
        },
        cardBookNameText: {
            fontSize: 24,
            color: 'black',
            fontWeight: '700',
            marginTop: 2,
        },
        cardBookAuthor: {
            fontSize: 14,
            color: 'black',
            fontWeight: '600',
            marginTop: 1,
        },
        cardRating: {
            position: 'absolute',
            bottom: 0,
            paddingHorizontal: 10,
            flexDirection: 'row',
        },
        cardRatingCount: {
            fontSize: 14,
            marginTop: -2,
            paddingLeft: 4,
            color: '#303030',
        },
        cardEditDiv: {
            width: '17%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        cardEditBtn: {
            height: 44,
            width: 44,
            backgroundColor: '#ce112d',
            borderRadius: 22,
            justifyContent: 'center',
            alignItems: 'center',
        },
        footer: {
            padding: 10,
            justifyContent: 'center',
    
            flexDirection: 'row',
        },
        loadMoreBtn: {
            padding: 10,
            backgroundColor: '#ce112d',
            borderRadius: 4,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            paddingHorizontal: 20,
        },
        btnText: {
            color: 'white',
            fontSize: 15,
            textAlign: 'center',
            fontWeight: '600',
        },
        text_header: {
            color: '#000000',
            fontWeight: 'bold',
            fontSize: 20,
            margin: 15
        },
        button: {
            alignItems: 'center',
            marginTop: -20,
            alignItems: 'center',
            textAlign: 'center',
            margin: 20,
        },
        inBut: {
            width: '25%',
            backgroundColor: '#ce112d',
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingVertical: 15,
            borderRadius: 10,
        },
        textSign: {
            fontSize: 18,
            fontWeight: 'bold',
            color: 'white',
        },
        text_container: {
            marginTop: 20,
            marginLeft: 5,
            flexDirection: 'row',
            alignItems: 'center', // Alinea verticalmente los elementos en el centro
        },
        text1: {
            fontSize: 17,
            fontWeight: '700',
        },
        text2: {
            fontSize: 14, // Ajusta el tamaño del segundo texto
            color: 'blue', // Cambia el color a azul
            marginLeft: 10, // Añade un espacio entre los textos
        },
        loginContainer: {
            marginTop: 2,
            // backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingHorizontal: 50,
            paddingVertical: 40,
            margin: 15
        },
        textInput: {
            flex: 4,
            marginTop: -12,
            color: '#000000',
    
        },
        action: {
            flexDirection: 'row',
            paddingTop: 14,
            paddingBottom: 3,
            marginTop: 30,
    
            paddingHorizontal: 10,
    
            borderWidth: 1,
            borderColor: '#ce112d',
            borderRadius: 50,
        },
        image: {
            width: 220,
            height: 150,
            borderRadius: 8,
            marginBottom: 8, // Espaciado entre la imagen y el título
          },
    });
  

export default StatusScreen