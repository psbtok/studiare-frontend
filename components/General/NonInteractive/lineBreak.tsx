import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '@/styles/Colors';
const LineBreak = () => {
  return <View style={styles.lineBreak}><Text>te</Text></View>;
};

const styles = StyleSheet.create({
  lineBreak: {
    height: 2,
    backgroundColor: Colors.mediumGrey,
    marginVertical: 12,
    // width: '100%',
    marginHorizontal: 16
},
});

export default LineBreak;
