import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast } from '@tamagui/toast/v2'
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from './tamagui.config';

import HomeScreen from './Screens/HomeScreen';
import ProfileScreen from './Screens/ProfileScreen';
import MantenimientoScreen from './Screens/MantenimientoScreen';
import ObrasScreen from './Screens/ObrasScreen';
import AddReportScreen from './Screens/AddReportScreen';
import SeeMoreScreen from './Screens/SeeMoreScreen';
import SeeMoreoc from './Screens/SeeMoreoc';
import StatusScreen from './Screens/StatusScreen';
import PdfScreen from './Screens/PdfScreen';
import TrabajosPendientes from './Screens/TrabajosPendientes';
import TrabajosTerminados from './Screens/TrabajosTerminados';
import ObrasPendientes from './Screens/ObrasPendientes';
import ObrasTerminadas from './Screens/ObrasTerminadas';
import MapSelection from './Screens/MapSelection';
import MapSelection2 from './Screens/MapSelection2';
import AdminMapsScreen from './Screens/AdminMapsScreen';
import LoginPage from './Screens/Login&Register/Login';
import RegisterPage from './Screens/Login&Register/Register';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICON: Record<string, [string, string]> = {
  HomeTab:         ['home',      'home-outline'],
  MantenimientoTab:['construct', 'construct-outline'],
  ObrasTab:        ['business',  'business-outline'],
  PerfilTab:       ['person',    'person-outline'],
};

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingBottom: Math.max(insets.bottom, 12),
      paddingHorizontal: 20,
      backgroundColor: 'transparent',
    }}>
      <View style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 40,
        paddingVertical: 10,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
        {state.routes.map((route: any, index: number) => {
          const focused = state.index === index;
          const isCenter = index === 2;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.85}
                style={{
                  backgroundColor: '#ce112d',
                  width: 58,
                  height: 58,
                  borderRadius: 29,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#ce112d',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 8,
                  marginTop: -22,
                }}
              >
                <Ionicons name="add" size={30} color="white" />
              </TouchableOpacity>
            );
          }

          const icons = TAB_ICON[route.name] ?? ['ellipse', 'ellipse-outline'];
          const iconName = focused ? icons[0] : icons[1];
          const color = focused ? '#ce112d' : '#9ca3af';
          const label = (descriptors[route.key].options.tabBarLabel ?? route.name) as string;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}
            >
              <View style={{
                backgroundColor: focused ? 'rgba(206,17,45,0.1)' : 'transparent',
                borderRadius: 20,
                paddingHorizontal: 14,
                paddingVertical: 5,
                alignItems: 'center',
              }}>
                <Ionicons name={iconName as any} size={22} color={color} />
              </View>
              <Text style={{ fontSize: 10, color, marginTop: 2, fontWeight: focused ? '600' : '400' }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// Tab central vacío — el listener redirige a AddReportScreen
const EmptyAdd = () => null;

function TabNav() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      sceneContainerStyle={{ backgroundColor: 'white' }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen
        name="MantenimientoTab"
        component={MantenimientoScreen}
        options={{ tabBarLabel: 'Mant.' }}
      />
      <Tab.Screen
        name="AddTab"
        component={EmptyAdd}
        options={{ tabBarLabel: '' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('AddReportScreen');
          },
        })}
      />
      <Tab.Screen
        name="ObrasTab"
        component={ObrasScreen}
        options={{ tabBarLabel: 'Obras' }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

function RootNav() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Auth */}
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Register" component={RegisterPage} />

      {/* Main app con bottom tabs */}
      <Stack.Screen name="Home" component={TabNav} />

      {/* Pantallas sin tab bar */}
      <Stack.Screen name="AddReportScreen" component={AddReportScreen} />
      <Stack.Screen name="Mapa" component={MapSelection} />
      <Stack.Screen name="Mapa2" component={MapSelection2} />
      <Stack.Screen name="Seemore" component={SeeMoreScreen} />
      <Stack.Screen name="SeeMoreoc" component={SeeMoreoc} />
      <Stack.Screen name="Status" component={StatusScreen} />
      <Stack.Screen name="PdfScreen" component={PdfScreen} />
      <Stack.Screen name="TrabajosPendientes" component={TrabajosPendientes} />
      <Stack.Screen name="TrabajosTerminados" component={TrabajosTerminados} />
      <Stack.Screen name="ObrasPendientesScreen" component={ObrasPendientes} />
      <Stack.Screen name="ObrasTerminadasScreen" component={ObrasTerminadas} />
      <Stack.Screen name="AdminMapsScreen" component={AdminMapsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <Toast position="bottom-center" duration={4000}>
        <NavigationContainer>
          <RootNav />
        </NavigationContainer>
        <Toast.Viewport portalToRoot={false}>
          <Toast.List />
        </Toast.Viewport>
      </Toast>
    </TamaguiProvider>
  );
}
