import { API_URL } from '../../constants';
const {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} = require('react-native');
import {useNavigation} from '@react-navigation/native';
import styles from './style';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useEffect, useState} from 'react';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginPage() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  
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
    const userData = { email, password };
    setLoading(true);
    try {
      const isConnected = await NetInfo.fetch().then(state => state.isConnected);
      if (isConnected === false) {
        Toast.show({ type: 'error', visibilityTime: 8000, text1: 'Sin conexión', text2: 'No hay conexión a Internet.' });
        return;
      }

      const response = await axios.post(`${API_URL}/api/users/login`, userData);
      const { token, id, roles } = response.data;
      if (token && id) {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userId', id);
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('isLoggedIn', 'true');
        if (roles && roles.length > 0) {
          await AsyncStorage.setItem('userRoles', JSON.stringify(roles));
        }
        Toast.show({ type: 'success', text1: '¡Bienvenido!', text2: `Hola, ${email}` });
        navigateWithToken('Home', token, id);
      } else {
        Toast.show({ type: 'error', visibilityTime: 8000, text1: 'Error', text2: 'Respuesta inválida del servidor.' });
      }
    } catch (error) {
      if (error.response?.data?.message) {
        const msgs = error.response.data.message;
        const text2 = Array.isArray(msgs) ? msgs.join(', ') : msgs;
        Toast.show({ type: 'error', visibilityTime: 8000, text1: 'Error de inicio de sesión', text2 });
      } else {
        Toast.show({ type: 'error', visibilityTime: 8000, text1: 'Error de inicio de sesión', text2: 'Credenciales incorrectas. Inténtalo de nuevo.' });
      }
    } finally {
      setLoading(false);
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
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View style={styles.action}>
            <FontAwesome name="lock" color="#ce112d" style={styles.smallIcon} />
            <TextInput
              placeholder="Password"
              style={styles.textInput}
              onChange={e => setPassword(e.nativeEvent.text)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
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
          <TouchableOpacity style={styles.inBut} onPress={() => handleSubmit()} disabled={loading}>
            <View>
              {loading
                ? <ActivityIndicator color="white" />
                : <Text style={styles.textSign}>Ingresar</Text>
              }
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