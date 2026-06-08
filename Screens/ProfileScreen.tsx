import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../constants';

function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const e = await AsyncStorage.getItem('userEmail') || '';
      const r = JSON.parse(await AsyncStorage.getItem('userRoles') || '[]');
      setEmail(e);
      setRoles(r);
    } catch (_) {}
  }

  const username = email.split('@')[0] || '?';
  const initial = username.charAt(0).toUpperCase();
  const isAdmin = roles.includes('admin');

  async function handleLogout() {
    try {
      const token = await AsyncStorage.getItem('token');
      await fetch(`${API_URL}/api/auth/sign-out`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    } catch (_) {}
    await AsyncStorage.multiRemove(['token', 'userId', 'userEmail', 'isLoggedIn', 'userRoles']);
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.emailText}>{email}</Text>
          {roles.map(r => (
            <View key={r} style={styles.roleBadge}>
              <Text style={styles.roleText}>{r}</Text>
            </View>
          ))}
        </View>

        {/* Info */}
        <View style={styles.card}>
          <Row icon="mail-outline" label="Correo electrónico" value={email} />
          <View style={styles.divider} />
          <Row icon="shield-checkmark-outline" label="Roles" value={roles.join(', ')} />
        </View>

        {/* Admin section */}
        {isAdmin && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Administración</Text>
            <TouchableOpacity
              style={styles.adminBtn}
              onPress={() => navigation.navigate('AdminMapsScreen')}
              activeOpacity={0.7}
            >
              <View style={styles.adminBtnIcon}>
                <Ionicons name="map-outline" size={22} color="#ce112d" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.adminBtnLabel}>Gestionar Croquis</Text>
                <Text style={styles.adminBtnSub}>Facultades, edificios y cuartos</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        )}

        {/* Logout */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
            <Ionicons name="exit-outline" size={22} color="#ce112d" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={20} color="#ce112d" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ce112d',
    paddingTop: 48,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 6,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: 'white' },
  username: { fontSize: 22, fontWeight: '700', color: 'white', textTransform: 'capitalize' },
  emailText: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 4,
  },
  roleText: { color: 'white', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(206,17,45,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { fontSize: 12, color: '#9ca3af', marginBottom: 2 },
  rowValue: { fontSize: 15, color: '#1f2937', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginHorizontal: 16 },
  adminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  adminBtnIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(206,17,45,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminBtnLabel: { fontSize: 15, color: '#1f2937', fontWeight: '500' },
  adminBtnSub: { fontSize: 12, color: '#9ca3af', marginTop: 1 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  logoutText: { fontSize: 16, color: '#ce112d', fontWeight: '600' },
});

export default ProfileScreen;
