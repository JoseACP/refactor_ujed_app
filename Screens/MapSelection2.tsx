import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import {useNavigation} from '@react-navigation/native';

const MapSelection2 = () => {
  const navigation = useNavigation();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [puntos, setPuntos] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState("Selecciona tu ubicación");

  useEffect(() => {
    // Coordenadas proporcionales a la imagen, ajusta según tus necesidades
    const initialPuntos = [
      { x: 0.19, y: 0.47, description: 'Baños' },
      { x: 0.10, y: 0.47, description: 'Bodega' },
      { x: 0.19, y: 0.56, description: 'Aulas de humanidades' },
      { x: 0.19, y: 0.640, description: 'Aula 6' },
      { x: 0.445, y: 0.368, description: 'Archivo Historico Judicial'},
      { x: 0.38, y: 0.456, description: 'Sala de consejo posgrado' },
      { x: 0.38, y: 0.536, description: 'Aula' },
      { x: 0.38, y: 0.564, description: 'Aula' },
      { x: 0.38, y: 0.59, description: 'Oficinas de posgrado Famen' },
      { x: 0.587, y: 0.356, description: 'Baños' },
      { x: 0.586, y: 0.376, description: 'Archivero ' },
      { x: 0.757, y: 0.338, description: 'Comedor'},
      { x: 0.757, y: 0.358, description: 'Restauración de archivos'},
      { x: 0.757, y: 0.38, description: 'Archivo historico'},
      { x: 0.757, y: 0.446, description: 'Aulas de filosofía'},
      { x: 0.757, y: 0.49, description: 'Comisíon electoral universitaria'},
      { x: 0.757, y: 0.523, description: 'Cafeteria'},
      { x: 0.72, y: 0.61, description: 'Oficinas administrativas'},
      { x: 0.6, y: 0.61, description: 'Vestibulo'},
    ];

    const calculatedPuntos = initialPuntos.map(punto => ({
      x: punto.x * Dimensions.get('window').width,
      y: punto.y * Dimensions.get('window').height,
      description: punto.description,
    }));

    setPuntos(calculatedPuntos);

  }, []);



  const handleSubmit = () => {
    // Navega a la otra pantalla y pasa la descripción seleccionada
    navigation.navigate('AddReportScreen', { selectedDescription });
    console.log("Texto enviado a AddReportScreen:", selectedDescription);
  };

  const handlePress = (event) => {
    const x = event.nativeEvent.locationX;
    const y = event.nativeEvent.locationY;

    // Encuentra el punto seleccionado
    const puntoSeleccionado = findSelectedPoint(x, y);
    

    // Si se seleccionó un punto, actualiza el estado
    if (puntoSeleccionado) {
      setSelectedPoint(puntoSeleccionado);
      setSelectedDescription(`Planta baja/${puntoSeleccionado.description}`);
    } else {
      // Si no se seleccionó un punto, maneja la lógica adicional o ignora
      console.log('Coordenadas seleccionadas:', { x, y });

      // Restablece el punto seleccionado si no se hizo clic en un punto
      setSelectedPoint(null);
      setSelectedDescription("Selecciona tu ubicación");
    }
  };

  const findSelectedPoint = (x, y) => {
    const touchRadius = 30;

    // Encuentra el punto dentro de un rango cercano al toque
    const punto = puntos.find((punto) => {
      const puntoX = punto.x;
      const puntoY = punto.y;

      return x >= puntoX - touchRadius && x <= puntoX + touchRadius
      && y >= puntoY - touchRadius && y <= puntoY + touchRadius;
    });

    return punto || null;
  };

  const renderPoints = () => {
    return puntos.map((punto, index) => (
      <View
        key={index}
        style={[
          styles.punto,
          { 
            left: punto.x,
            top: punto.y,
            backgroundColor: selectedPoint && selectedPoint.x === punto.x && selectedPoint.y === punto.y
              ? '#ce112d'
              : '#383838',
           },
        ]}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>{selectedDescription}</Text>
      <Image
        source={require('../assets/images/mapa2.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <TouchableOpacity onPress={handlePress} style={StyleSheet.absoluteFill} />
      {renderPoints()}
      {/* <Text style={styles.texto}>{selectedDescription}</Text> */}
      <TouchableOpacity 
      style={styles.inBut} 
      onPress={handleSubmit}
      >
              <View>
                <Text style={styles.textSign}>Ingresar</Text>
              </View>
            </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  image: {
    width: '100%',
    height: '100%',
    marginBottom: -140
  },
  punto: {
    width: 12,
    height: 12,
    borderRadius: 10,
    
    position: 'absolute',
  },
  texto: {
    marginBottom: -115,
    color: '#ce112d',
    fontWeight: "500",
    fontSize: 20,
  },
  header: {
    marginBottom: -160,
    color: '#000000',
    fontWeight: "500",
    fontSize: 20,
  },
  inBut: {
    width: '70%',
    backgroundColor: '#ce112d',
    alignItems: 'center',
    
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default MapSelection2;
