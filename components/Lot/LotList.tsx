import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import LotListItem from './LotListItem';
import { getLotsService } from '@/app/services/lotService';
import { Lot } from '@/app/models';

export default function LotList() {
  const [lots, setLots] = useState<Lot[]>([]);

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const response = await getLotsService();
        setLots(response.results);
      } catch (error) {
        console.error('Error fetching lots:', error);
      }
    };

    fetchLots();
  }, []);

  const rowPairs = [];
  for (let i = 0; i < lots.length; i += 2) {
    rowPairs.push(lots.slice(i, i + 2));
  }

  return (
    <ScrollView style={styles.scrollView}>
      {rowPairs.map((pair, index) => (
        <View key={index} style={styles.row}>
          {pair.map((lot) => (
            <LotListItem key={lot.id} lot={lot} />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
