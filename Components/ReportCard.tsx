import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');
export const CARD_WIDTH = (width - 42) / 2;

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  EnEspera:   { bg: '#fef3c7', text: '#92400e', label: 'En espera' },
  Asignado:   { bg: '#dbeafe', text: '#1e40af', label: 'Asignado'  },
  Resuelto:   { bg: '#d1fae5', text: '#065f46', label: 'Resuelto'  },
  Descartado: { bg: '#fee2e2', text: '#991b1b', label: 'Descartado'},
};

const PLACEHOLDER = 'https://placehold.co/300x200/e5e7eb/9ca3af?text=Sin+imagen';

export type ReportItem = {
  id: string;
  title: string;
  imageUri?: string;
  description?: string;
  fecha?: string;
  estado?: string;
};

// Shimmer independiente para el placeholder de imagen
function ImageSkeleton() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1,   duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.imageSkeleton, { opacity }]} />
  );
}

export function ReportCard({ item, onPress }: { item: ReportItem; onPress: (i: ReportItem) => void }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgOpacity = useRef(new Animated.Value(0)).current;

  const status  = STATUS_COLORS[item.estado ?? ''];
  const dateStr = item.fecha
    ? new Date(item.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
    : '';

  function handleLoad() {
    setImgLoaded(true);
    Animated.timing(imgOpacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  }

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)} activeOpacity={0.82}>
      {/* Contenedor de imagen con skeleton debajo */}
      <View style={styles.imageContainer}>
        {!imgLoaded && <ImageSkeleton />}
        <Animated.Image
          source={{ uri: item.imageUri || PLACEHOLDER }}
          style={[styles.image, { opacity: imgOpacity }]}
          resizeMode="cover"
          onLoad={handleLoad}
          onError={handleLoad}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title || 'Sin título'}</Text>
        <View style={styles.footer}>
          {status && (
            <View style={[styles.badge, { backgroundColor: status.bg }]}>
              <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
            </View>
          )}
          {dateStr ? <Text style={styles.date}>{dateStr}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 14,
    overflow: 'hidden',
    margin: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 130,
  },
  imageSkeleton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e5e7eb',
  },
  image: {
    width: '100%',
    height: 130,
  },
  info: {
    padding: 10,
    gap: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  date: {
    fontSize: 10,
    color: '#9ca3af',
  },
});
