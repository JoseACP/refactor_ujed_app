import { API_URL } from '../constants';
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import axios from 'axios';

const { width } = Dimensions.get('window');

const STATUS_MAP: Record<string, { label: string; bg: string; text: string; step: number }> = {
  EnEspera:   { label: 'En espera',  bg: '#fef3c7', text: '#92400e', step: 1 },
  Asignado:   { label: 'Asignado',   bg: '#dbeafe', text: '#1e40af', step: 2 },
  Resuelto:   { label: 'Resuelto',   bg: '#d1fae5', text: '#065f46', step: 3 },
  Descartado: { label: 'Descartado', bg: '#fee2e2', text: '#991b1b', step: -1 },
};

const STEPS = [
  { key: 'EnEspera', label: 'En espera' },
  { key: 'Asignado', label: 'Asignado' },
  { key: 'Resuelto', label: 'Resuelto' },
];

function formatDate(dateString?: string): string {
  if (!dateString) return 'Sin fecha';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'Sin fecha';
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

function StatusTracker({ estado }: { estado?: string }) {
  const s = STATUS_MAP[estado ?? ''];
  const isDiscarded = estado === 'Descartado';
  const currentStep = s?.step ?? 0;

  return (
    <View style={tk.wrap}>
      <Text style={tk.title}>Estado del reporte</Text>
      {isDiscarded ? (
        <View style={tk.discardedBadge}>
          <Feather name="x-circle" size={16} color="#991b1b" />
          <Text style={tk.discardedText}>Reporte descartado</Text>
        </View>
      ) : (
        <View style={tk.stepsRow}>
          {STEPS.map((step, i) => {
            const done = currentStep >= i + 1;
            const active = currentStep === i + 1;
            return (
              <React.Fragment key={step.key}>
                <View style={tk.stepCol}>
                  <View style={[tk.dot, done && tk.dotDone, active && tk.dotActive]}>
                    {done && !active && <Feather name="check" size={12} color="white" />}
                    {active && <View style={tk.dotPulse} />}
                  </View>
                  <Text style={[tk.stepLabel, done && tk.stepLabelDone, active && tk.stepLabelActive]}>
                    {step.label}
                  </Text>
                </View>
                {i < STEPS.length - 1 && (
                  <View style={[tk.connector, currentStep > i + 1 && tk.connectorDone]} />
                )}
              </React.Fragment>
            );
          })}
        </View>
      )}
    </View>
  );
}

function HeroImage({ uri }: { uri: string }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0.4)).current;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1,   duration: 700, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  function handleLoad() {
    setLoaded(true);
    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }

  return (
    <View style={styles.heroImage}>
      {!loaded && (
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: '#e5e7eb', opacity: shimmer }]} />
      )}
      <Animated.Image
        source={{ uri }}
        style={[StyleSheet.absoluteFill, { opacity }]}
        resizeMode="cover"
        onLoad={handleLoad}
        onError={handleLoad}
      />
    </View>
  );
}

function StatusScreen() {
  const route = useRoute() as any;
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [token, setToken] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const { itemId, imageUrl, estado, description, ubicacion, title, fecha } = route.params as any;

  const statusInfo = STATUS_MAP[estado ?? ''];
  const dateStr = formatDate(fecha);

  useEffect(() => {
    AsyncStorage.getItem('token').then(t => t && setToken(t));
  }, []);

  const handleDelete = async () => {
    if (!token) {
      Alert.alert('Error', 'No hay sesión activa.');
      return;
    }
    try {
      await axios.delete(`${API_URL}/api/reports/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModalVisible(false);
      Alert.alert('Eliminado', 'El reporte fue eliminado correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      setModalVisible(false);
      Alert.alert('Error', 'No se pudo eliminar el reporte. Intenta de nuevo.');
    }
  };

  return (
    <View style={styles.root}>
      {/* Header con safe area */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <AntDesign name="arrowleft" size={22} color="#ce112d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del reporte</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Imagen hero con skeleton */}
        {imageUrl ? <HeroImage uri={imageUrl} /> : (
          <View style={styles.imageFallback}>
            <Feather name="image" size={40} color="#9ca3af" />
            <Text style={styles.imageFallbackText}>Sin imagen</Text>
          </View>
        )}

        {/* Fila estado + fecha */}
        <View style={styles.metaRow}>
          <View style={[styles.statusBadge, statusInfo && { backgroundColor: statusInfo.bg }]}>
            <Text style={[styles.statusBadgeText, statusInfo && { color: statusInfo.text }]}>
              {statusInfo?.label ?? estado ?? 'Sin estado'}
            </Text>
          </View>
          <View style={styles.dateChip}>
            <Feather name="calendar" size={12} color="#6b7280" />
            <Text style={styles.dateText}>{dateStr}</Text>
          </View>
        </View>

        {/* Tarjeta de información */}
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Título</Text>
          <Text style={styles.fieldValue}>{title || 'Sin título'}</Text>

          <View style={styles.divider} />

          <Text style={styles.fieldLabel}>Descripción</Text>
          <Text style={styles.fieldValue}>{description || 'Sin descripción'}</Text>

          <View style={styles.divider} />

          <Text style={styles.fieldLabel}>Ubicación</Text>
          <View style={styles.locationRow}>
            <View style={styles.locationPill}>
              <Text style={styles.locationPillLabel}>Facultad</Text>
              <Text style={styles.locationPillValue} numberOfLines={2}>
                {ubicacion?.faculty || '—'}
              </Text>
            </View>
            <View style={styles.locationPill}>
              <Text style={styles.locationPillLabel}>Edificio</Text>
              <Text style={styles.locationPillValue} numberOfLines={2}>
                {ubicacion?.building || '—'}
              </Text>
            </View>
            <View style={styles.locationPill}>
              <Text style={styles.locationPillLabel}>Salón</Text>
              <Text style={styles.locationPillValue} numberOfLines={2}>
                {ubicacion?.classroom || '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* Tracker de estado */}
        <StatusTracker estado={estado} />

        {/* Botón eliminar */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
        >
          <Feather name="trash-2" size={18} color="white" />
          <Text style={styles.deleteBtnText}>Eliminar reporte</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal confirmación */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        backdropOpacity={0.4}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        animationInTiming={200}
        animationOutTiming={200}
      >
        <View style={styles.modal}>
          <View style={styles.modalIconWrap}>
            <Feather name="trash-2" size={28} color="#ce112d" />
          </View>
          <Text style={styles.modalTitle}>¿Eliminar reporte?</Text>
          <Text style={styles.modalSubtitle}>
            Esta acción es permanente y no se puede deshacer.
          </Text>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalBtnCancel]}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalBtnDelete]}
              onPress={handleDelete}
              activeOpacity={0.85}
            >
              <Text style={styles.modalDeleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const tk = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 20,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepCol: {
    alignItems: 'center',
    gap: 6,
    minWidth: 70,
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: '#ce112d',
  },
  dotActive: {
    backgroundColor: '#ce112d',
    shadowColor: '#ce112d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 4,
  },
  dotPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  connector: {
    flex: 1,
    height: 3,
    backgroundColor: '#e5e7eb',
    marginBottom: 22,
    borderRadius: 2,
  },
  connectorDone: {
    backgroundColor: '#ce112d',
  },
  stepLabel: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    maxWidth: 68,
  },
  stepLabelDone: {
    color: '#374151',
    fontWeight: '600',
  },
  stepLabelActive: {
    color: '#ce112d',
    fontWeight: '700',
  },
  discardedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  discardedText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991b1b',
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff1f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  heroImage: {
    width: width,
    height: 220,
  },
  imageFallback: {
    width: width,
    height: 160,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imageFallbackText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f3f4f6',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateText: {
    fontSize: 13,
    color: '#6b7280',
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  fieldValue: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e7eb',
    marginVertical: 14,
  },
  locationRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  locationPill: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 10,
    gap: 3,
  },
  locationPillLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  locationPillValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ce112d',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 15,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#ce112d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  deleteBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  modalIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fff1f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#f3f4f6',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  modalBtnDelete: {
    backgroundColor: '#ce112d',
    shadowColor: '#ce112d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  modalDeleteText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
  },
});

export default StatusScreen;
