const {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} = require('react-native');
import {useNavigation} from '@react-navigation/native';
import styles from './style';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useEffect, useState} from 'react';
import {log} from 'react-native-reanimated';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  
  useEffect(() => {
    getUserId();
  }, []);

  async function getToken() {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      console.error('Error al obtener el token:', error);
      return null;
    }
  }

  async function getUserId() {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('User ID:', userId);
      return userId;
    } catch (error) {
      console.error('Error al obtener el ID de usuario:', error);
      return null;
    }
  }

  async function navigateWithToken(screenName, token, id) {
    navigation.navigate(screenName, { token, userId: id, email });
  }

  async function handleSubmit() {
    console.log(email, password);
    const userData = { email, password };
  
    try {
      const isConnected = await NetInfo.fetch().then(state => state.isConnected);
      if (!isConnected) {
        Alert.alert('Error de conexión', 'No hay conexión a Internet');
        return; // Salir de la función si no hay conexión
      }
  
      const response = await axios.post('https://ujed-api.onrender.com/api/users/login', userData);
      console.log(response.data);
      const { token, id, roles } = response.data; // Extraer roles de la respuesta
      if (token && id) {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userId', id);
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('isLoggedIn', 'true'); // Establece isLoggedIn como true al iniciar sesión correctamente
        if (roles && roles.length > 0) {
          await AsyncStorage.setItem('userRoles', JSON.stringify(roles)); // Guardar roles en AsyncStorage si están disponibles
        }
  
        navigateWithToken('Home', token, id);
        Alert.alert('Bienvenido');
      } else {
        Alert.alert('Error', 'Token or ID missing in response');
      }
    } catch (error) {
      console.error(error.response); // Log the entire error response for debugging
      if (error.response && error.response.data && error.response.data.message) {
        const errorMessages = error.response.data.message;
        errorMessages.forEach(errorMessage => {
          Alert.alert('Error de inicio de sesión', errorMessage);
        });
      } else {
        Alert.alert('Error de inicio de sesión', 'Credenciales incorrectas. Inténtalo de nuevo.');
      }
    }
  }
 
  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn');
    
    console.log(data, 'at app.jsx');
  
  }
  useEffect(()=>{
    getData();
    console.log("Hii");
  },[])

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      style={{backgroundColor: 'white'}}
      keyboardShouldPersistTaps={'always'}>
      <View>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../assets/mainLogo.png')}
          />
        </View>
        {/* Formulario */}
        <View style={styles.loginContainer}>
          <Text style={styles.text_header}>INICIAR SESION</Text>
          <View style={styles.action}>
            <FontAwesome
              name="user-o"
              color="#ce112d"
              style={styles.smallIcon}
            />
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              onChange={e => setEmail(e.nativeEvent.text)}
            />
          </View>

          {/* Password */}
          <View style={styles.action}>
            <FontAwesome name="lock" color="#ce112d" style={styles.smallIcon} />
            <TextInput
              placeholder="Password"
              style={styles.textInput}
              onChange={e => setPassword(e.nativeEvent.text)}
              secureTextEntry={!showPassword} // Hide password if showPassword is false
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={showPassword ? 'eye' : 'eye-off'} // Toggle between eye and eye-off icons
                style={{ marginRight: -10 }}
                color="#ce112d"
                size={23}
              />
            </TouchableOpacity>
          </View>


        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.inBut} onPress={() => handleSubmit()}>
            <View>
              <Text style={styles.textSign}>Ingresar</Text>
            </View>
          </TouchableOpacity>

          <View style={{padding: 15}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#919191'}}>
              ¿Todavia no tienes una cuenta? <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Register');
                }}>
                  <Text style={styles.bottomText}>Registrarte</Text>
                
              </TouchableOpacity>
            </Text>
          </View>
          <View style={styles.bottomButton}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>

            </View>
           
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
export default LoginPage;