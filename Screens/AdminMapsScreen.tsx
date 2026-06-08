import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, ActivityIndicator, Alert, Image,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../constants';
import Toast from 'react-native-toast-message';

// ─── Types ────────────────────────────────────────────────────────────────────
type Faculty  = { id: string; name: string; slug: string; mapUrl?: string };
type Building = { id: string; name: string; slug: string; facultyId: string; mapUrl?: string };
type Room     = { id: string; name: string; slug: string; buildingId: string; zone?: string; pointX?: number; pointY?: number };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toSlug(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

async function authHeaders() {
  const token = await AsyncStorage.getItem('token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSub}>{subtitle}</Text>}
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Field({
  label, value, onChangeText, placeholder, keyboardType = 'default' as any, multiline = false,
}: {
  label: string; value: string; onChangeText: (t: string) => void;
  placeholder?: string; keyboardType?: any; multiline?: boolean;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && { height: 80, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize="none"
      />
    </View>
  );
}

// ─── Selector visual de coordenadas ───────────────────────────────────────────
function MapPointPicker({
  imageUrl, pointX, pointY, onPick, existingRooms = [],
}: {
  imageUrl: string; pointX: string; pointY: string;
  onPick: (x: string, y: string) => void;
  existingRooms?: Room[];
}) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const px = parseFloat(pointX);
  const py = parseFloat(pointY);
  const hasNew = pointX !== '' && pointY !== '' && !isNaN(px) && !isNaN(py);

  const placed = existingRooms.filter(
    r => r.pointX != null && r.pointY != null
  );

  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.fieldLabel}>Ubicación en el croquis</Text>
      <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
        {hasNew
          ? `Nuevo punto: (${px.toFixed(3)}, ${py.toFixed(3)}) — toca para mover`
          : 'Toca la imagen para marcar la ubicación del cuarto'}
      </Text>
      <View
        style={styles.mapPickerContainer}
        onLayout={e => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
        onStartShouldSetResponder={() => true}
        onResponderGrant={e => {
          const { locationX, locationY } = e.nativeEvent;
          if (size.width === 0) return;
          const x = Math.max(0, Math.min(1, locationX / size.width));
          const y = Math.max(0, Math.min(1, locationY / size.height));
          onPick(x.toFixed(3), y.toFixed(3));
        }}
      >
        <Image source={{ uri: imageUrl }} style={StyleSheet.absoluteFill} resizeMode="stretch" />

        {/* Puntos ya guardados */}
        {size.width > 0 && placed.map(r => (
          <View
            key={r.id}
            pointerEvents="none"
            style={[styles.mapDotExisting, {
              left: r.pointX! * size.width - 10,
              top:  r.pointY! * size.height - 10,
            }]}
          >
            <View style={styles.mapDotExistingInner} />
            <Text style={styles.mapDotLabel} numberOfLines={1}>{r.name}</Text>
          </View>
        ))}

        {/* Punto nuevo (aún no guardado) */}
        {hasNew && size.width > 0 && (
          <View
            pointerEvents="none"
            style={[styles.mapDot, {
              left: px * size.width - 10,
              top:  py * size.height - 10,
            }]}
          >
            <View style={styles.mapDotInner} />
          </View>
        )}
      </View>

      {/* Leyenda */}
      {placed.length > 0 && (
        <View style={styles.mapLegend}>
          <View style={styles.mapLegendDotExisting} />
          <Text style={styles.mapLegendText}>Guardados ({placed.length})</Text>
          {hasNew && <>
            <View style={[styles.mapLegendDotExisting, { backgroundColor: '#ce112d', marginLeft: 12 }]} />
            <Text style={styles.mapLegendText}>Nuevo</Text>
          </>}
        </View>
      )}
    </View>
  );
}

// ─── Upload image helper ───────────────────────────────────────────────────────
async function uploadImage(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.85,
  });
  if (result.canceled) return null;

  const asset = result.assets[0];
  const form = new FormData();
  form.append('file', { uri: asset.uri, name: 'map.jpg', type: 'image/jpeg' } as any);

  const token = await AsyncStorage.getItem('token');
  const res = await fetch(`${API_URL}/api/admin/maps/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const j = await res.json(); msg = j.message || j.error || msg; } catch (_) {}
    throw new Error(msg);
  }
  const json = await res.json();
  return json.key as string;
}

// ─── SECTION 1: Facultades ────────────────────────────────────────────────────
function FacultiesSection({
  faculties, loading, onRefresh, selectedId, onSelect,
}: {
  faculties: Faculty[]; loading: boolean; onRefresh: () => void;
  selectedId: string | null; onSelect: (id: string) => void;
}) {
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageKey, setImageKey] = useState('');

  async function pickImage() {
    try {
      setUploading(true);
      const key = await uploadImage();
      if (key) { setImageKey(key); Toast.show({ type: 'success', text1: 'Imagen subida' }); }
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    } finally { setUploading(false); }
  }

  async function create() {
    if (!name.trim()) return Toast.show({ type: 'error', text1: 'Nombre requerido' });
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/api/admin/maps/faculties`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: name.trim(), slug: toSlug(name), ...(imageKey && { mapKey: imageKey }) }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Error');
      Toast.show({ type: 'success', text1: 'Facultad creada' });
      setName(''); setImageKey('');
      onRefresh();
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    }
  }

  async function remove(id: string) {
    Alert.alert('Eliminar', '¿Eliminar esta facultad?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        const headers = await authHeaders();
        await fetch(`${API_URL}/api/admin/maps/faculties/${id}`, { method: 'DELETE', headers });
        onRefresh();
      }},
    ]);
  }

  return (
    <View>
      <SectionHeader title="Facultades" subtitle="Selecciona una para gestionar sus edificios" />

      {/* Lista */}
      {loading ? <ActivityIndicator color="#ce112d" style={{ margin: 16 }} /> : (
        <View style={styles.chipRow}>
          {faculties.map(f => (
            <View key={f.id} style={styles.itemRow}>
              <Chip label={f.name} active={selectedId === f.id} onPress={() => onSelect(f.id)} />
              <TouchableOpacity onPress={() => remove(f.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Formulario */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nueva facultad</Text>
        <Field label="Nombre" value={name} onChangeText={setName} placeholder="Ej. FAEO" />
        <Text style={styles.fieldLabel}>Imagen del croquis</Text>
        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage} disabled={uploading} activeOpacity={0.7}>
          {uploading
            ? <ActivityIndicator color="#ce112d" />
            : <>
                <Ionicons name={imageKey ? 'checkmark-circle' : 'cloud-upload-outline'} size={20} color={imageKey ? '#22c55e' : '#ce112d'} />
                <Text style={[styles.uploadText, imageKey && { color: '#22c55e' }]}>
                  {imageKey ? 'Imagen subida ✓' : 'Seleccionar imagen'}
                </Text>
              </>
          }
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn} onPress={create} activeOpacity={0.8}>
          <Text style={styles.primaryBtnText}>Crear facultad</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── SECTION 2: Edificios ─────────────────────────────────────────────────────
function BuildingsSection({
  facultyId, buildings, loading, onRefresh, selectedId, onSelect,
}: {
  facultyId: string | null; buildings: Building[]; loading: boolean;
  onRefresh: () => void; selectedId: string | null; onSelect: (id: string) => void;
}) {
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageKey, setImageKey] = useState('');

  if (!facultyId) return (
    <View style={styles.emptyBox}>
      <Ionicons name="arrow-up-outline" size={28} color="#9ca3af" />
      <Text style={styles.emptyText}>Selecciona una facultad primero</Text>
    </View>
  );

  async function pickImage() {
    try {
      setUploading(true);
      const key = await uploadImage();
      if (key) { setImageKey(key); Toast.show({ type: 'success', text1: 'Imagen subida' }); }
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    } finally { setUploading(false); }
  }

  async function create() {
    if (!name.trim()) return Toast.show({ type: 'error', text1: 'Nombre requerido' });
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/api/admin/maps/buildings`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ facultyId, name: name.trim(), slug: toSlug(name), ...(imageKey && { mapKey: imageKey }) }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Error');
      Toast.show({ type: 'success', text1: 'Edificio creado' });
      setName(''); setImageKey('');
      onRefresh();
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    }
  }

  async function remove(id: string) {
    Alert.alert('Eliminar', '¿Eliminar este edificio?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        const headers = await authHeaders();
        await fetch(`${API_URL}/api/admin/maps/buildings/${id}`, { method: 'DELETE', headers });
        onRefresh();
      }},
    ]);
  }

  return (
    <View>
      <SectionHeader title="Edificios / Plantas" subtitle="Selecciona uno para gestionar sus cuartos" />
      {loading ? <ActivityIndicator color="#ce112d" style={{ margin: 16 }} /> : (
        <View style={styles.chipRow}>
          {buildings.map(b => (
            <View key={b.id} style={styles.itemRow}>
              <Chip label={b.name} active={selectedId === b.id} onPress={() => onSelect(b.id)} />
              <TouchableOpacity onPress={() => remove(b.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))}
          {!loading && buildings.length === 0 && (
            <Text style={styles.emptyText}>Sin edificios aún</Text>
          )}
        </View>
      )}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nuevo edificio / planta</Text>
        <Field label="Nombre" value={name} onChangeText={setName} placeholder="Ej. Planta Alta" />
        <Text style={styles.fieldLabel}>Imagen del croquis (opcional)</Text>
        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage} disabled={uploading} activeOpacity={0.7}>
          {uploading
            ? <ActivityIndicator color="#ce112d" />
            : <>
                <Ionicons name={imageKey ? 'checkmark-circle' : 'cloud-upload-outline'} size={20} color={imageKey ? '#22c55e' : '#ce112d'} />
                <Text style={[styles.uploadText, imageKey && { color: '#22c55e' }]}>
                  {imageKey ? 'Imagen subida ✓' : 'Seleccionar imagen'}
                </Text>
              </>
          }
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtn} onPress={create} activeOpacity={0.8}>
          <Text style={styles.primaryBtnText}>Crear edificio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── SECTION 3: Cuartos ───────────────────────────────────────────────────────
function RoomsSection({
  buildingId, mapUrl, rooms, loading, onRefresh,
}: {
  buildingId: string | null; mapUrl?: string; rooms: Room[]; loading: boolean; onRefresh: () => void;
}) {
  const [name, setName] = useState('');
  const [zone, setZone] = useState('');
  const [pointX, setPointX] = useState('');
  const [pointY, setPointY] = useState('');

  if (!buildingId) return (
    <View style={styles.emptyBox}>
      <Ionicons name="arrow-up-outline" size={28} color="#9ca3af" />
      <Text style={styles.emptyText}>Selecciona un edificio primero</Text>
    </View>
  );

  async function create() {
    if (!name.trim()) return Toast.show({ type: 'error', text1: 'Nombre requerido' });
    const px = parseFloat(pointX);
    const py = parseFloat(pointY);
    if (pointX && (isNaN(px) || px < 0 || px > 1))
      return Toast.show({ type: 'error', text1: 'pointX debe ser entre 0.0 y 1.0' });
    if (pointY && (isNaN(py) || py < 0 || py > 1))
      return Toast.show({ type: 'error', text1: 'pointY debe ser entre 0.0 y 1.0' });

    try {
      const headers = await authHeaders();
      const body: any = { buildingId, name: name.trim(), slug: toSlug(name) };
      if (zone) body.zone = zone.trim();
      if (pointX) body.pointX = px;
      if (pointY) body.pointY = py;

      const res = await fetch(`${API_URL}/api/admin/maps/rooms`, {
        method: 'POST', headers, body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Error');
      Toast.show({ type: 'success', text1: 'Cuarto creado' });
      setName(''); setZone(''); setPointX(''); setPointY('');
      onRefresh();
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    }
  }

  async function remove(id: string) {
    Alert.alert('Eliminar', '¿Eliminar este cuarto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        const headers = await authHeaders();
        await fetch(`${API_URL}/api/admin/maps/rooms/${id}`, { method: 'DELETE', headers });
        onRefresh();
      }},
    ]);
  }

  return (
    <View>
      <SectionHeader title="Cuartos / Aulas" />
      {loading ? <ActivityIndicator color="#ce112d" style={{ margin: 16 }} /> : (
        <View style={styles.list}>
          {rooms.map(r => (
            <View key={r.id} style={styles.listRow}>
              <Ionicons name="location-outline" size={16} color="#9ca3af" />
              <Text style={styles.listRowText} numberOfLines={1}>{r.name}</Text>
              {r.zone ? <Text style={styles.zoneTag}>{r.zone}</Text> : null}
              <TouchableOpacity onPress={() => remove(r.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))}
          {rooms.length === 0 && <Text style={styles.emptyText}>Sin cuartos aún</Text>}
        </View>
      )}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nuevo cuarto</Text>
        <Field label="Nombre" value={name} onChangeText={setName} placeholder="Ej. Aula 1" />
        <Field label="Zona (opcional)" value={zone} onChangeText={setZone} placeholder="Ej. Edificio E" />
        {mapUrl ? (
          <MapPointPicker
            imageUrl={mapUrl}
            pointX={pointX}
            pointY={pointY}
            onPick={(x, y) => { setPointX(x); setPointY(y); }}
            existingRooms={rooms}
          />
        ) : (
          <>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Field label="Punto X (0.0–1.0)" value={pointX} onChangeText={setPointX} placeholder="0.15" keyboardType="decimal-pad" />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Punto Y (0.0–1.0)" value={pointY} onChangeText={setPointY} placeholder="0.43" keyboardType="decimal-pad" />
              </View>
            </View>
            <Text style={{ fontSize: 11, color: '#9ca3af', marginBottom: 12, marginTop: -4 }}>
              El edificio no tiene imagen de croquis. Sube una al crear/editar el edificio.
            </Text>
          </>
        )}
        <TouchableOpacity style={styles.primaryBtn} onPress={create} activeOpacity={0.8}>
          <Text style={styles.primaryBtnText}>Crear cuarto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AdminMapsScreen() {
  const navigation = useNavigation<any>();
  const [faculties, setFaculties]   = useState<Faculty[]>([]);
  const [buildings, setBuildings]   = useState<Building[]>([]);
  const [rooms, setRooms]           = useState<Room[]>([]);
  const [selFaculty, setSelFaculty] = useState<string | null>(null);
  const [selBuilding, setSelBuilding] = useState<string | null>(null);
  const [loadingF, setLoadingF] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [loadingR, setLoadingR] = useState(false);

  const fetchFaculties = useCallback(async () => {
    setLoadingF(true);
    try {
      const res = await fetch(`${API_URL}/api/maps/faculties`);
      if (res.ok) setFaculties(await res.json());
    } catch (_) {} finally { setLoadingF(false); }
  }, []);

  const fetchBuildings = useCallback(async (facultyId: string) => {
    setLoadingB(true);
    setBuildings([]); setRooms([]); setSelBuilding(null);
    try {
      const res = await fetch(`${API_URL}/api/maps/faculties/${facultyId}/buildings`);
      if (res.ok) setBuildings(await res.json());
    } catch (_) {} finally { setLoadingB(false); }
  }, []);

  const fetchRooms = useCallback(async (buildingId: string) => {
    setLoadingR(true);
    setRooms([]);
    try {
      const res = await fetch(`${API_URL}/api/maps/buildings/${buildingId}/rooms`);
      if (res.ok) setRooms(await res.json());
    } catch (_) {} finally { setLoadingR(false); }
  }, []);

  useEffect(() => { fetchFaculties(); }, []);

  function selectFaculty(id: string) {
    setSelFaculty(id);
    fetchBuildings(id);
  }

  function selectBuilding(id: string) {
    setSelBuilding(id);
    fetchRooms(id);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestionar Croquis</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <FacultiesSection
          faculties={faculties}
          loading={loadingF}
          onRefresh={fetchFaculties}
          selectedId={selFaculty}
          onSelect={selectFaculty}
        />

        <View style={styles.separator} />

        <BuildingsSection
          facultyId={selFaculty}
          buildings={buildings}
          loading={loadingB}
          onRefresh={() => selFaculty && fetchBuildings(selFaculty)}
          selectedId={selBuilding}
          onSelect={selectBuilding}
        />

        <View style={styles.separator} />

        <RoomsSection
          buildingId={selBuilding}
          mapUrl={buildings.find(b => b.id === selBuilding)?.mapUrl}
          rooms={rooms}
          loading={loadingR}
          onRefresh={() => selBuilding && fetchRooms(selBuilding)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ce112d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: 20,
  },
  backBtn: { padding: 6 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '700' },
  sectionHeader: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 6 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  sectionSub: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  separator: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 8, marginHorizontal: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8, paddingBottom: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: '#d1d5db',
    backgroundColor: 'white',
  },
  chipActive: { borderColor: '#ce112d', backgroundColor: 'rgba(206,17,45,0.08)' },
  chipText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  chipTextActive: { color: '#ce112d', fontWeight: '700' },
  deleteBtn: { padding: 6 },
  card: {
    backgroundColor: 'white', marginHorizontal: 16, marginTop: 12,
    borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#f3f4f6', borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 15, color: '#1f2937', borderWidth: 1, borderColor: '#e5e7eb',
  },
  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1.5, borderColor: '#ce112d', borderStyle: 'dashed',
    borderRadius: 10, paddingVertical: 14, paddingHorizontal: 16,
    justifyContent: 'center', marginBottom: 14,
  },
  uploadText: { fontSize: 14, color: '#ce112d', fontWeight: '600' },
  primaryBtn: {
    backgroundColor: '#ce112d', borderRadius: 50, paddingVertical: 14,
    alignItems: 'center', marginTop: 4,
  },
  primaryBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  list: { marginHorizontal: 16, backgroundColor: 'white', borderRadius: 12, overflow: 'hidden' },
  listRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderColor: '#f3f4f6',
  },
  listRowText: { flex: 1, fontSize: 14, color: '#1f2937' },
  zoneTag: {
    fontSize: 11, color: '#6b7280', backgroundColor: '#f3f4f6',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
  },
  emptyBox: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  emptyText: { fontSize: 14, color: '#9ca3af', textAlign: 'center', paddingHorizontal: 16 },
  mapPickerContainer: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  mapDot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(206,17,45,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ce112d',
    borderWidth: 2,
    borderColor: 'white',
  },
  mapDotExisting: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(59,130,246,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapDotExistingInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3b82f6',
    borderWidth: 2,
    borderColor: 'white',
  },
  mapDotLabel: {
    position: 'absolute',
    top: 18,
    left: -24,
    width: 68,
    fontSize: 9,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(59,130,246,0.75)',
    borderRadius: 4,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  mapLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  mapLegendDotExisting: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3b82f6',
  },
  mapLegendText: {
    fontSize: 11,
    color: '#6b7280',
  },
});
