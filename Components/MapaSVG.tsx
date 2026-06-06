import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import SvgUri from 'react-native-svg-uri';

const MapaSVG = ({ onRegionSelect }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleRegionPress = (region) => {
    setSelectedRegion(region);
    // Aquí puedes realizar acciones adicionales o enviar la región al backend
    onRegionSelect(region);
  };

  return (
    <View>
      {/* Cambia 'nombreDelArchivo.svg' por el nombre de tu archivo SVG en la carpeta assets */}
      <SvgUri
        width="200"
        height="200"
        source={require('../assets/images/PlantaAltaSVG.svg')}
      />
      {/* Añade más elementos TouchableOpacity según las regiones de tu mapa */}
      <TouchableOpacity
        onPress={() => handleRegionPress('region1')}
        style={{ position: 'absolute', top: 50, left: 80, width: 40, height: 40, backgroundColor: 'transparent' }}
      />
    </View>
  );
};

export default MapaSVG;
