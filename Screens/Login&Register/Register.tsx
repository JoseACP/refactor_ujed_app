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
import styles from './style_register';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Error from 'react-native-vector-icons/MaterialIcons';
import {useState} from 'react';
import axios from 'axios';

function RegisterPage({props}) {
  const [name, setName] = useState('');
  const [nameVerify, setNameVerify] = useState(false);
  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);
  const [last_name, setLast_Name] = useState('');  // Agregado el estado para last_name
  const [last_nameVerify, setLast_NameVerify] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();
  function handelSubmit() {
    const userData = {
      name,
      last_name,
      email,
      password,
    };
    if (nameVerify && last_nameVerify && emailVerify && passwordVerify) {
      axios
        .post('https://ujed-api.onrender.com/api/users/register', userData)
        .then(res => {
          console.log(res.data);
          if (res.data.token) {
            Alert.alert('Registered Successfull!!');
            navigation.navigate('Login');
          } else {
            Alert.alert(JSON.stringify(res.data));
          }
        })
        .catch(e => console.log(e));
    } else {
      Alert.alert('Fill mandatory details');
    }
  }

  function handleName(e) {
    const nameVar = e.nativeEvent.text;
    setName(nameVar);
    setNameVerify(false);

    if (nameVar.length > 1) {
      setNameVerify(true);
    }
  }

  function handleLast_Name(e) {
    const last_nameVar = e.nativeEvent.text;
    setLast_Name(last_nameVar);
  
  if (last_nameVar.length > 1) {
    setLast_NameVerify(true);
  }
}
  function handleEmail(e) {
    const emailVar = e.nativeEvent.text;
    setEmail(emailVar);
    setEmailVerify(false);
    if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar)) {
      setEmail(emailVar);
      setEmailVerify(true);
    }
  }
  
  function handlePassword(e) {
    const passwordVar = e.nativeEvent.text;
    setPassword(passwordVar);
    setPasswordVerify(false);
    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar)) {
      setPassword(passwordVar);
      setPasswordVerify(true);
    }
  }
  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={'always'}
      style={{backgroundColor: 'white'}}>
      <View>
        <View style={styles.logoContainer}>
          <Image
            style={
              styles.logo}
            source={require('../../assets/mainLogo.png')}
          />
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.text_header}>REGISTRARSE</Text>
          {/* Name */}
          <View style={styles.action}>
            <FontAwesome
              name="user-o"
              color="#ce112d"
              style={styles.smallIcon}
            />
            <TextInput
              placeholder="Nombre"
              style={styles.textInput}
              onChange={e => handleName(e)}
            />
            {name.length < 1 ? null : nameVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Error name="error" color="red" size={20} />
            )}
          </View>
          {name.length < 1 ? null : nameVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: 'red',
              }}>
              Name sholud be more then 1 characters.
            </Text>
          )}
          {/* Last name */}
          <View style={styles.action}>
            <FontAwesome
              name="user-o"
              color="#ce112d"
              style={styles.smallIcon}
            />
            <TextInput
              placeholder="Apellido"
              style={styles.textInput}
              onChange={e => handleLast_Name(e)}
            />
            {last_name.length < 1 ? null : last_nameVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Error name="error" color="red" size={20} />
            )}
          </View>
          {last_name.length < 1 ? null : last_nameVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: 'red',
              }}>
              Name sholud be more then 1 characters.
            </Text>
          )}
          {/* Email */}
          <View style={styles.action}>
            <Fontisto
              name="email"
              color="#ce112d"
              size={24}
              style={styles.smallIcon}
            />
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              onChange={e => handleEmail(e)}
            />
            {email.length < 1 ? null : emailVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Error name="error" color="red" size={20} />
            )}
          </View>
          {email.length < 1 ? null : emailVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: 'red',
              }}>
              Enter Proper Email Address
            </Text>
          )}
          {/* Password */}
          <View style={styles.action}>
            <FontAwesome name="lock" color="#ce112d" style={styles.smallIcon} />
            <TextInput
              placeholder="Password"
              style={styles.textInput}
              onChange={e => handlePassword(e)}
              secureTextEntry={showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {password.length < 1 ? null : !showPassword ? (
                <Feather
                  name="eye-off"
                  style={{marginRight: -10}}
                  color={passwordVerify ? 'green' : 'red'}
                  size={23}
                />
              ) : (
                <Feather
                  name="eye"
                  style={{marginRight: -10}}
                  color={passwordVerify ? 'green' : 'red'}
                  size={23}
                />
              )}
            </TouchableOpacity>
          </View>
          {password.length < 1 ? null : passwordVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: 'red',
              }}>
              Uppercase, Lowercase, Number and 6 or more characters.
            </Text>
          )}
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={styles.inBut} onPress={() => handelSubmit()}>
            <View>
              <Text style={styles.textSign}>Registrarse</Text>
            </View>
          </TouchableOpacity>
        </View>
         <View style={styles.button}>
         <View style={{padding: 15}}>
            <Text style={{fontSize: 14, fontWeight: 'bold', color: '#919191'}}>
              ¿Ya tienes tienes una cuenta? <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Login');
                }}>
                  <Text style={styles.bottomText}>Ingresar</Text>
                
              </TouchableOpacity>
            </Text>
          </View>
         </View>
      </View>
    </ScrollView>
  );
}
export default RegisterPage;