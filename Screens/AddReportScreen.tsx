import { API_URL } from '../constants';
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Image, FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SkeletonBlock } from '../Components/Skeleton';
import { toast } from '@tamagui/toast/v2';

const imgDir = FileSystem.documentDirectory + 'images/';

type Faculty  = { id: string; name: string; slug: string };
type Building = { id: string; name: string; slug: string; mapUrl?: string };
type Room     = { id: string; name: string; slug: string; zone?: string; pointX?: number; pointY?: number };

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(imgDir);
  if (!info.exists) await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
}

// ─── Skeleton para fila de chips ─────────────────────────────────────────────
function ChipsSkeleton() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
      {[72, 58, 88, 64, 78].map((w, i) => (
        <SkeletonBlock key={i} width={w} height={34} borderRadius={20} />
      ))}
    </View>
  );
}

// ─── Chip seleccionable ───────────────────────────────────────────────────────
function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[s.chip, active && s.chipActive]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[s.chipText, active && s.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Mapa interactivo para seleccionar cuarto ─────────────────────────────────
function MapRoomSelector({
  mapUrl, rooms, selectedId, onSelect,
}: {
  mapUrl: string; rooms: Room[]; selectedId: string | null;
  onSelect: (r: Room) => void;
}) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const placed = rooms.filter(r => r.pointX != null && r.pointY != null);

  return (
    <View
      style={s.mapContainer}
      onLayout={e => setSize(e.nativeEvent.layout)}
    >
      <Image source={{ uri: mapUrl }} style={StyleSheet.absoluteFill} resizeMode="stretch" />
      {size.width > 0 && placed.map(r => {
        const active = selectedId === r.id;
        return (
          <TouchableOpacity
            key={r.id}
            style={[s.roomDot, {
              left: r.pointX! * size.width - 14,
              top:  r.pointY! * size.height - 14,
              backgroundColor: active ? 'rgba(206,17,45,0.25)' : 'rgba(59,130,246,0.2)',
            }]}
            onPress={() => onSelect(r)}
            activeOpacity={0.7}
          >
            <View style={[s.roomDotCore, active && s.roomDotCoreActive]} />
            <Text style={[s.roomDotLabel, active && s.roomDotLabelActive]} numberOfLines={1}>
              {r.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function AddReportScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [token, setToken] = useState<string | null>(null);

  // Form
  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages]         = useState<string[]>([]);
  const [uploading, setUploading]   = useState(false);

  // Cascada de ubicación
  const [faculties, setFaculties]     = useState<Faculty[]>([]);
  const [buildings, setBuildings]     = useState<Building[]>([]);
  const [rooms, setRooms]             = useState<Room[]>([]);
  const [selFaculty, setSelFaculty]   = useState<Faculty | null>(null);
  const [selBuilding, setSelBuilding] = useState<Building | null>(null);
  const [selRoom, setSelRoom]         = useState<Room | null>(null);
  const [loadingF, setLoadingF]       = useState(false);
  const [loadingB, setLoadingB]       = useState(false);
  const [loadingR, setLoadingR]       = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('token').then(t => t && setToken(t));
    loadImages();
    fetchFaculties();
  }, []);

  async function fetchFaculties() {
    setLoadingF(true);
    try {
      const res = await fetch(`${API_URL}/api/maps/faculties`);
      if (res.ok) setFaculties(await res.json());
    } catch (_) {}
    setLoadingF(false);
  }

  async function pickFaculty(f: Faculty) {
    setSelFaculty(f);
    setSelBuilding(null); setSelRoom(null);
    setBuildings([]); setRooms([]);
    setLoadingB(true);
    try {
      const res = await fetch(`${API_URL}/api/maps/faculties/${f.id}/buildings`);
      if (res.ok) setBuildings(await res.json());
    } catch (_) {}
    setLoadingB(false);
  }

  async function pickBuilding(b: Building) {
    setSelBuilding(b);
    setSelRoom(null); setRooms([]);
    setLoadingR(true);
    try {
      const res = await fetch(`${API_URL}/api/maps/buildings/${b.id}/rooms`);
      if (res.ok) setRooms(await res.json());
    } catch (_) {}
    setLoadingR(false);
  }

  async function loadImages() {
    await ensureDir();
    const files = await FileSystem.readDirectoryAsync(imgDir);
    setImages(files.map(f => imgDir + f));
  }

  async function selectImage(useLibrary: boolean) {
    const opts: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
    };
    let result: ImagePicker.ImagePickerResult;
    if (useLibrary) {
      result = await ImagePicker.launchImageLibraryAsync(opts);
    } else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(opts);
    }
    if (!result.canceled) {
      await ensureDir();
      const dest = imgDir + Date.now() + '.jpeg';
      await FileSystem.copyAsync({ from: result.assets[0].uri, to: dest });
      setImages(prev => [...prev, dest]);
    }
  }

  async function deleteImage(uri: string) {
    await FileSystem.deleteAsync(uri);
    setImages(prev => prev.filter(i => i !== uri));
  }

  async function submitReport() {
    if (!title.trim())  return toast.error('Escribe un título');
    if (!selFaculty)    return toast.error('Selecciona una facultad');
    if (!selBuilding)   return toast.error('Selecciona un edificio');
    if (!selRoom)       return toast.error('Selecciona un salón');

    const locationStr = `${selFaculty.slug}/${selBuilding.slug}/${selRoom.slug}`;
    console.log('=== SUBMIT REPORT ===');
    console.log('title:', title.trim());
    console.log('description:', description);
    console.log('location:', locationStr);
    console.log('selFaculty:', JSON.stringify(selFaculty));
    console.log('selBuilding:', JSON.stringify(selBuilding));
    console.log('selRoom:', JSON.stringify(selRoom));
    console.log('images:', images.length);

    setUploading(true);
    const form = new FormData();
    form.append('title', title.trim());
    form.append('description', description);
    form.append('location', locationStr);

    images.forEach(img => {
      form.append('files', {
        uri: img, type: 'image/jpeg', name: img.split('/').pop(),
      } as any);
    });

    try {
      const res = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = json?.message;
        const text2 = Array.isArray(msg) ? msg.join(', ') : (msg || 'Inténtalo de nuevo.');
        toast.error('Error', { description: text2, duration: 8000 });
      } else {
        for (const img of images) await FileSystem.deleteAsync(img).catch(() => {});
        setTitle(''); setDescription(''); setImages([]);
        setSelFaculty(null); setSelBuilding(null); setSelRoom(null);
        toast.success('Reporte enviado', { description: 'Fue registrado exitosamente.' });
        navigation.goBack();
      }
    } catch {
      toast.error('Error de red', { description: 'No se pudo conectar al servidor.' });
    } finally {
      setUploading(false);
    }
  }

  const noCoords = rooms.length > 0 && rooms.every(r => r.pointX == null);

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <AntDesign name="arrowleft" size={22} color="#ce112d" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Generar reporte</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

        {/* Título */}
        <View style={s.card}>
          <Text style={s.fieldLabel}>¿Qué pasó? <Text style={{ color: '#ce112d' }}>*</Text></Text>
          <TextInput
            style={s.input}
            placeholder="Escribe un título breve"
            placeholderTextColor="#9ca3af"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Facultad */}
        <View style={s.card}>
          <Text style={s.fieldLabel}>Facultad <Text style={{ color: '#ce112d' }}>*</Text></Text>
          {loadingF
            ? <ChipsSkeleton />
            : <View style={s.chipRow}>
                {faculties.map(f => (
                  <Chip key={f.id} label={f.name} active={selFaculty?.id === f.id} onPress={() => pickFaculty(f)} />
                ))}
              </View>
          }
        </View>

        {/* Edificio */}
        {(selFaculty != null || loadingB) && (
          <View style={s.card}>
            <Text style={s.fieldLabel}>Edificio / Planta</Text>
            {loadingB ? <ChipsSkeleton /> : buildings.length === 0
              ? <Text style={s.emptyHint}>Sin edificios registrados para esta facultad</Text>
              : <View style={s.chipRow}>
                  {buildings.map(b => (
                    <Chip key={b.id} label={b.name} active={selBuilding?.id === b.id} onPress={() => pickBuilding(b)} />
                  ))}
                </View>
            }
          </View>
        )}

        {/* Salón */}
        {(selBuilding != null || loadingR) && (
          <View style={s.card}>
            <Text style={s.fieldLabel}>Salón / Aula</Text>

            {/* Chip del cuarto seleccionado */}
            {selRoom && (
              <View style={s.selectedBadge}>
                <Ionicons name="location" size={13} color="#ce112d" />
                <Text style={s.selectedBadgeText}>{selRoom.name}</Text>
                <TouchableOpacity onPress={() => setSelRoom(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Feather name="x" size={13} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            )}

            {loadingR
              ? <SkeletonBlock width="100%" height={210} borderRadius={10} style={{ marginTop: 8 }} />
              : rooms.length === 0
                ? <Text style={s.emptyHint}>Sin cuartos registrados para este edificio</Text>
                : selBuilding?.mapUrl && !noCoords
                  ? (
                      <>
                        <Text style={s.hint}>Toca un punto en el mapa para seleccionar el cuarto</Text>
                        <MapRoomSelector
                          mapUrl={selBuilding.mapUrl}
                          rooms={rooms}
                          selectedId={selRoom?.id ?? null}
                          onSelect={r => setSelRoom(r)}
                        />
                      </>
                    )
                  : (
                      <View style={s.chipRow}>
                        {rooms.map(r => (
                          <Chip key={r.id} label={r.name} active={selRoom?.id === r.id} onPress={() => setSelRoom(r)} />
                        ))}
                      </View>
                    )
            }
          </View>
        )}

        {/* Descripción */}
        <View style={s.card}>
          <Text style={s.fieldLabel}>Descripción</Text>
          <TextInput
            style={[s.input, { height: 90, textAlignVertical: 'top' }]}
            placeholder="Describe con más detalle lo que ocurrió"
            placeholderTextColor="#9ca3af"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Fotos */}
        <View style={s.card}>
          <Text style={s.fieldLabel}>Fotos</Text>
          {images.length > 0 && (
            <FlatList
              data={images}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={i => i}
              style={{ marginBottom: 12 }}
              renderItem={({ item }) => (
                <View style={s.photoWrap}>
                  <Image source={{ uri: item }} style={s.photo} />
                  <TouchableOpacity style={s.photoDelete} onPress={() => deleteImage(item)}>
                    <Feather name="trash-2" size={13} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={s.photoBtn} onPress={() => selectImage(true)} activeOpacity={0.8}>
              <Feather name="image" size={18} color="#ce112d" />
              <Text style={s.photoBtnText}>Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.photoBtn} onPress={() => selectImage(false)} activeOpacity={0.8}>
              <Feather name="camera" size={18} color="#ce112d" />
              <Text style={s.photoBtnText}>Cámara</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[s.submitBtn, uploading && { opacity: 0.65 }]}
          onPress={submitReport}
          disabled={uploading}
          activeOpacity={0.85}
        >
          <Feather name="send" size={18} color="white" />
          <Text style={s.submitText}>{uploading ? 'Enviando...' : 'Registrar reporte'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
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
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#fff1f2',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 16, marginTop: 14,
    borderRadius: 16, padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 10 },
  input: {
    backgroundColor: '#f3f4f6', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#1f2937',
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: '#d1d5db', backgroundColor: 'white',
  },
  chipActive: { borderColor: '#ce112d', backgroundColor: 'rgba(206,17,45,0.08)' },
  chipText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  chipTextActive: { color: '#ce112d', fontWeight: '700' },
  emptyHint: { fontSize: 13, color: '#9ca3af', marginTop: 6 },
  hint: { fontSize: 12, color: '#6b7280', marginBottom: 8 },
  selectedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff1f2', paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20, alignSelf: 'flex-start', marginBottom: 10,
  },
  selectedBadgeText: { fontSize: 13, fontWeight: '700', color: '#ce112d' },
  // Mapa
  mapContainer: {
    width: '100%', height: 230,
    borderRadius: 10, overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  roomDot: {
    position: 'absolute', width: 28, height: 28,
    borderRadius: 14, alignItems: 'center', justifyContent: 'center',
  },
  roomDotCore: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#3b82f6', borderWidth: 2, borderColor: 'white',
  },
  roomDotCoreActive: { backgroundColor: '#ce112d' },
  roomDotLabel: {
    position: 'absolute', top: 26, left: -22, width: 72,
    fontSize: 9, fontWeight: '600', color: 'white',
    textAlign: 'center', backgroundColor: 'rgba(59,130,246,0.8)',
    borderRadius: 4, paddingHorizontal: 3, paddingVertical: 1,
  },
  roomDotLabelActive: { backgroundColor: 'rgba(206,17,45,0.85)' },
  // Fotos
  photoWrap: { marginRight: 10, borderRadius: 8, overflow: 'hidden' },
  photo: { width: 90, height: 90, borderRadius: 8 },
  photoDelete: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, padding: 4,
  },
  photoBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: '#ce112d', borderRadius: 10,
    paddingVertical: 12, backgroundColor: '#fff1f2',
  },
  photoBtnText: { fontSize: 14, fontWeight: '600', color: '#ce112d' },
  // Submit
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#ce112d', marginHorizontal: 16, marginTop: 24,
    paddingVertical: 16, borderRadius: 50, gap: 10,
    shadowColor: '#ce112d', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  submitText: { color: 'white', fontSize: 17, fontWeight: '700' },
});
