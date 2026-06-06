import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Mobile from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import {DrawerActions, useNavigation, useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import ImageSlider from './imageSlider';
import ImageContainer from './ImageContainer';


function Home(props) {


  const navigation = useNavigation();
  const route = useRoute();
  const [email, setEmail] = useState('');
  const userToken = route.params?.token || ''
  console.log(props);
  const [userData, setUserData] = useState('');

  
  function signOut(){
    AsyncStorage.setItem('isLoggedIn','');
    AsyncStorage.setItem('token','');
    navigation.navigate("LoginUser")
  
  }

  const handleLogout = async (navigation) => {
    try {
      // Eliminar los datos de sesión almacenados
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      // Regresar a la pantalla de inicio de sesión
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  console.log(userToken)

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
// 
const obtenerNombreUsuario = (email) => {
  const partesEmail = email.split('@');
  return partesEmail[0];
};

const nombreUsuario = obtenerNombreUsuario(email);


useEffect(() => {
  getData();
}, []);

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
   
  }

  const handlePress = () => {
    // Llamando a ambas funciones
    toggleModal();
    signOut();
    handleLogout();
  };


  useEffect(() => {
    getData();
  }, []);

return (

  <ScrollView 
  contentContainerStyle={{flexGrow: 1}}
  showsVerticalScrollIndicator={false}
  style={{backgroundColor: 'white'}}
  >
    <View>
    {/* <View style={{position: 'relative', marginTop:'4%', marginBottom:'-3%'}}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}>
            <Mobile name="menu" size={30} color="#ce112d" />
          </TouchableOpacity>
  
        </View> */}

        <View style={{marginTop:'-1%', paddingRight:-20}}>
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
          marginTop: '10%'
          }}>
        <Text style={styles.text_header}>Bienvenido 
        <Text  style={styles.nombreUsuario} > {nombreUsuario}</Text>
        </Text>
        </View>

      <View style={{
        marginTop: 2
      }}> 
        <ImageSlider></ImageSlider>
      </View>
      <View style={{
        marginTop: 8,
        marginLeft: 15,
      }}>
        <Text style={{
          fontSize: 17,
          fontWeight: "700"
        }}> 
          Mis reportes
          </Text>
      </View>
      <View style={{
        marginStart: 330,

        marginBottom: -10
      }}>
          <TouchableOpacity
              onPress={() => {
                navigation.navigate('Seemore');
              }}
              >
                <Text style={{
                   fontSize: 12,
                   color: "#ce112d"
                }}>Ver mas</Text>
              
            </TouchableOpacity>
        </View>
        </View>
      <View>



{/* Contenedor de imagenes */}
        <ImageContainer/>


      </View>
      <View style={styles.button}>
        <TouchableOpacity 
        style={styles.inBut} 
        onPress={() => {
          navigation.navigate('AddReportScreen', { token: userToken });
        }}
        >
          <View>
            <Text style={styles.textSign}>Agregar reporte</Text>
          </View>
        </TouchableOpacity>
      </View>
    
  </ScrollView>
);
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
text_header2: {
  color: '#FFFFFF',
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

export default Home