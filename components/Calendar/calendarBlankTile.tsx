import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/styles/Colors';
import { Typography } from '@/styles/Typography';
import { responsiveHeight } from 'react-native-responsive-dimensions';

interface EmptyTileProps {
  number: number;
}

const CalendarEmptyTile = ({ number }: EmptyTileProps) => {
  return (
    <View style={[styles.dayTile, styles.emptyTile]}>
      <Text style={[styles.dayText, styles.emptyDayText]}>{number}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dayTile: {
    flex: 1,
    height: responsiveHeight(9),
    backgroundColor: Colors.lightGrey,
    margin: 4,
    flexDirection: 'row',
    paddingHorizontal: 4,
    alignItems: 'flex-start',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.lightGrey,
  },
  emptyTile: {
    backgroundColor: Colors.paleGrey,
  },
  dayText: {
    color: Colors.deepGrey,
    fontSize: Typography.fontSizes.m,
    fontWeight: '500',
  },
  emptyDayText: {
    color: Colors.stoneGrey,
  },
});

export default CalendarEmptyTile;
