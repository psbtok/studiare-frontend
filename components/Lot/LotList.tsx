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

  return (
    <ScrollView style={styles.scrollView}>
      {lots.map(lot => (
        <LotListItem key={lot.id} lot={lot} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
});
