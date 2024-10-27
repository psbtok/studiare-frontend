import { Lot } from '@/app/models';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LotListItem({ lot }: { lot: Lot }) {
  const { title, description, starting_price, last_bid } = lot;
  const lastBidText = last_bid ? `Last Bid: ${last_bid.amount}` : 'No bids yet';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.startingPrice}>Starting Price: {starting_price}</Text>
      <Text style={styles.lastBid}>{lastBidText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#1a1a1a', 
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    color: '#ddd',
    marginVertical: 5,
  },
  startingPrice: {
    fontSize: 16,
    color: '#fff',
  },
  lastBid: {
    fontSize: 14,
    color: '#ffcc00', 
  },
});