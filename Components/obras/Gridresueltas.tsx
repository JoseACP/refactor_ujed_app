import React from 'react';
import { FlatList, View } from 'react-native';
import { ReportCard } from '../ReportCard';

const Gridresueltas = ({ data, onItemClick }: { data: any[]; onItemClick: (item: any) => void }) => {
  const displayedData = data;

  return (
    <FlatList
      data={displayedData}
      renderItem={({ item }) => (
        <ReportCard item={item} onPress={onItemClick} />
      )}
      keyExtractor={(item) => item.id?.toString()}
      numColumns={2}
      contentContainerStyle={{ paddingHorizontal: 7, paddingVertical: 8 }}
      columnWrapperStyle={{ justifyContent: 'flex-start' }}
      scrollEnabled={false}
    />
  );
};

export default Gridresueltas;
