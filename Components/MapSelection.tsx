import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const MapSelection = () => {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [puntos, setPuntos] = useState([]);

  useEffect(() => {
    // Coordenadas proporcionales a la imagen, ajusta según tus necesidades
    const initialPuntos = [
      //Edificio E
      { x: 0.15, y: 0.432 },
      { x: 0.15, y: 0.472 },
      { x: 0.15, y: 0.51 },
      { x: 0.15, y: 0.55 },
      { x: 0.15, y: 0.59 },
      { x: 0.15, y: 0.627 },
      //Edificio D
      { x: 0.37, y: 0.41 },
      { x: 0.37, y: 0.442 },
      { x: 0.37, y: 0.523 },
      { x: 0.37, y: 0.556 },
      { x: 0.37, y: 0.59 },
      { x: 0.37, y: 0.627 },
      //Edifio C
      { x: 0.46, y: 0.3 },
      { x: 0.587, y: 0.3 },
      { x: 0.632, y: 0.3 },
      //Edificio G
      { x: 0.83, y: 0.305},
      // { x: 0.801, y: 0.37999},
      { x: 0.83, y: 0.416},
      { x: 0.83, y: 0.464},
      { x: 0.83, y: 0.507},
      //Edificio A
      { x: 0.78, y: 0.62},
    ];

    const calculatedPuntos = initialPuntos.map(punto => ({
      x: punto.x * Dimensions.get('window').width,
      y: punto.y * Dimensions.get('window').height,
    }));

    setPuntos(calculatedPuntos);
  }, []);

  const handlePress = (event) => {
    const x = event.nativeEvent.locationX;
    const y = event.nativeEvent.locationY;

    // Encuentra el punto seleccionado
    const puntoSeleccionado = findSelectedPoint(x, y);

    // Si se seleccionó un punto, actualiza el estado
    if (puntoSeleccionado) {
      setSelectedPoint(puntoSeleccionado);
    } else {
      // Si no se seleccionó un punto, maneja la lógica adicional o ignora
      console.log('Coordenadas seleccionadas:', { x, y });

      // Restablece el punto seleccionado si no se hizo clic en un punto
      setSelectedPoint(null);
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
      <Image
        source={require('../assets/images/mapa.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <TouchableOpacity onPress={handlePress} style={StyleSheet.absoluteFill} />
      {renderPoints()}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  punto: {
    width: 12,
    height: 12,
    borderRadius: 10,
    position: 'absolute',
  },
});

export default MapSelection;
