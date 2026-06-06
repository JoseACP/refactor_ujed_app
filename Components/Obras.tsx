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
} from 'react-native';
import React from 'react'
import {Avatar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Check from 'react-native-vector-icons/Feather';
import Back from 'react-native-vector-icons/Ionicons';
import Gender from 'react-native-vector-icons/Foundation';
import Mobile from 'react-native-vector-icons/Entypo';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import Modal from "react-native-modal";
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageSlider from '../Components/imageSlider';
import ImageContainer from '../Components/obras/imageContainer';
import ImageContainerf from '../Components/obras/imageContainerf';
function Obras(props) {

  const navigation = useNavigation();
  console.log(props);
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState('');

  useEffect(() => {
    getEmail();
  }, []);

  async function getEmail() {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      setEmail(userEmail);
      console.log(userEmail)
    } catch (error) {
      console.error('Error al obtener el email:', error);
    }
  }

  function signOut(){
    AsyncStorage.setItem('isLoggedIn','');
    AsyncStorage.setItem('token','');
    navigation.navigate("LoginUser")
  
  }

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);

    
  };

  const handlePress = () => {
    // Llamando a ambas funciones
    toggleModal();
    signOut();
  };


  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    
  }

  const obtenerNombreUsuario = (email) => {
    const partesEmail = email.split('@');
    return partesEmail[0];
  };

  const nombreUsuario = obtenerNombreUsuario(email);


  useEffect(() => {
    getData();
  }, []);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
        <View>

          <View style={{marginTop:'3%', paddingRight:-20}}>
        <TouchableOpacity
            style={[styles.backIcon, {marginTop:'6%', marginStart:'82%'}]}
            onPress={() => {
              navigation.navigate('Profile');
            }}
            >
             <Image
          source={{ uri: 'https://imgs.search.brave.com/cuFuXnr6J9ok7BFdN3oK62Pp_g_QoVjqUPzv1VBrjdw/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL3RodW1icy81/ODVlNGJmM2NiMTFi/MjI3NDkxYzMzOWEu/cG5n' }}
          style={{width:40,
          height:40}}
        />
          </TouchableOpacity>
  
        </View>
       

          {/* END MODAL */}
          <View style={{
            alignItems: 'center',
            marginTop: 40
            }}>
          <Text style={styles.text_header}>Bienvenido 
          <Text  style={styles.nombreUsuario} > {nombreUsuario}</Text>
          </Text>
          </View>

          <View style={{
            marginTop: 8,
            marginLeft: 15,
            marginBottom:3
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: "500"
            }}> 
              Reportes de obras
              </Text>
          </View>
           <View style={{
            marginStart: 330,

            marginBottom: -3
          }}>
            </View>
            </View>
          <View>
            <ImageContainer/>
          </View>
          
      </ScrollView>
  )
}

const styles = StyleSheet.create({
  nombreUsuario: {
    color: '#ce112d'
  },
    editIcon: {
      zIndex: 1,
      color: 'white',
      position: 'absolute',
      right: 2,
      margin: 15,
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
    bookCountText: {color: '#b3b3b3', fontSize: 14, fontWeight: '500'},
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
      fontSize: 30,
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
        width: '70%',
        backgroundColor: '#ce112d',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 50,
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
  });

export default Obras