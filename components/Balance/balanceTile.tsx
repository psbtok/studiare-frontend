import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/styles/Colors';
import { Typography } from '@/styles/Typography';
import words from '@/locales/ru';
import { AntDesign } from '@expo/vector-icons'; // Import AntDesign icon
import { router } from 'expo-router';

interface BalanceTileProps {
  balance: number;
}

function navigateTopUp() {
  router.push('/balance/topUp');
}

const BalanceTile = ({ balance }: BalanceTileProps) => {
  return (
    <View style={styles.tileContainer}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>{balance}</Text>
        <Text style={[styles.balanceText, styles.currency]}>{words.currency}</Text>
      </View>
        <TouchableOpacity onPress={navigateTopUp} style={styles.plusButton}>
          <AntDesign name="plus" size={36} color={Colors.lightGrey} />
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tileContainer: {
    borderRadius: 8,
    backgroundColor: Colors.deepGrey,
    marginTop: 6,
    paddingBottom: 8,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  balanceContainer: {
    flexDirection: 'row', 
  },
  balanceText: {
    color: Colors.lightGrey,
    fontSize: Typography.fontSizes.xxl,
    fontWeight: '500'
  },
  currency: { 
    marginLeft: 6
  },
  plusButton: {
    marginLeft: 4
  },
});

export default BalanceTile;
