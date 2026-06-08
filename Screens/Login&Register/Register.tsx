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
import { toast } from '@tamagui/toast/v2';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { API_URL } from '../../constants';

function RegisterPage() {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailValid = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email);
  const passwordValid = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password);

  async function handleSubmit() {
    if (!name || !lastName || !email || !password) {
      toast.error('Campos incompletos', { description: 'Por favor llena todos los campos.' });
      return;
    }
    if (!emailValid) {
      toast.error('Email inválido', { description: 'Ingresa un correo electrónico válido.' });
      return;
    }
    if (!passwordValid) {
      toast.error('Contraseña débil', { description: 'Mínimo 6 caracteres, mayúscula, minúscula y número.' });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/sign-up/email`, { name, lastName, email, password });
      const { token } = response.data;
      if (token) {
        toast.success('Cuenta creada', { description: '¡Ya puedes iniciar sesión!' });
        navigation.navigate('Login');
      } else {
        toast.error('Error', { description: 'No se pudo crear la cuenta.' });
      }
    } catch (error) {
      const msg = error.response?.data?.message;
      const text2 = Array.isArray(msg) ? msg.join(', ') : (msg || 'Error al registrarse. Inténtalo de nuevo.');
      toast.error('Error de registro', { description: text2, duration: 8000 });
    } finally {
      setLoading(false);
    }
  }

  const Field = ({ icon, placeholder, value, onChangeText, secure = false, keyboard = 'default' as any, showToggle = false, onToggle = null as any, valid = null as any }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: value.length > 0 && valid === false ? '#ef4444' : value.length > 0 && valid === true ? '#22c55e' : '#d1d5db', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 }}>
      <FontAwesome name={icon} size={18} color="#ce112d" />
      <TextInput
        style={{ flex: 1, marginLeft: 12, fontSize: 16, color: '#1f2937' }}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        autoCapitalize="none"
        keyboardType={keyboard}
      />
      {showToggle && (
        <TouchableOpacity onPress={onToggle}>
          <Feather name={!secure ? 'eye' : 'eye-off'} size={20} color="#9ca3af" />
        </TouchableOpacity>
      )}
      {valid !== null && value.length > 0 && (
        <Feather name={valid ? 'check-circle' : 'x-circle'} size={20} color={valid ? '#22c55e' : '#ef4444'} />
      )}
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor: 'white' }}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
    >
      <View style={{ alignItems: 'center', marginTop: 32 }}>
        <Image
          style={{ width: 120, height: 120, borderRadius: 12, borderWidth: 1, borderColor: '#ce112d' }}
          source={require('../../assets/mainLogo.png')}
        />
        <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#1f2937', marginTop: 16 }}>Crear cuenta</Text>
      </View>

      <View style={{ marginHorizontal: 24, marginTop: 24, gap: 14 }}>
        <Field icon="user-o" placeholder="Nombre" value={name} onChangeText={setName} valid={name.length > 1} />
        <Field icon="user-o" placeholder="Apellido" value={lastName} onChangeText={setLastName} valid={lastName.length > 1} />
        <Field icon="envelope-o" placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboard="email-address" valid={email.length > 0 ? emailValid : null} />
        <Field
          icon="lock"
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secure={!showPassword}
          showToggle
          onToggle={() => setShowPassword(!showPassword)}
          valid={password.length > 0 ? passwordValid : null}
        />
        {password.length > 0 && !passwordValid && (
          <Text style={{ color: '#ef4444', fontSize: 12, marginLeft: 4 }}>Mínimo 6 caracteres, mayúscula, minúscula y número.</Text>
        )}
      </View>

      <View style={{ marginHorizontal: 24, marginTop: 32 }}>
        <TouchableOpacity
          style={{ backgroundColor: '#ce112d', borderRadius: 50, paddingVertical: 16, alignItems: 'center', opacity: loading ? 0.7 : 1 }}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="white" />
            : <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Registrarse</Text>
          }
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 40 }}>
        <Text style={{ color: '#6b7280', fontSize: 14 }}>¿Ya tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: '#ce112d', fontSize: 14, fontWeight: 'bold' }}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default RegisterPage;
