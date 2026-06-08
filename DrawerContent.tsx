import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './constants';

const MENU = [
  { icon: 'home-outline', label: 'Inicio', navigateTo: 'HomeScreen' },
  { icon: 'account-outline', label: 'Perfil', navigateTo: 'Profile' },
];

function DrawerContent(props) {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => { loadUser(); }, []);

  async function loadUser() {
    try {
      const e = await AsyncStorage.getItem('userEmail');
      if (e) {
        setEmail(e);
        setName(e.split('@')[0]);
      }
    } catch (_) {}
  }

  async function handleLogout() {
    try {
      const token = await AsyncStorage.getItem('token');
      await fetch(`${API_URL}/api/auth/sign-out`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch (_) {}
    await AsyncStorage.multiRemove(['token', 'userId', 'userEmail', 'isLoggedIn', 'userRoles']);
    navigation.navigate('LoginUser');
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email} numberOfLines={1}>{email}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Menu */}
        {MENU.map((item, i) => (
          <DrawerItem
            key={i}
            icon={({ color, size }) => <MaterialCommunityIcons name={item.icon as any} color={color} size={size} />}
            label={item.label}
            labelStyle={styles.menuLabel}
            onPress={() => navigation.navigate(item.navigateTo)}
          />
        ))}
      </DrawerContentScrollView>

      {/* Logout */}
      <View style={styles.footer}>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="exit-outline" size={22} color="#ce112d" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default DrawerContent;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ce112d',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  name: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  email: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 4,
  },
  menuLabel: {
    fontSize: 15,
    color: '#374151',
  },
  footer: {
    paddingBottom: 24,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  logoutText: {
    color: '#ce112d',
    fontSize: 15,
    fontWeight: '600',
  },
});
