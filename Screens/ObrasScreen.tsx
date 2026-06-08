import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageContainer from '../Components/obras/imageContainer';
import ImageContainerf from '../Components/obras/imageContainerf';

function ObrasScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('');

  useEffect(() => {
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
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.screenLabel}>Obras</Text>
          <Text style={styles.welcomeName}>{username}</Text>
        </View>
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Obras pendientes</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SeeMoreoc')} activeOpacity={0.7}>
          <Text style={styles.verMas}>Ver más</Text>
        </TouchableOpacity>
      </View>
      <ImageContainer />

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Obras terminadas</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ObrasTerminadasScreen')} activeOpacity={0.7}>
          <Text style={styles.verMas}>Ver más</Text>
        </TouchableOpacity>
      </View>
      <ImageContainerf />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: 'white',
  },
  screenLabel: {
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
});

export default ObrasScreen;
