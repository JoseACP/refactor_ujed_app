import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import {useNavigation} from '@react-navigation/native';

const MapSelection = () => {
  const navigation = useNavigation();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [puntos, setPuntos] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState("Selecciona tu ubicación");

  useEffect(() => {
    // Coordenadas proporcionales a la imagen, ajusta según tus necesidades
    const initialPuntos = [
      //Edificio E
      { x: 0.15, y: 0.432, description: 'Aula 1' },
      { x: 0.15, y: 0.472, description: 'Aula 2' },
      { x: 0.15, y: 0.51, description: 'Aula 3' },
      { x: 0.15, y: 0.55, description: 'Aula 4' },
      { x: 0.15, y: 0.59, description: 'Aula 5' },
      { x: 0.15, y: 0.627, description: 'Aula 6' },
      //Edificio D
      { x: 0.37, y: 0.41, description: 'Aula 7'},
      { x: 0.37, y: 0.442, description: 'Aula 8' },
      { x: 0.37, y: 0.523, description: 'Aula 9' },
      { x: 0.37, y: 0.556, description: 'Aula 10' },
      { x: 0.37, y: 0.59, description: 'Aula 11' },
      { x: 0.37, y: 0.627, description: 'Aula 12' },
      //Edifio C
      { x: 0.46, y: 0.3, description: 'Aula 13' },
      { x: 0.587, y: 0.3, description: 'Aula 14' },
      { x: 0.632, y: 0.3, description: 'Aula 15' },
      //Edificio G
      { x: 0.83, y: 0.305, description: 'Aula 16'},
      // { x: 0.801, y: 0.37999},
      { x: 0.83, y: 0.416, description: 'Aula 17'},
      { x: 0.83, y: 0.464, description: 'Aula 18'},
      { x: 0.83, y: 0.507, description: 'Aula 19'},
      //Edificio A
      { x: 0.78, y: 0.62, description: 'Aula 20'},
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
      setSelectedDescription(`Planta alta/${puntoSeleccionado.description}`);
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
        source={require('../assets/images/mapa.png')}
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

export default MapSelection;
