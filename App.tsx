import 'react-native-gesture-handler';
import {
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import HomeScreen from './Screens/HomeScreen';
import ProfileScreen from './Screens/ProfileScreen';
import UserScreen from './Screens/UserScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContent from './DrawerContent';
import {useEffect, useState} from 'react';
import LoginPage from './Screens/Login&Register/Login';
import RegisterPage from './Screens/Login&Register/Register';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddReportScreen from './Screens/AddReportScreen';
import SeeMoreScreen from './Screens/SeeMoreScreen';
import SeeMoreoc from './Screens/SeeMoreoc'
import MantenimientoScreen from './Screens/MantenimientoScreen';
import ObrasScreen from './Screens/ObrasScreen';
import ObrasPendientes from './Screens/ObrasPendientes';
import ObrasTerminadas from './Screens/ObrasTerminadas';
import Mapa from './Screens/MapSelection';
import MapSelection from './Screens/MapSelection';
import StatusScreen from './Screens/StatusScreen';
import PdfScreen from './Screens/PdfScreen';
import TrabajosPendientes from './Screens/TrabajosPendientes'
import TrabajosTerminados from './Screens/TrabajosTerminados';
import MapSelection2 from './Screens/MapSelection2';


const StackNav = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        statusBarHidden: false,
        statusBarColor: '#000000',
        headerShown: false,
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
      />
      <Stack.Screen 
        name='MantenimientoScreen'
        component={MantenimientoScreen} 
      />
      <Stack.Screen 
        name='ObrasScreen' 
        component={ObrasScreen}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Seemore" component={SeeMoreScreen} />
      <Stack.Screen name="PdfScreen" component={PdfScreen} />
      {/* // Agrega esto a tu Stack.Navigator en StackNav */}
      <Stack.Screen name='ObrasTerminadasScreen' component={ObrasTerminadas}/>
      <Stack.Screen name='ObrasPendientesScreen' component={ObrasPendientes}/>
      <Stack.Screen name="AddReportScreen" component={AddReportScreen} />
      <Stack.Screen name='Mapa' component={MapSelection}/>
      <Stack.Screen name='Status' component={StatusScreen}/>
      <Stack.Screen name='Pdf' component={PdfScreen}/>
      <Stack.Screen name='SeeMoreoc' component={SeeMoreoc}/>
      <Stack.Screen name='TrabajosPendientes' component={TrabajosPendientes}/>
      <Stack.Screen name='TrabajosTerminados' component={TrabajosTerminados}/>
      <Stack.Screen name='Mapa2' component={MapSelection2}/>
      {/* <Stack.Screen name="SeeMoreScreen" component={SeeMoreScreen} /> */}

      <Stack.Screen
        name="User"
        component={UserScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen name="LoginUser" component={LoginNav}/>
    
    </Stack.Navigator>
  );
};

const DrawerNav = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen name="Home" component={StackNav} />

    </Drawer.Navigator>
  );
};

const LoginNav = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Register" component={RegisterPage} />
      <Stack.Screen name="Home" component={DrawerNav} />
    </Stack.Navigator>
  );
};
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn');
    console.log(data, 'at app.jsx');
    setIsLoggedIn(data);
  }
  return (
    <NavigationContainer>
      {isLoggedIn ? <DrawerNav /> : <LoginNav />}
    </NavigationContainer>
  );
}
export default App;
