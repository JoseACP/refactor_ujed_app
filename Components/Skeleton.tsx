import { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_W = (width - 42) / 2; // igual que ReportCard: 3 gaps × 14px

// ─── Base block con pulso ─────────────────────────────────────────────────────
export function SkeletonBlock({
  width: w, height: h, borderRadius = 8, style = {},
}: {
  width: number | string; height: number; borderRadius?: number; style?: any;
}) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.35, duration: 750, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[{ width: w, height: h, borderRadius, backgroundColor: '#e5e7eb', opacity }, style]}
    />
  );
}

// ─── Card esqueleto (imagen + línea de texto) ─────────────────────────────────
function CardSkeleton({ delay = 0 }: { delay?: number }) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 750, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.35, duration: 750, useNativeDriver: true }),
        ])
      ).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.cardImage} />
      <View style={styles.cardLine} />
      <View style={[styles.cardLine, { width: '55%' }]} />
    </Animated.View>
  );
}

// ─── Grid de 4 tarjetas 2×2 (para listas de reportes en home/mantenimiento/obras) ──
export function GridSkeleton() {
  return (
    <View style={styles.grid}>
      {[0, 1, 2, 3].map(i => (
        <CardSkeleton key={i} delay={i * 120} />
      ))}
    </View>
  );
}

// ─── Lista vertical (para Completas / Resueltas / SeeMore) ────────────────────
function RowSkeleton({ delay = 0 }: { delay?: number }) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 750, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.35, duration: 750, useNativeDriver: true }),
        ])
      ).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.row, { opacity }]}>
      <View style={styles.rowImage} />
      <View style={styles.rowContent}>
        <View style={[styles.rowLine, { width: '70%' }]} />
        <View style={[styles.rowLine, { width: '45%', marginTop: 8 }]} />
        <View style={[styles.rowLine, { width: '30%', marginTop: 6 }]} />
      </View>
    </Animated.View>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View style={{ padding: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <RowSkeleton key={i} delay={i * 100} />
      ))}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 7,
    marginTop: 8,
  },
  card: {
    width: CARD_W,
    margin: 7,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    paddingBottom: 14,
  },
  cardImage: {
    width: '100%',
    height: 130,
    backgroundColor: '#e5e7eb',
    borderRadius: 0,
  },
  cardLine: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    marginTop: 8,
    marginHorizontal: 10,
    width: '75%',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rowImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  rowContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  rowLine: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
  },
});
