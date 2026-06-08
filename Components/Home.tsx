import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import ImageSlider from './imageSlider';
import ImageContainer from './ImageContainer';

function Home() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('userName').then(e => {
      if (e) setName(e);
    }).catch(() => {});
    AsyncStorage.getItem('userEmail').then(e => {
      if (e) setUsername(e.split('@')[0]);
    }).catch(() => {});
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: 'white' }}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header con safe area */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.welcomeSmall}>Bienvenido</Text>
          <Text style={styles.welcomeName}>{name}</Text>
        </View>
      </View>

      {/* Slider de imágenes */}
      <View style={styles.sliderContainer}>
        <ImageSlider />
      </View>

      {/* Mis reportes */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Mis reportes</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Seemore')} activeOpacity={0.7}>
          <Text style={styles.verMas}>Ver más</Text>
        </TouchableOpacity>
      </View>

      <ImageContainer />

      {/* Botón agregar reporte */}
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddReportScreen')}
          activeOpacity={0.85}
        >
          <Text style={styles.addBtnText}>Agregar reporte</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: 'white',
  },
  welcomeSmall: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  welcomeName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    textTransform: 'capitalize',
  },
  sliderContainer: {
    marginTop: 4,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  verMas: {
    fontSize: 13,
    color: '#ce112d',
    fontWeight: '600',
  },
  btnContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 24,
  },
  addBtn: {
    width: '100%',
    backgroundColor: '#ce112d',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 50,
    shadowColor: '#ce112d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
  },
});

export default Home;
