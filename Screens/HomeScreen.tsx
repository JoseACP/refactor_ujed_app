import {
    StyleSheet,
    Text,
    View,
    Button,
    ScrollView,
    TouchableOpacity,
    Image,
  } from 'react-native';
 
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import Home from '../Components/Home'

  import Modal from "react-native-modal";
  import {DrawerActions, useNavigation, useRoute} from '@react-navigation/native';
  import { FontAwesome6 } from '@expo/vector-icons';
  import {useEffect, useState} from 'react';
  import axios from 'axios';
import ImageSlider from '../Components/imageSlider';
import ImageContainer from '../Components/ImageContainer';
import Obras from '../Components/Obras';
import Mantenimiento from '../Components/Mantenimiento';

// import styles from './Login&Register/style'
  function HomeScreen(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const userToken = route.params?.token || ''
    const [email, setEmail] = useState('');
    const [rol, setRol] = useState('');
    const [userRoles, setUserRoles] = useState([]);

    useEffect(() => {
      // Función para obtener los roles del usuario desde AsyncStorage
      const getUserRolesFromStorage = async () => {
        try {
          const rolesString = await AsyncStorage.getItem('userRoles');
          if (rolesString) {
            const roles = JSON.parse(rolesString);
            setUserRoles(roles);
            console.log('User Roles:', roles); // Agregar console.log para ver los roles en la consola
          }
        } catch (error) {
          console.error('Error al obtener roles desde AsyncStorage:', error);
        }
      };
  
      // Llamar a la función para obtener los roles del usuario al cargar la pantalla
      getUserRolesFromStorage();
    }, []); // El segundo argumento del useEffect es un array vacío para que se ejecute solo una vez al cargar la pantalla
  
    console.log(props);
  
    useEffect(() => {
      getRol();
    }, []);
  
    async function getRol() {
      try {
        const userRoles = await AsyncStorage.getItem('userRoles');
        setEmail(userRoles);
        console.log(userRoles)
      } catch (error) {
        console.error('Error al obtener el email:', error);
      }
    }

    function renderComponentByRole(roles) {
      if (roles.includes('mantenimiento')) {
        return <Mantenimiento />;
      } else if (roles.includes('obras')) {
        return <Obras />;
      } else {
        return <Home />;
      }
    }
  
    return (

      
      <>
        
        {renderComponentByRole(userRoles)}
      </>
    );
  }
  
  
  export default HomeScreen;