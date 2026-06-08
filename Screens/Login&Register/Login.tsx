import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { toast } from '@tamagui/toast/v2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { API_URL } from '../../constants';

function LoginPage() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      const isConnected = await NetInfo.fetch().then(s => s.isConnected);
      if (isConnected === false) {
        toast.error('Sin conexión', { description: 'No hay conexión a Internet.', duration: 8000 });
        return;
      }

      const response = await axios.post(`${API_URL}/api/auth/sign-in/email`, { email, password });
      const { token, user } = response.data;

      if (token && user?.id) {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userId', user.id);
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('isLoggedIn', 'true');
        if (user.roles?.length > 0) {
          await AsyncStorage.setItem('userRoles', JSON.stringify(user.roles));
        }
        toast.success('¡Bienvenido!', { description: `Hola, ${email}` });
        navigation.navigate('Home', { token, userId: user.id, email });
      } else {
        toast.error('Error', { description: 'Respuesta inválida del servidor.', duration: 8000 });
      }
    } catch (error) {
      const msg = error.response?.data?.message;
      const text2 = Array.isArray(msg) ? msg.join(', ') : (msg || 'Credenciales incorrectas. Inténtalo de nuevo.');
      toast.error('Error de inicio de sesión', { description: text2, duration: 8000 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor: 'white' }}
      keyboardShouldPersistTaps="always"
    >
      <View style={{ alignItems: 'center', marginTop: 40 }}>
        <Image
          style={{ width: 180, height: 180, borderRadius: 12, borderWidth: 1, borderColor: '#ce112d', marginTop: 24 }}
          source={require('../../assets/mainLogo.png')}
        />
      </View>

      <View style={{ alignItems: 'center', marginTop: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937' }}>Iniciar sesión</Text>
      </View>

      <View style={{ marginHorizontal: 24, marginTop: 32, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 }}>
          <FontAwesome name="user-o" size={18} color="#ce112d" />
          <TextInput
            style={{ flex: 1, marginLeft: 12, fontSize: 16, color: '#1f2937' }}
            placeholder="Correo electrónico"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 }}>
          <FontAwesome name="lock" size={18} color="#ce112d" />
          <TextInput
            style={{ flex: 1, marginLeft: 12, fontSize: 16, color: '#1f2937' }}
            placeholder="Contraseña"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginHorizontal: 24, marginTop: 32 }}>
        <TouchableOpacity
          style={{ backgroundColor: '#ce112d', borderRadius: 50, paddingVertical: 16, alignItems: 'center', opacity: loading ? 0.7 : 1 }}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="white" />
            : <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Ingresar</Text>
          }
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24, marginBottom: 40 }}>
        <Text style={{ color: '#6b7280', fontSize: 14 }}>¿Todavía no tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{ color: '#ce112d', fontSize: 14, fontWeight: 'bold' }}>Registrarte</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default LoginPage;
