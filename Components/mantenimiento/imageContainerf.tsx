import { API_URL } from '../../constants';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GridComponentf from './GridComponentf';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GridSkeleton } from '../Skeleton';

const ImageContainerf = () => {
  const navigation = useNavigation<any>();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/reports/department/Mantenimiento`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Error al obtener datos');
        const json = await res.json();
        setData(
          json
            .filter((item: any) => item.status === 'Resuelto')
            .map((item: any) => ({
              id: item.id,
              title: item.title,
              imageUri: item.images?.[0]?.url ?? null,
              description: item.description,
              ubicacion: item.location,
              fecha: item.created_at,
              estado: item.status,
            }))
        );
      } catch (e) {
        console.error('imageContainerf mantenimiento:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleItemClick = (item: any) => {
    navigation.navigate('Status', {
      itemId: item.id, imageUrl: item.imageUri, estado: item.estado,
      description: item.description, ubicacion: item.ubicacion ?? {},
      title: item.title, fecha: item.fecha,
    });
  };

  if (loading) return <GridSkeleton />;

  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="checkmark-circle-outline" size={52} color="#d1d5db" />
        <Text style={styles.emptyTitle}>Sin trabajos terminados</Text>
        <Text style={styles.emptySub}>Los trabajos completados aparecerán aquí</Text>
      </View>
    );
  }

  return <GridComponentf data={data} onItemClick={handleItemClick} />;
};

const styles = StyleSheet.create({
  empty: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 24, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#374151', marginTop: 4 },
  emptySub: { fontSize: 13, color: '#9ca3af', textAlign: 'center' },
});

export default ImageContainerf;
